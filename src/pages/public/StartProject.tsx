import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function StartProject() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    phone: '',
    websiteType: '',
    budget: '',
    message: ''
  });

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        status: 'New',
        source: 'Start Project Form',
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting lead:", error);
      alert("There was an error submitting your request. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { title: "About You" },
    { title: "Project Type" },
    { title: "Budget" },
    { title: "Details" }
  ];

  return (
    <>
      <Helmet>
        <title>Start a Project | AureviaWeb</title>
      </Helmet>

      <div className="bg-soft-white min-h-[80vh] py-16 md:py-24 border-b border-border-color">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-border-color"
            >
              <div className="w-20 h-20 bg-soft-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-fresh-green" />
              </div>
              <h2 className="text-3xl font-bold text-text-main mb-4">Project Request Received</h2>
              <p className="text-text-muted mb-8 max-w-lg mx-auto">
                Thank you for reaching out, {formData.name}. We've received your details and will be in touch within 24 hours to discuss the next steps.
              </p>
              <a href="/" className="inline-flex items-center justify-center rounded-full bg-fresh-green px-8 py-3.5 text-base font-semibold text-white hover:bg-elegant-green transition-all">
                Return to Homepage
              </a>
            </motion.div>
          ) : (
            <>
              <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-4">Let's build something exceptional.</h1>
                <p className="text-lg text-text-muted">Fill out the form below to help us understand your vision.</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-12">
                <div className="flex justify-between mb-2">
                  {steps.map((s, i) => (
                    <div key={i} className={cn("text-xs font-semibold uppercase tracking-wider transition-colors", step > i ? "text-fresh-green" : "text-gray-400")}>
                      Step 0{i + 1}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                   {steps.map((_, i) => (
                     <div key={i} className="h-1 flex-1 rounded-full bg-gray-200 overflow-hidden relative">
                       <motion.div 
                         className="absolute top-0 left-0 bottom-0 bg-fresh-green"
                         initial={{ width: 0 }}
                         animate={{ width: step > i ? "100%" : "0%" }}
                         transition={{ duration: 0.3 }}
                       />
                     </div>
                   ))}
                </div>
              </div>

              {/* Form container */}
              <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-border-color relative overflow-hidden">
                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-2xl font-bold text-text-main mb-6">About You</h2>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-semibold text-text-main mb-2">Your Name</label>
                            <input 
                              type="text" required
                              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                              className="w-full bg-soft-white border border-border-color rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-fresh-green focus:border-transparent transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-text-main mb-2">Email Address</label>
                            <input 
                              type="email" required
                              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                              className="w-full bg-soft-white border border-border-color rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-fresh-green focus:border-transparent transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-text-main mb-2">Phone / WhatsApp</label>
                            <input 
                              type="tel"
                              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                              className="w-full bg-soft-white border border-border-color rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-fresh-green focus:border-transparent transition-all"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-2xl font-bold text-text-main mb-6">Business & Project Type</h2>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-semibold text-text-main mb-2">Business/Brand Name</label>
                            <input 
                              type="text" required
                              value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})}
                              className="w-full bg-soft-white border border-border-color rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-fresh-green focus:border-transparent transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-text-main mb-4">What kind of website do you need?</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {['Business / Corporate', 'E-commerce / Store', 'Portfolio / Creative', 'Restaurant / Hotel', 'Real Estate', 'Custom Web App'].map(type => (
                                <button
                                  type="button"
                                  key={type}
                                  onClick={() => setFormData({...formData, websiteType: type})}
                                  className={cn(
                                    "p-4 rounded-xl text-left border transition-all text-sm font-semibold",
                                    formData.websiteType === type 
                                      ? "border-fresh-green bg-soft-green text-fresh-green" 
                                      : "border-border-color hover:border-gray-300 bg-white text-text-main"
                                  )}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-2xl font-bold text-text-main mb-6">Budget Expectations</h2>
                        <div>
                          <label className="block text-sm font-semibold text-text-main mb-4">Select your estimated budget range</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {['৳5,000 - ৳10,000', '৳10,000 - ৳25,000', '৳25,000 - ৳50,000', '৳50,000+'].map(budget => (
                              <button
                                type="button"
                                key={budget}
                                onClick={() => setFormData({...formData, budget})}
                                className={cn(
                                  "p-4 rounded-xl text-left border transition-all text-sm font-semibold",
                                  formData.budget === budget 
                                    ? "border-fresh-green bg-soft-green text-fresh-green" 
                                    : "border-border-color hover:border-gray-300 bg-white text-text-main"
                                )}
                              >
                                {budget}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-2xl font-bold text-text-main mb-6">Project Details</h2>
                        <div>
                          <label className="block text-sm font-semibold text-text-main mb-2">Tell us more about your project goals</label>
                          <textarea 
                            required rows={6}
                            value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                            className="w-full bg-soft-white border border-border-color rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-fresh-green focus:border-transparent transition-all resize-none"
                            placeholder="Share your ideas, reference websites, or specific features you need..."
                          ></textarea>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="mt-10 pt-6 border-t border-border-color flex items-center justify-between">
                    {step > 1 ? (
                      <button type="button" onClick={handlePrev} className="flex items-center gap-2 text-text-muted font-semibold hover:text-text-main transition-colors">
                        <ArrowLeft size={18} /> Back
                      </button>
                    ) : <div></div>}

                    {step < 4 ? (
                      <button 
                        type="button" 
                        onClick={handleNext} 
                        disabled={
                          (step === 1 && (!formData.name || !formData.email)) ||
                          (step === 2 && (!formData.businessName || !formData.websiteType)) ||
                          (step === 3 && !formData.budget)
                        }
                        className="flex items-center justify-center gap-2 rounded-full bg-fresh-green px-6 py-3 text-sm font-semibold text-white hover:bg-elegant-green transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next Step <ArrowRight size={18} />
                      </button>
                    ) : (
                      <button 
                        type="submit" 
                        disabled={isSubmitting || !formData.message}
                        className="flex items-center justify-center gap-2 rounded-full bg-fresh-green px-8 py-3 text-sm font-semibold text-white hover:bg-elegant-green transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Project Request"} <CheckCircle2 size={18} />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
