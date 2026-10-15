import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Edit2, Trash2, X, Search, Filter, MoreVertical, LayoutGrid, List as ListIcon, CheckCircle2, Globe, Star, FolderOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  slug?: string;
  description: string;
  thumbnail: string;
  category: string;
  industry: string;
  featured?: boolean;
  published?: boolean;
  createdAt: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    thumbnail: '',
    category: '',
    industry: '',
    featured: false,
    published: true
  });

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const projs: Project[] = [];
      snapshot.forEach((doc) => {
        projs.push({ id: doc.id, ...doc.data() } as Project);
      });
      setProjects(projs);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingId(project.id);
      setFormData({
        title: project.title,
        slug: project.slug || '',
        description: project.description,
        thumbnail: project.thumbnail,
        category: project.category,
        industry: project.industry || '',
        featured: project.featured || false,
        published: project.published !== false
      });
    } else {
      setEditingId(null);
      setFormData({ 
        title: '', 
        slug: '',
        description: '', 
        thumbnail: '', 
        category: '', 
        industry: '',
        featured: false,
        published: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      };

      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), dataToSave);
      } else {
        await addDoc(collection(db, 'projects'), {
          ...dataToSave,
          createdAt: new Date().toISOString()
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the project "${title}"? This cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, 'projects', id));
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const toggleFeatured = async (project: Project) => {
    try {
      await updateDoc(doc(db, 'projects', project.id), {
        featured: !project.featured
      });
    } catch (error) {
      console.error("Error updating featured status:", error);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Projects | AureviaWeb Admin</title>
      </Helmet>
      
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your portfolio projects and case studies.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-charcoal text-white px-5 py-2.5 rounded-lg hover:bg-navy transition-all font-medium text-sm shadow-sm"
          >
            <Plus size={18} />
            <span>New Project</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-1.5 rounded-md transition-colors", viewMode === 'grid' ? "bg-white shadow-sm text-charcoal" : "text-gray-500")}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-1.5 rounded-md transition-colors", viewMode === 'list' ? "bg-white shadow-sm text-charcoal" : "text-gray-500")}
              >
                <ListIcon size={18} />
              </button>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-modern-blue rounded-full animate-spin"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 border-dashed flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <FolderOpen size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No projects found</h3>
            <p className="text-gray-500 text-sm max-w-sm mb-6">You don't have any projects matching your criteria. Create your first project to showcase your work.</p>
            <button onClick={() => handleOpenModal()} className="text-modern-blue font-semibold text-sm hover:underline">
              + Add a new project
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group flex flex-col hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 border-b border-gray-100">
                  <img src={project.thumbnail || undefined} alt={project.title} className="w-full h-full object-cover" />
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    {project.featured && (
                      <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                        <Star size={12} fill="currentColor" /> Featured
                      </span>
                    )}
                    {!project.published && (
                      <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded shadow-sm">
                        Draft
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button 
                      onClick={() => handleOpenModal(project)} 
                      className="p-2.5 bg-white rounded-full text-charcoal hover:text-modern-blue hover:scale-110 transition-transform shadow-lg"
                      title="Edit Project"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id, project.title)} 
                      className="p-2.5 bg-white rounded-full text-red-600 hover:bg-red-50 hover:scale-110 transition-transform shadow-lg"
                      title="Delete Project"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-base text-gray-900 line-clamp-1">{project.title}</h3>
                  <div className="flex items-center gap-2 mt-1 mb-3 text-xs text-gray-500 font-medium">
                    <span>{project.category}</span>
                    {project.industry && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>{project.industry}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-auto">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200">
                          <img className="h-12 w-16 object-cover" src={project.thumbnail || undefined} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{project.title}</div>
                          <div className="text-sm text-gray-500">{project.slug || 'no-slug'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.category}</div>
                      <div className="text-sm text-gray-500">{project.industry}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        {project.published ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Draft
                          </span>
                        )}
                        {project.featured && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                         <button onClick={() => toggleFeatured(project)} className="text-gray-400 hover:text-amber-500 p-1" title="Toggle Featured">
                           <Star size={18} fill={project.featured ? "currentColor" : "none"} className={project.featured ? "text-amber-500" : ""} />
                         </button>
                         <button onClick={() => handleOpenModal(project)} className="text-gray-400 hover:text-modern-blue p-1">
                           <Edit2 size={18} />
                         </button>
                         <button onClick={() => handleDelete(project.id, project.title)} className="text-gray-400 hover:text-red-600 p-1">
                           <Trash2 size={18} />
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

      {/* Slide-over Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-navy/20 backdrop-blur-sm z-[60] flex justify-end">
          <div 
            className="absolute inset-0" 
            onClick={handleCloseModal}
          ></div>
          <div className="bg-white w-full max-w-lg h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Form Groups */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Basic Info</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm" placeholder="e.g. Acme Corp E-commerce" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug (Optional)</label>
                  <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm" placeholder="acme-corp-ecommerce" />
                  <p className="text-xs text-gray-500 mt-1">Auto-generated if left empty.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                  <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm resize-none" placeholder="Short description of the project..." />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Categorization</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                    <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Web App" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industry</label>
                    <input type="text" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} placeholder="e.g. Retail" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Media</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Thumbnail URL</label>
                  <input required type="url" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm mb-3" placeholder="https://..." />
                  {formData.thumbnail && (
                     <div className="w-full h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative">
                       <img src={formData.thumbnail || undefined} className="w-full h-full object-cover" alt="Preview" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%23cbd5e1" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>' }} />
                     </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Visibility</h3>
                
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <input 
                    type="checkbox" 
                    id="published"
                    checked={formData.published} 
                    onChange={e => setFormData({...formData, published: e.target.checked})} 
                    className="w-4 h-4 text-modern-blue rounded border-gray-300 focus:ring-modern-blue" 
                  />
                  <label htmlFor="published" className="text-sm font-semibold text-gray-900 cursor-pointer flex-1">
                    Published <span className="block text-xs font-normal text-gray-500">Visible on the public website</span>
                  </label>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <input 
                    type="checkbox" 
                    id="featured"
                    checked={formData.featured} 
                    onChange={e => setFormData({...formData, featured: e.target.checked})} 
                    className="w-4 h-4 text-modern-blue rounded border-gray-300 focus:ring-modern-blue" 
                  />
                  <label htmlFor="featured" className="text-sm font-semibold text-gray-900 cursor-pointer flex-1">
                    Featured Project <span className="block text-xs font-normal text-gray-500">Show on the homepage showcase</span>
                  </label>
                </div>
              </div>

            </form>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSaving}
                onClick={handleSubmit}
                className="px-6 py-2 bg-charcoal text-white rounded-lg text-sm font-semibold hover:bg-navy transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Save Project
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
