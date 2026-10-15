import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Sparkles } from 'lucide-react';
import { WorkProject } from './types';
import { ProjectMedia } from './ProjectMedia';

interface FeaturedProjectProps {
  key?: React.Key;
  project: WorkProject;
  index?: number;
}

export function FeaturedProject({ project, index = 1 }: FeaturedProjectProps) {
  const shouldReduceMotion = useReducedMotion();
  const formattedIndex = index.toString().padStart(2, '0');
  const projectLink = `/demos/${project.slug || project.id}`;
  const displayServices = project.services || ['Brand Experience', 'UI/UX Design', 'Full-Stack Web App'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const clipPathVariants = {
    hidden: {
      clipPath: 'inset(10% 0% 0% 0% round 2rem)',
      opacity: 0.5,
      scale: 1.03,
    },
    visible: {
      clipPath: 'inset(0% 0% 0% 0% round 2rem)',
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.article
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? false : "visible"}
      viewport={{ once: true, margin: '-60px' }}
      variants={containerVariants}
      className="group relative bg-white border border-border-color rounded-2xl md:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-700"
    >
      {/* Top micro metadata strip */}
      <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-border-color/60">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fresh-green/10 text-elegant-green text-xs font-mono font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-fresh-green animate-ping" />
            <span>Featured Case Study</span>
          </div>
          <span className="text-border-color">/</span>
          <span className="font-mono text-xs font-bold text-text-muted tracking-widest uppercase">
            Project {formattedIndex}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <span className="font-semibold text-text-main">{project.industry || project.category}</span>
          <span>·</span>
          <span>{project.year || '2026'}</span>
        </div>
      </motion.div>

      {/* Main Grid: Responsive 12-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Large Media Preview with Cinematic Clip-Path Reveal */}
        <motion.div variants={clipPathVariants} className="lg:col-span-8 order-1 overflow-hidden rounded-2xl md:rounded-[2rem]">
          <a
            href={projectLink}
            className="block group/media cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-green rounded-2xl md:rounded-[2rem]"
            aria-label={`View project details for ${project.title}`}
          >
            <ProjectMedia
              src={project.desktopPreview || project.thumbnail}
              alt={project.title}
              aspectRatio="aspect-[16/10] sm:aspect-[16/9]"
              projectTitle={project.title}
              projectCategory={project.category}
              priority={true}
            />
          </a>
        </motion.div>

        {/* Project Information & Editorial Copy (4 cols on desktop) */}
        <div className="lg:col-span-4 order-2 flex flex-col justify-between h-full">
          <div>
            <motion.div variants={fadeUpVariants} className="text-xs font-mono text-elegant-green font-bold tracking-widest uppercase mb-2 flex items-center gap-1.5">
              <Sparkles size={12} className="text-fresh-green" />
              <span>{project.category}</span>
            </motion.div>

            <motion.h2 variants={fadeUpVariants} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-main tracking-tight leading-tight mb-4 group-hover:text-text-main transition-colors">
              <a href={projectLink} className="hover:text-fresh-green transition-colors">
                {project.title}
              </a>
            </motion.h2>

            <motion.p variants={fadeUpVariants} className="text-sm sm:text-base text-text-muted font-medium leading-relaxed mb-6">
              {project.description}
            </motion.p>

            {/* Scope / Services Pills */}
            <motion.div variants={fadeUpVariants} className="mb-8">
              <span className="block text-[11px] font-mono tracking-wider text-text-muted uppercase font-semibold mb-2.5">
                Delivered Scope
              </span>
              <div className="flex flex-wrap gap-1.5">
                {displayServices.map((service, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-soft-white border border-border-color text-text-main font-medium"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Interactive Editorial CTA Bar */}
          <motion.div variants={fadeUpVariants} className="pt-6 border-t border-border-color/60 flex flex-wrap items-center gap-3">
            <a
              href={projectLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-fresh-green text-white hover:bg-elegant-green font-bold text-sm shadow-md shadow-fresh-green/15 transition-all duration-300 group/cta"
            >
              <span>Explore Case Study</span>
              <ArrowUpRight
                size={16}
                className="transform group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1 transition-transform duration-300"
              />
            </a>

            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-soft-white hover:bg-slate-100 text-text-main font-semibold text-sm border border-border-color transition-colors"
              >
                <span>Live Demo</span>
                <ExternalLink size={14} className="text-text-muted" />
              </a>
            ) : (
              <a
                href={projectLink}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-soft-white hover:bg-slate-100 text-text-main font-semibold text-sm border border-border-color transition-colors"
              >
                <span>Preview Interactive</span>
                <ArrowUpRight size={14} className="text-text-muted" />
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}
