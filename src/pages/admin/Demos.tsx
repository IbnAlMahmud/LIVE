import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  setDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  CheckCircle2,
  Star,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  RotateCcw,
  Eye,
  Layers,
  Sparkles
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils';
import { DemoItem } from '@/types/demo';
import { mockDemos } from '@/data/mockDemos';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export default function AdminDemos() {
  const [demos, setDemos] = useState<DemoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'drafts' | 'featured'>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'media' | 'content' | 'casestudy'>('basic');

  const defaultFormState = {
    name: '',
    title: '',
    slug: '',
    category: 'Restaurant',
    industry: '',
    type: '',
    languages: 'English',
    shortDescription: '',
    description: '',
    thumbnail: '',
    heroImage: '',
    desktopPreview: '',
    tabletPreview: '',
    mobilePreview: '',
    previewVideo: '',
    galleryImages: [] as string[],
    liveUrl: '',
    caseStudyUrl: '',
    technologies: 'React 18, TypeScript, Tailwind CSS',
    features: '',
    featured: false,
    published: true,
    sortOrder: 1,
    caseStudy: {
      concept: '',
      challenge: '',
      experience: '',
      designDirection: '',
      result: ''
    }
  };

  const [formData, setFormData] = useState(defaultFormState);

  useEffect(() => {
    const q = query(collection(db, 'demos'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const dms: DemoItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          dms.push({
            id: docSnap.id,
            name: data.name || data.title || 'Untitled Demo',
            title: data.title || data.name || 'Untitled Demo',
            slug: data.slug || docSnap.id,
            category: data.category || 'Business',
            industry: data.industry || data.category || 'General',
            type: data.type || '',
            languages: data.languages || ['English'],
            shortDescription: data.shortDescription || data.description || '',
            description: data.description || data.shortDescription || '',
            thumbnail: data.thumbnail || '',
            heroImage: data.heroImage || '',
            desktopPreview: data.desktopPreview || data.thumbnail || '',
            tabletPreview: data.tabletPreview || '',
            mobilePreview: data.mobilePreview || '',
            previewVideo: data.previewVideo || '',
            galleryImages: data.galleryImages || [],
            liveUrl: data.liveUrl || data.url || '',
            url: data.url || data.liveUrl || '',
            caseStudyUrl: data.caseStudyUrl || '',
            technologies: data.technologies || [],
            features: data.features || [],
            featured: data.featured === true,
            published: data.published !== false,
            sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 99,
            caseStudy: data.caseStudy || {},
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt
          } as DemoItem);
        });

        dms.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
        setDemos(dms);
        setLoading(false);
      },
      (err) => {
        console.warn('Admin demos fetch error:', err);
        setDemos(mockDemos);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleOpenModal = (demo?: DemoItem) => {
    if (demo) {
      setEditingId(demo.id);
      setFormData({
        name: demo.name || demo.title,
        title: demo.title || demo.name,
        slug: demo.slug || '',
        category: demo.category || 'Restaurant',
        industry: demo.industry || '',
        type: demo.type || '',
        languages: demo.languages?.join(', ') || 'English',
        shortDescription: demo.shortDescription || '',
        description: demo.description || '',
        thumbnail: demo.thumbnail || '',
        heroImage: demo.heroImage || '',
        desktopPreview: demo.desktopPreview || '',
        tabletPreview: demo.tabletPreview || '',
        mobilePreview: demo.mobilePreview || '',
        previewVideo: demo.previewVideo || '',
        galleryImages: demo.galleryImages || [],
        liveUrl: demo.liveUrl || demo.url || '',
        caseStudyUrl: demo.caseStudyUrl || '',
        technologies: demo.technologies?.join(', ') || '',
        features: demo.features?.join('\n') || '',
        featured: demo.featured === true,
        published: demo.published !== false,
        sortOrder: demo.sortOrder ?? demos.length + 1,
        caseStudy: {
          concept: demo.caseStudy?.concept || '',
          challenge: demo.caseStudy?.challenge || '',
          experience: demo.caseStudy?.experience || '',
          designDirection: demo.caseStudy?.designDirection || '',
          result: demo.caseStudy?.result || ''
        }
      });
    } else {
      setEditingId(null);
      setFormData({
        ...defaultFormState,
        sortOrder: demos.length + 1
      });
    }
    setActiveFormTab('basic');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewGalleryUrl('');
  };

  const handleAddGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, newGalleryUrl.trim()]
      }));
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const generatedSlug =
        formData.slug.trim() ||
        formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const languagesList = formData.languages
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const techList = formData.technologies
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const featuresList = formData.features
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const dataToSave = {
        name: formData.name.trim(),
        title: formData.name.trim(),
        slug: generatedSlug,
        category: formData.category.trim(),
        industry: formData.industry.trim() || formData.category.trim(),
        type: formData.type.trim(),
        languages: languagesList.length > 0 ? languagesList : ['English'],
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        thumbnail: formData.thumbnail.trim(),
        heroImage: formData.heroImage.trim() || formData.thumbnail.trim(),
        desktopPreview: formData.desktopPreview.trim() || formData.thumbnail.trim(),
        tabletPreview: formData.tabletPreview.trim(),
        mobilePreview: formData.mobilePreview.trim(),
        previewVideo: formData.previewVideo.trim(),
        galleryImages: formData.galleryImages,
        liveUrl: formData.liveUrl.trim(),
        url: formData.liveUrl.trim(),
        caseStudyUrl: formData.caseStudyUrl.trim(),
        technologies: techList,
        features: featuresList,
        featured: formData.featured,
        published: formData.published,
        sortOrder: Number(formData.sortOrder) || 99,
        caseStudy: formData.caseStudy,
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        await updateDoc(doc(db, 'demos', editingId), dataToSave);
      } else {
        await addDoc(collection(db, 'demos'), {
          ...dataToSave,
          createdAt: new Date().toISOString()
        });
      }

      handleCloseModal();
    } catch (err) {
      console.error('Error saving demo:', err);
      alert('Failed to save demo. Please verify network/Firestore rules.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete demo "${name}"?`)) {
      try {
        await deleteDoc(doc(db, 'demos', id));
      } catch (err) {
        console.error('Error deleting demo:', err);
        alert('Failed to delete demo.');
      }
    }
  };

  const handleTogglePublished = async (demo: DemoItem) => {
    try {
      await updateDoc(doc(db, 'demos', demo.id), {
        published: !demo.published,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error toggling publish:', err);
    }
  };

  const handleToggleFeatured = async (demo: DemoItem) => {
    try {
      await updateDoc(doc(db, 'demos', demo.id), {
        featured: !demo.featured,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error toggling featured:', err);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= demos.length) return;

    const current = demos[index];
    const target = demos[targetIndex];

    try {
      await updateDoc(doc(db, 'demos', current.id), {
        sortOrder: target.sortOrder ?? targetIndex,
        updatedAt: new Date().toISOString()
      });
      await updateDoc(doc(db, 'demos', target.id), {
        sortOrder: current.sortOrder ?? index,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error swapping sort orders:', err);
    }
  };

  const handleRestoreStudioDefaults = async () => {
    if (window.confirm('Restore or update all 7 default studio demos in Firestore? Custom edits to other demos will remain.')) {
      try {
        for (const demo of mockDemos) {
          await setDoc(doc(db, 'demos', demo.id), {
            ...demo,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
        alert('Curated studio demos successfully refreshed in Firestore.');
      } catch (err) {
        console.error('Error seeding demos:', err);
        alert('Could not seed demos to Firestore.');
      }
    }
  };

  // Filter list by tab & search
  const filteredDemos = demos.filter((d) => {
    if (activeTab === 'published' && d.published === false) return false;
    if (activeTab === 'drafts' && d.published !== false) return false;
    if (activeTab === 'featured' && !d.featured) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = d.name?.toLowerCase().includes(q);
      const matchCat = d.category?.toLowerCase().includes(q);
      const matchInd = d.industry?.toLowerCase().includes(q);
      return matchName || matchCat || matchInd;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 selection:bg-fresh-green selection:text-white">
      <Helmet>
        <title>Demo Website Management | AureviaWeb Admin</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-border-color">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-elegant-green">
                Production Archives
              </span>
              <span className="text-border-color">/</span>
              <span className="text-xs font-mono text-text-muted">
                {demos.length} Total Demos
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
              Demo Websites & Showcases
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Manage interactive demo experiences, media assets, case studies, and live links.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRestoreStudioDefaults}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-border-color text-text-main text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
              title="Reseed 7 default studio showcases"
            >
              <RotateCcw size={14} className="text-slate-500" />
              <span>Reset Studio Demos</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-fresh-green text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span>Add Demo</span>
            </button>
          </div>
        </div>

        {/* Filters & Actions Bar */}
        <div className="my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tab Filter */}
          <div className="flex items-center gap-1 bg-white border border-border-color p-1 rounded-xl shadow-xs">
            {(['all', 'published', 'drafts', 'featured'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors",
                  activeTab === tab
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-text-main hover:bg-slate-50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search and View Mode */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search demos..."
                className="pl-9 pr-3 py-2 bg-white border border-border-color rounded-xl text-xs text-text-main placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fresh-green/30"
              />
            </div>

            <div className="flex items-center bg-white border border-border-color p-1 rounded-xl shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  viewMode === 'grid' ? "bg-slate-100 text-text-main" : "text-slate-400 hover:text-text-main"
                )}
                title="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  viewMode === 'list' ? "bg-slate-100 text-text-main" : "text-slate-400 hover:text-text-main"
                )}
                title="List View"
              >
                <ListIcon size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Demo Content Listing */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-fresh-green/30 border-t-fresh-green rounded-full animate-spin mx-auto mb-3" />
            <p className="font-mono text-xs text-text-muted uppercase">Loading Demos Database...</p>
          </div>
        ) : filteredDemos.length === 0 ? (
          <div className="bg-white border border-border-color rounded-2xl p-12 text-center my-6">
            <p className="text-sm font-semibold text-text-main">No demos found matching your filters.</p>
            <button
              type="button"
              onClick={() => handleOpenModal()}
              className="mt-4 text-xs font-bold text-fresh-green hover:underline"
            >
              + Create a new demo
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDemos.map((demo, idx) => (
              <div
                key={demo.id}
                className="bg-white border border-border-color rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/10] bg-slate-100 border-b border-border-color overflow-hidden group">
                  <OptimizedImage
                    src={demo.desktopPreview || demo.thumbnail}
                    alt={demo.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white font-mono text-[10px] font-bold uppercase backdrop-blur-xs">
                      #{demo.sortOrder ?? idx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-text-main font-mono text-[10px] font-bold uppercase border border-border-color backdrop-blur-xs">
                      {demo.category}
                    </span>
                  </div>

                  {/* Actions overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(demo)}
                      className={cn(
                        "p-1.5 rounded-full backdrop-blur-md transition-colors",
                        demo.featured ? "bg-amber-400 text-slate-950" : "bg-black/40 text-white hover:bg-black/60"
                      )}
                      title="Toggle Featured"
                    >
                      <Star size={13} className={demo.featured ? "fill-slate-950" : ""} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTogglePublished(demo)}
                      className={cn(
                        "p-1.5 rounded-full backdrop-blur-md transition-colors",
                        demo.published !== false ? "bg-fresh-green text-white" : "bg-slate-400 text-white"
                      )}
                      title={demo.published !== false ? "Published" : "Draft"}
                    >
                      <CheckCircle2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-base text-text-main">{demo.name}</h3>
                      <span className="text-[11px] font-mono text-slate-400 truncate max-w-[120px]">
                        /{demo.slug}
                      </span>
                    </div>

                    <p className="text-xs text-text-muted line-clamp-2 mb-3">
                      {demo.shortDescription || demo.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {demo.features?.slice(0, 3).map((f, i) => (
                        <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Row */}
                  <div className="pt-3 border-t border-border-color flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-400 hover:text-text-main disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(idx, 'down')}
                        disabled={idx === filteredDemos.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-text-main disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {demo.liveUrl && (
                        <a
                          href={demo.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-500 hover:text-text-main"
                          title="Open Live Demo"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenModal(demo)}
                        className="p-1.5 text-slate-500 hover:text-text-main hover:bg-slate-100 rounded-lg"
                        title="Edit Demo"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(demo.id, demo.name)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                        title="Delete Demo"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white border border-border-color rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-soft-white border-b border-border-color text-slate-400 font-mono uppercase">
                <tr>
                  <th className="p-3.5 pl-5">Order</th>
                  <th className="p-3.5">Demo</th>
                  <th className="p-3.5">Category / Type</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Featured</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {filteredDemos.map((demo, idx) => (
                  <tr key={demo.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 pl-5 font-mono text-slate-400">
                      #{demo.sortOrder ?? idx + 1}
                    </td>
                    <td className="p-3.5 font-bold text-text-main">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded bg-slate-100 overflow-hidden border border-border-color shrink-0">
                          <OptimizedImage src={demo.thumbnail} alt={demo.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div>{demo.name}</div>
                          <span className="text-[10px] font-mono text-slate-400">/{demo.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-text-main">{demo.category}</span>
                      <span className="block text-[11px] text-text-muted">{demo.type || demo.industry}</span>
                    </td>
                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(demo)}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                          demo.published !== false ? "bg-fresh-green/10 text-elegant-green" : "bg-slate-100 text-slate-500"
                        )}
                      >
                        {demo.published !== false ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(demo)}
                        className={cn(
                          "p-1 rounded-full",
                          demo.featured ? "text-amber-500" : "text-slate-300 hover:text-slate-400"
                        )}
                      >
                        <Star size={16} className={demo.featured ? "fill-amber-500" : ""} />
                      </button>
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {demo.liveUrl && (
                          <a
                            href={demo.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-text-main"
                            title="Open Live Site"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenModal(demo)}
                          className="p-1 text-slate-500 hover:text-text-main"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(demo.id, demo.name)}
                          className="p-1 text-rose-500 hover:text-rose-700"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Feature Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white border border-border-color rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-color bg-soft-white">
              <div>
                <h3 className="font-bold text-lg text-text-main">
                  {editingId ? `Edit Demo: ${formData.name}` : 'Create New Interactive Showcase Demo'}
                </h3>
                <p className="text-xs text-text-muted">
                  Configure presentation details, live links, preview assets, and editorial case studies.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-text-main"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-border-color bg-white">
              {(['basic', 'media', 'content', 'casestudy'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFormTab(tab)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors",
                    activeFormTab === tab
                      ? "border-fresh-green text-elegant-green"
                      : "border-transparent text-slate-400 hover:text-text-main"
                  )}
                >
                  {tab === 'basic' && '01. Basics & Identity'}
                  {tab === 'media' && '02. Media & Previews'}
                  {tab === 'content' && '03. Stack & Features'}
                  {tab === 'casestudy' && '04. Case Study'}
                </button>
              ))}
            </div>

            {/* Form Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: BASIC INFO */}
              {activeFormTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                        Demo Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value, title: e.target.value })}
                        placeholder="e.g. NOIRÉ"
                        className="w-full px-3.5 py-2.5 bg-soft-white border border-border-color rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                        Slug (URL identifier)
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="e.g. noire"
                        className="w-full px-3.5 py-2.5 bg-soft-white border border-border-color rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-soft-white border border-border-color rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:outline-none"
                      >
                        <option value="Restaurant">Restaurant</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Interior Design">Interior Design</option>
                        <option value="Hotel & Resort">Hotel & Resort</option>
                        <option value="E-Commerce">E-Commerce</option>
                        <option value="Technology">Technology</option>
                        <option value="Education">Education</option>
                        <option value="Business">Business</option>
                        <option value="Personal Brand">Personal Brand</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                        Industry / Sector
                      </label>
                      <input
                        type="text"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        placeholder="e.g. Hospitality & Dining"
                        className="w-full px-3.5 py-2.5 bg-soft-white border border-border-color rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                        Experience Type
                      </label>
                      <input
                        type="text"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        placeholder="e.g. Fine Dining Experience"
                        className="w-full px-3.5 py-2.5 bg-soft-white border border-border-color rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                        Supported Languages (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.languages}
                        onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                        placeholder="e.g. English, বাংলা"
                        className="w-full px-3.5 py-2.5 bg-soft-white border border-border-color rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                        Live Demo URL *
                      </label>
                      <input
                        type="url"
                        value={formData.liveUrl}
                        onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                        placeholder="https://noire-demo.aureviaweb.com"
                        className="w-full px-3.5 py-2.5 bg-soft-white border border-border-color rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                      Short Description (Showcase cards & teasers)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="Brief punchy description highlighting key conversion triggers..."
                      className="w-full px-3.5 py-2 bg-soft-white border border-border-color rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:outline-none"
                    />
                  </div>

                  {/* Status & Sorting Flags */}
                  <div className="p-4 bg-soft-white border border-border-color rounded-xl flex flex-wrap items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-main">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="w-4 h-4 text-fresh-green rounded border-border-color focus:ring-fresh-green"
                      />
                      <span>Published on Website</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-main">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 text-fresh-green rounded border-border-color focus:ring-fresh-green"
                      />
                      <span>Feature in Showcase Hero</span>
                    </label>

                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-xs font-bold text-text-muted">Display Sort Order:</span>
                      <input
                        type="number"
                        min={1}
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                        className="w-20 px-2 py-1 bg-white border border-border-color rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA & PREVIEWS */}
              {activeFormTab === 'media' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                        Main Thumbnail URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3.5 py-2.5 bg-soft-white border border-border-color rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:outline-none font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                        Desktop 16:9 Preview URL
                      </label>
                      <input
                        type="url"
                        value={formData.desktopPreview}
                        onChange={(e) => setFormData({ ...formData, desktopPreview: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3.5 py-2.5 bg-soft-white border border-border-color rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:outline-none font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Visual Preview Box */}
                  <div className="p-4 bg-slate-50 border border-border-color rounded-xl">
                    <span className="font-mono text-xs uppercase font-bold text-slate-400 block mb-2">
                      Live Image Preview Verification
                    </span>
                    <div className="relative aspect-[16/9] max-w-sm rounded-lg overflow-hidden border border-border-color bg-white">
                      <OptimizedImage
                        src={formData.desktopPreview || formData.thumbnail}
                        alt="Preview Test"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                        Tablet Preview URL (optional)
                      </label>
                      <input
                        type="url"
                        value={formData.tabletPreview}
                        onChange={(e) => setFormData({ ...formData, tabletPreview: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2.5 bg-soft-white border border-border-color rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:outline-none font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                        Mobile Preview URL (optional)
                      </label>
                      <input
                        type="url"
                        value={formData.mobilePreview}
                        onChange={(e) => setFormData({ ...formData, mobilePreview: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2.5 bg-soft-white border border-border-color rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:outline-none font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                      Preview Video URL (MP4 / WebM optional)
                    </label>
                    <input
                      type="url"
                      value={formData.previewVideo}
                      onChange={(e) => setFormData({ ...formData, previewVideo: e.target.value })}
                      placeholder="https://assets.example.com/demo.mp4"
                      className="w-full px-3.5 py-2.5 bg-soft-white border border-border-color rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:outline-none font-mono text-xs"
                    />
                  </div>

                  {/* Gallery Manager */}
                  <div className="p-4 bg-soft-white border border-border-color rounded-xl space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                      Gallery Images ({formData.galleryImages.length})
                    </label>
                    
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        placeholder="Paste additional page/screen image URL..."
                        className="flex-1 px-3 py-2 bg-white border border-border-color rounded-lg text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddGalleryImage}
                        className="px-4 py-2 bg-text-main text-white text-xs font-bold rounded-lg hover:bg-slate-800"
                      >
                        Add Image
                      </button>
                    </div>

                    {formData.galleryImages.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                        {formData.galleryImages.map((img, i) => (
                          <div key={i} className="relative aspect-[16/10] rounded-lg overflow-hidden border border-border-color group">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(i)}
                              className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: STACK & FEATURES */}
              {activeFormTab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                      Full Narrative Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed project description..."
                      className="w-full px-3.5 py-2.5 bg-soft-white border border-border-color rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                      Core Technologies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="React 18, TypeScript, Tailwind CSS, Framer Motion..."
                      className="w-full px-3.5 py-2.5 bg-soft-white border border-border-color rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                      Key Interactive Features (one feature per line)
                    </label>
                    <textarea
                      rows={5}
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      placeholder="Interactive Menu&#10;Table Reservation Engine&#10;Culinary Gallery&#10;Location Map"
                      className="w-full px-3.5 py-2.5 bg-soft-white border border-border-color rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:outline-none font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: CASE STUDY */}
              {activeFormTab === 'casestudy' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                      01 / Conceptual Vision
                    </label>
                    <textarea
                      rows={2}
                      value={formData.caseStudy.concept}
                      onChange={(e) => setFormData({
                        ...formData,
                        caseStudy: { ...formData.caseStudy, concept: e.target.value }
                      })}
                      placeholder="The guiding vision and conceptual direction..."
                      className="w-full px-3.5 py-2 bg-soft-white border border-border-color rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                      02 / Business Challenge
                    </label>
                    <textarea
                      rows={2}
                      value={formData.caseStudy.challenge}
                      onChange={(e) => setFormData({
                        ...formData,
                        caseStudy: { ...formData.caseStudy, challenge: e.target.value }
                      })}
                      placeholder="What commercial or architectural obstacle was solved..."
                      className="w-full px-3.5 py-2 bg-soft-white border border-border-color rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                      03 / Interaction & Experience Design
                    </label>
                    <textarea
                      rows={2}
                      value={formData.caseStudy.experience}
                      onChange={(e) => setFormData({
                        ...formData,
                        caseStudy: { ...formData.caseStudy, experience: e.target.value }
                      })}
                      placeholder="How users interact with the interface..."
                      className="w-full px-3.5 py-2 bg-soft-white border border-border-color rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                      04 / Visual Direction & Aesthetics
                    </label>
                    <textarea
                      rows={2}
                      value={formData.caseStudy.designDirection}
                      onChange={(e) => setFormData({
                        ...formData,
                        caseStudy: { ...formData.caseStudy, designDirection: e.target.value }
                      })}
                      placeholder="Palette, typography, and optical framing..."
                      className="w-full px-3.5 py-2 bg-soft-white border border-border-color rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                      05 / Performance & Measured Outcome
                    </label>
                    <textarea
                      rows={2}
                      value={formData.caseStudy.result}
                      onChange={(e) => setFormData({
                        ...formData,
                        caseStudy: { ...formData.caseStudy, result: e.target.value }
                      })}
                      placeholder="Lighthouse scores, conversion lifts, client feedback..."
                      className="w-full px-3.5 py-2 bg-soft-white border border-border-color rounded-xl text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-border-color flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-text-muted font-mono">
                  <span>Tab: {activeFormTab.toUpperCase()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 rounded-xl border border-border-color text-xs font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-fresh-green text-white text-xs font-bold hover:bg-emerald-600 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {isSaving ? 'Saving...' : editingId ? 'Update Demo' : 'Create Demo'}
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
