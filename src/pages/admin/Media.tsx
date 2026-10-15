import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Image as ImageIcon, Upload, Search, Trash2, Copy, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: string;
  url: string;
  name: string;
  size: string;
  date: string;
  path: string;
}

export default function Media() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'media'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items: MediaItem[] = [];
      snapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() } as MediaItem);
      });
      setMediaItems(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    const file = e.target.files[0];
    const timestamp = new Date().getTime();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `media/${timestamp}_${safeName}`;
    const storageRef = ref(storage, storagePath);
    
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        console.error("Upload error:", error);
        alert("Upload failed: " + error.message);
        setUploading(false);
      }, 
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, 'media'), {
            name: file.name,
            url: downloadURL,
            path: storagePath,
            size: formatBytes(file.size),
            date: new Date().toISOString()
          });
        } catch (dbError) {
          console.error("Error saving media record:", dbError);
        } finally {
          setUploading(false);
          setUploadProgress(0);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      }
    );
  };

  const handleDelete = async (id: string, path: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    
    try {
      if (path) {
        const fileRef = ref(storage, path);
        try {
          await deleteObject(fileRef);
        } catch (storageErr: any) {
          if (storageErr.code !== 'storage/object-not-found') {
             throw storageErr;
          }
        }
      }
      await deleteDoc(doc(db, 'media', id));
    } catch (error: any) {
      console.error("Error deleting media:", error);
      alert("Failed to delete media: " + error.message);
    }
  };

  const filteredMedia = mediaItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <Helmet>
        <title>Media Library | AureviaWeb Admin</title>
      </Helmet>
      
      <div className="flex flex-col h-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="text-modern-blue" /> Media Library
            </h1>
            <p className="text-sm text-gray-500 mt-1">Upload and manage images for projects, demos, and blog posts.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {uploading && (
               <div className="text-sm font-semibold text-modern-blue flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-modern-blue border-t-transparent rounded-full animate-spin"></div>
                 Uploading {Math.round(uploadProgress)}%
               </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 bg-charcoal text-white px-5 py-2.5 rounded-lg hover:bg-navy transition-all font-medium text-sm shadow-sm disabled:opacity-50"
            >
              <Upload size={18} />
              <span>Upload Files</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search media files..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
             <div className="w-8 h-8 border-4 border-gray-200 border-t-modern-blue rounded-full animate-spin"></div>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
             <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
             <h3 className="text-lg font-medium text-gray-900">No media yet</h3>
             <p className="mt-1 text-sm text-gray-500">Upload images to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-12">
            {filteredMedia.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group flex flex-col">
                <div className="aspect-square relative overflow-hidden bg-gray-100 border-b border-gray-100">
                  <img src={item.url || undefined} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <button 
                      onClick={() => handleCopy(item.id, item.url)}
                      className="p-2 bg-white rounded-full text-charcoal hover:text-modern-blue transition-colors shadow-sm"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id, item.path)}
                      className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                      title="Delete Image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-bold text-xs text-gray-900 truncate mb-1" title={item.name}>{item.name}</p>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium">
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    <span>{item.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
