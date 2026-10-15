import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDemos } from '@/hooks/useContent';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import {
  Monitor,
  Tablet,
  Smartphone,
  ArrowLeft,
  ArrowUpRight,
  ArrowRight,
  Share2,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  Layers,
  Heart,
  Globe
} from 'lucide-react';
import { trackEvent } from '@/components/analytics/MetaPixel';
import { useFavorites } from '@/lib/demoStorage';
import { cn } from '@/lib/utils';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export default function DemoDetail() {
  const { slug } = useParams();
  const { demos, loading } = useDemos();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-3 border-fresh-green/30 border-t-fresh-green rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
          Loading Demo Presentation...
        </p>
      </div>
    );
  }

  const demo = demos.find((d) => d.slug === slug || d.id === slug);

  if (!demo) {
    return <Navigate to="/demos" replace />;
  }

  // Aggregate media items for interactive inspection
  const mediaGallery = [
    demo.desktopPreview || demo.thumbnail,
    ...(demo.galleryImages || [])
  ].filter(Boolean);

  const activeMediaSrc = mediaGallery[activeMediaIndex] || demo.desktopPreview || demo.thumbnail;

  const handleShare = (channel: 'copy' | 'whatsapp' | 'facebook') => {
    const url = window.location.href;
    trackEvent('ShareDemo', {
      demo_name: demo.name,
      demo_slug: demo.slug,
      channel
    });

    if (channel === 'copy') {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } else if (channel === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out the ${demo.name} interactive website demo on AureviaWeb: ${url}`)}`, '_blank');
    } else if (channel === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }
  };

  const handleOpenLiveDemo = () => {
    trackEvent('OpenLiveDemo', {
      demo_name: demo.name,
      demo_slug: demo.slug,
      demo_category: demo.category,
      live_url: demo.liveUrl
    });
  };

  return (
    <div className="min-h-screen bg-white selection:bg-fresh-green selection:text-white">
      <Helmet>
        <title>{demo.name} — Interactive Website Demo | AureviaWeb Studio</title>
        <meta
          name="description"
          content={demo.shortDescription || `Explore the interactive ${demo.name} website demo designed by AureviaWeb.`}
        />
        <meta property="og:title" content={`${demo.name} — Interactive Website Demo | AureviaWeb`} />
        <meta property="og:description" content={demo.shortDescription || demo.description} />
        <meta property="og:image" content={demo.thumbnail} />
      </Helmet>

      {/* Top Studio Control Bar */}
      <header className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-border-color py-3 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between gap-4">
          
          {/* Breadcrumb & Title */}
          <div className="flex items-center gap-3">
            <Link
              to="/demos"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-text-muted hover:text-text-main transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Demos</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono font-bold text-elegant-green uppercase">
              {demo.name}
            </span>
          </div>

          {/* Viewport Modes */}
          <div className="hidden md:flex items-center gap-1 bg-soft-white border border-border-color p-1 rounded-full">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                device === 'desktop'
                  ? "bg-white text-text-main shadow-xs"
                  : "text-slate-500 hover:text-text-main"
              )}
            >
              <Monitor size={14} />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('tablet')}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                device === 'tablet'
                  ? "bg-white text-text-main shadow-xs"
                  : "text-slate-500 hover:text-text-main"
              )}
            >
              <Tablet size={14} />
              <span>Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                device === 'mobile'
                  ? "bg-white text-text-main shadow-xs"
                  : "text-slate-500 hover:text-text-main"
              )}
            >
              <Smartphone size={14} />
              <span>Mobile</span>
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleFavorite(demo.id)}
              className={cn(
                "p-2 rounded-full border transition-colors",
                isFavorite(demo.id)
                  ? "bg-rose-50 border-rose-200 text-rose-500"
                  : "bg-soft-white border-border-color text-slate-400 hover:text-text-main"
              )}
              title={isFavorite(demo.id) ? "Saved" : "Save Demo"}
            >
              <Heart size={14} className={isFavorite(demo.id) ? "fill-rose-500" : ""} />
            </button>

            {demo.liveUrl ? (
              <a
                href={demo.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOpenLiveDemo}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-fresh-green text-white text-xs font-bold hover:bg-emerald-600 transition-colors shadow-xs"
              >
                <span>Launch Live Demo</span>
                <ArrowUpRight size={14} />
              </a>
            ) : (
              <span className="px-3 py-2 text-xs font-mono text-slate-400 bg-slate-100 rounded-full">
                Staging
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Hero Presentation Header */}
      <section className="bg-soft-white py-12 sm:py-16 border-b border-border-color">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3 font-mono text-xs text-text-muted">
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-border-color font-bold text-elegant-green uppercase">
                {demo.category}
              </span>
              <span>·</span>
              <span>{demo.type || demo.industry}</span>
              {demo.languages && demo.languages.length > 0 && (
                <>
                  <span>·</span>
                  <span>{demo.languages.join(' + ')}</span>
                </>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-main tracking-tight leading-tight">
              {demo.name}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-text-muted leading-relaxed max-w-2xl">
              {demo.shortDescription || demo.description}
            </p>

            {/* Micro Share Actions */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">Share Concept:</span>
              <button
                type="button"
                onClick={() => handleShare('copy')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-border-color text-xs font-semibold text-text-main hover:bg-slate-50 transition-colors"
              >
                {copiedLink ? <Check size={12} className="text-fresh-green" /> : <Copy size={12} />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleShare('whatsapp')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-border-color text-xs font-semibold text-text-main hover:bg-slate-50 transition-colors"
              >
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Viewport Stage */}
      <section className="py-10 sm:py-16 bg-slate-50 border-b border-border-color">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          {/* Interactive Viewport Frame Container */}
          <div className="flex justify-center items-center">
            <div
              className={cn(
                "transition-all duration-500 ease-in-out bg-white border border-border-color shadow-2xl overflow-hidden",
                device === 'desktop' && "w-full max-w-6xl rounded-2xl md:rounded-[2rem]",
                device === 'tablet' && "w-[768px] rounded-3xl",
                device === 'mobile' && "w-[390px] rounded-[2.5rem]"
              )}
            >
              {/* Browser Header Strip */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-100/90 border-b border-border-color">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>

                <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-white border border-border-color text-[11px] font-mono text-slate-500 max-w-sm truncate">
                  <Globe size={11} className="text-slate-400 shrink-0" />
                  <span className="truncate">{demo.liveUrl ? demo.liveUrl.replace('https://', '') : `${demo.slug}.aureviaweb.com`}</span>
                </div>

                <div className="flex items-center gap-2">
                  {demo.liveUrl && (
                    <a
                      href={demo.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleOpenLiveDemo}
                      className="p-1 rounded-md text-slate-500 hover:text-text-main"
                      title="Open in new window"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              {/* Viewport Frame Content */}
              <div className="relative bg-white overflow-hidden">
                {demo.previewVideo ? (
                  <video
                    src={demo.previewVideo}
                    controls
                    autoPlay
                    muted
                    loop
                    className="w-full h-auto aspect-[16/9] object-cover"
                  />
                ) : (
                  <div className={cn(
                    "relative overflow-hidden bg-slate-100",
                    device === 'desktop' && "aspect-[16/9]",
                    device === 'tablet' && "aspect-[3/4]",
                    device === 'mobile' && "aspect-[9/16]"
                  )}>
                    <OptimizedImage
                      src={
                        device === 'mobile'
                          ? (demo.mobilePreview || activeMediaSrc)
                          : device === 'tablet'
                          ? (demo.tabletPreview || activeMediaSrc)
                          : activeMediaSrc
                      }
                      alt={demo.name}
                      priority={true}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gallery Switcher Thumbnails */}
          {mediaGallery.length > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3 overflow-x-auto py-2">
              {mediaGallery.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveMediaIndex(i)}
                  className={cn(
                    "relative w-20 sm:w-28 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all shrink-0",
                    activeMediaIndex === i
                      ? "border-fresh-green ring-2 ring-fresh-green/20"
                      : "border-border-color opacity-70 hover:opacity-100"
                  )}
                >
                  <OptimizedImage src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Specifications & Editorial Case Study */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left: Editorial Case Study Breakdown */}
            <div className="lg:col-span-8 space-y-12">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-elegant-green block mb-2">
                  Editorial Case Study
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight">
                  Design Architecture & Strategy
                </h2>
              </div>

              {/* Concept */}
              {demo.caseStudy?.concept && (
                <div className="border-l-2 border-fresh-green pl-6 py-1">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-text-muted mb-2">
                    01 / Conceptual Vision
                  </h3>
                  <p className="text-text-main text-base sm:text-lg leading-relaxed font-medium">
                    {demo.caseStudy.concept}
                  </p>
                </div>
              )}

              {/* Challenge */}
              {demo.caseStudy?.challenge && (
                <div className="border-l-2 border-slate-300 pl-6 py-1">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-text-muted mb-2">
                    02 / The Business Challenge
                  </h3>
                  <p className="text-text-muted text-base leading-relaxed">
                    {demo.caseStudy.challenge}
                  </p>
                </div>
              )}

              {/* Experience */}
              {demo.caseStudy?.experience && (
                <div className="border-l-2 border-slate-300 pl-6 py-1">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-text-muted mb-2">
                    03 / Interaction & Experience Design
                  </h3>
                  <p className="text-text-muted text-base leading-relaxed">
                    {demo.caseStudy.experience}
                  </p>
                </div>
              )}

              {/* Design Direction */}
              {demo.caseStudy?.designDirection && (
                <div className="border-l-2 border-slate-300 pl-6 py-1">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-text-muted mb-2">
                    04 / Visual Direction & Aesthetics
                  </h3>
                  <p className="text-text-muted text-base leading-relaxed">
                    {demo.caseStudy.designDirection}
                  </p>
                </div>
              )}

              {/* Result */}
              {demo.caseStudy?.result && (
                <div className="bg-soft-white border border-border-color rounded-2xl p-6 sm:p-8">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-elegant-green mb-2">
                    05 / Performance & Measured Outcome
                  </h3>
                  <p className="text-text-main text-base sm:text-lg font-semibold leading-relaxed">
                    {demo.caseStudy.result}
                  </p>
                </div>
              )}
            </div>

            {/* Right: Technical Blueprint & Key Deliverables */}
            <div className="lg:col-span-4 space-y-8">
              {/* Technical Spec Box */}
              <div className="bg-soft-white border border-border-color rounded-2xl md:rounded-3xl p-6 sm:p-8">
                <h3 className="text-lg font-bold text-text-main mb-6 pb-3 border-b border-border-color">
                  Platform Blueprint
                </h3>

                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block mb-1">Industry</span>
                    <span className="font-bold text-text-main text-sm">{demo.industry || demo.category}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Website Type</span>
                    <span className="font-bold text-text-main text-sm">{demo.type || 'Custom Studio Platform'}</span>
                  </div>

                  {demo.languages && demo.languages.length > 0 && (
                    <div>
                      <span className="text-slate-400 block mb-1">Supported Languages</span>
                      <span className="font-bold text-text-main text-sm">{demo.languages.join(', ')}</span>
                    </div>
                  )}

                  {demo.technologies && demo.technologies.length > 0 && (
                    <div>
                      <span className="text-slate-400 block mb-1">Core Technology Stack</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {demo.technologies.map((t, i) => (
                          <span key={i} className="px-2.5 py-1 rounded bg-white border border-border-color text-text-main font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Demo Launch in Card */}
                {demo.liveUrl && (
                  <div className="mt-8 pt-6 border-t border-border-color">
                    <a
                      href={demo.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleOpenLiveDemo}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-fresh-green text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-600 transition-colors shadow-xs"
                    >
                      <span>Open Live Website</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                )}
              </div>

              {/* Core Feature Matrix */}
              {demo.features && demo.features.length > 0 && (
                <div className="bg-white border border-border-color rounded-2xl md:rounded-3xl p-6 sm:p-8">
                  <h3 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider font-mono text-slate-400">
                    Included Features
                  </h3>
                  <div className="space-y-2.5">
                    {demo.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-text-main">
                        <Check size={14} className="text-fresh-green shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Commissioning Box */}
              <div className="bg-text-main text-white rounded-2xl md:rounded-3xl p-6 sm:p-8">
                <span className="text-[11px] font-mono font-bold text-fresh-green uppercase tracking-widest block mb-2">
                  Launch Your Platform
                </span>
                <h4 className="text-xl font-bold mb-3">
                  Want a website like {demo.name}?
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed mb-6">
                  We customize this architecture with your branding, custom copy, payment gateway, and integrations.
                </p>
                <Link
                  to="/start-project"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-fresh-green text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-500 transition-colors shadow-sm"
                >
                  <span>Commission Project</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
