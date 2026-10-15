import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MessageCircle, MapPin, ArrowRight } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        source: 'Contact Page',
        status: 'New',
        createdAt: new Date()
      });
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Contact | AureviaWeb Studio</title></Helmet>
      
      <section className="pt-12 pb-24 lg:pt-16 lg:pb-32 bg-soft-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-charcoal mb-6">Let's talk.</h1>
          <p className="text-xl text-text-muted font-medium max-w-2xl mx-auto">
            Have a project in mind or a question about our services? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <div>
              <h2 className="text-3xl font-bold text-charcoal mb-8">Get in Touch</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-soft-green text-elegant-green rounded-xl flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal mb-1">Email Us</h3>
                    <p className="text-text-muted font-medium mb-2">For general inquiries and project requests.</p>
                    <a href="mailto:hello@aureviaweb.dev" className="text-elegant-green font-bold hover:underline">hello@aureviaweb.dev</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal mb-1">WhatsApp</h3>
                    <p className="text-text-muted font-medium mb-2">For faster communication and quick questions.</p>
                    <a href="https://wa.me/8801402884798" target="_blank" rel="noreferrer" className="text-green-600 font-bold hover:underline">+880 1402-884798</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-50 text-charcoal rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal mb-1">Call Us</h3>
                    <p className="text-text-muted font-medium mb-2">Available during standard business hours.</p>
                    <a href="tel:+8801402884798" className="text-charcoal font-bold hover:underline">+880 1402-884798</a>
                  </div>
                </div>
              </div>
              
              <div className="mt-16 p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                <h3 className="text-xl font-bold text-charcoal mb-4">Ready to start a project?</h3>
                <p className="text-text-muted font-medium mb-6">Use our dedicated project brief form to give us the details we need to provide an accurate proposal.</p>
                <a href="/start-project" className="inline-flex items-center justify-center rounded-full bg-soft-green text-text-main px-6 py-3 text-sm font-bold text-text-main hover:bg-navy transition-all">
                  Fill out Project Brief <ArrowRight size={16} className="ml-2" />
                </a>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-100 relative">
                <h2 className="text-2xl font-bold text-charcoal mb-6">Send a Message</h2>
                {success ? (
                  <div className="bg-green-50 text-green-800 p-8 rounded-xl text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
                    <button onClick={() => setSuccess(false)} className="mt-6 text-sm font-bold text-green-700 hover:underline">Send another message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-charcoal mb-2">Full Name</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-modern-blue outline-none transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-charcoal mb-2">Email Address</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-modern-blue outline-none transition-all" placeholder="john@company.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-charcoal mb-2">Message</label>
                      <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-modern-blue outline-none transition-all resize-none" placeholder="How can we help you?" />
                    </div>
                    <button type="submit" disabled={submitting} className="w-full rounded-xl bg-fresh-green text-white px-6 py-4 text-base font-bold  hover:bg-elegant-green transition-all disabled:opacity-70 shadow-lg shadow-fresh-green/20">
                      {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
}
