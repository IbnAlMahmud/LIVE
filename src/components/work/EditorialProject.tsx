import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, ExternalLink } from 'lucide-react';
import { WorkProject } from './types';
import { ProjectMedia } from './ProjectMedia';
import { cn } from '@/lib/utils';

interface EditorialProjectProps {
  key?: React.Key;
  project: WorkProject;
  index: number;
}

export function EditorialProject({ project, index }: EditorialProjectProps) {
  const shouldReduceMotion = useReducedMotion();
  const formattedIndex = (index + 1).toString().padStart(2, '0');
  const projectLink = `/demos/${project.slug || project.id}`;

  const isWide = index > 0 && index % 4 === 3;
  const isImageRight = !isWide && index % 2 === 1;

  const defaultServices = [
    'UX Architecture',
    'Custom Components',
    'Mobile Responsive',
  ];
  const services = project.services || defaultServices;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const clipPathVariants = {
    hidden: {
      clipPath: 'inset(10% 0% 0% 0% round 2rem)',
      opacity: 0.45,
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

  if (isWide) {
    return (
      <motion.article
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? false : "visible"}
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        className="group relative bg-white border border-border-color rounded-2xl md:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-700"
      >
        {/* Top Header */}
        <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-border-color/60">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-slate-400 group-hover:text-fresh-green transition-colors">
              {formattedIndex}
            </span>
            <span className="text-border-color">/</span>
            <span className="font-mono text-xs font-bold text-text-muted tracking-widest uppercase">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
            <span className="font-semibold text-text-main">{project.industry || 'Digital Studio'}</span>
            <span>·</span>
            <span>{project.year || '2026'}</span>
          </div>
        </motion.div>

        {/* Wide Visual Banner with Cinematic Clip-Path Reveal */}
        <motion.div variants={clipPathVariants} className="mb-8 overflow-hidden rounded-2xl md:rounded-[2rem]">
          <a
            href={projectLink}
            className="block group/media cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-green rounded-2xl md:rounded-[2rem]"
            aria-label={`View project details for ${project.title}`}
          >
            <ProjectMedia
              src={project.desktopPreview || project.thumbnail}
              alt={project.title}
              aspectRatio="aspect-[16/9] sm:aspect-[21/9]"
              projectTitle={project.title}
              projectCategory={project.category}
            />
          </a>
        </motion.div>

        {/* Editorial Information Strip Below */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-8">
            <motion.h3 variants={fadeUpVariants} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-main tracking-tight leading-tight mb-3">
              <a href={projectLink} className="hover:text-fresh-green transition-colors">
                {project.title}
              </a>
            </motion.h3>
            <motion.p variants={fadeUpVariants} className="text-sm sm:text-base text-text-muted font-medium max-w-2xl leading-relaxed mb-4">
              {project.description}
            </motion.p>
            <motion.div variants={fadeUpVariants} className="flex flex-wrap gap-2">
              {services.map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-md bg-soft-white border border-border-color text-text-main font-medium"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div variants={fadeUpVariants} className="md:col-span-4 flex md:justify-end items-center gap-3">
            <a
              href={projectLink}
              className="inline-flex items-center gap-2 font-bold text-text-main hover:text-fresh-green group/link text-sm sm:text-base py-2 transition-colors border-b-2 border-transparent hover:border-fresh-green"
            >
              <span>View Project</span>
              <ArrowUpRight
                size={18}
                className="transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300 text-fresh-green"
              />
            </a>
          </motion.div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? false : "visible"}
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      className="group relative bg-white border border-border-color rounded-2xl md:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-700"
    >
      {/* Top Header */}
      <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-border-color/60">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-slate-400 group-hover:text-fresh-green transition-colors">
            {formattedIndex}
          </span>
          <span className="text-border-color">/</span>
          <span className="font-mono text-xs font-bold text-text-muted tracking-widest uppercase">
            {project.category}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <span className="font-semibold text-text-main">{project.industry || project.category}</span>
          <span>·</span>
          <span>{project.year || '2026'}</span>
        </div>
      </motion.div>

      {/* Main 12-Col Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Media Preview Column with Clip-Path Reveal */}
        <motion.div
          variants={clipPathVariants}
          className={cn(
            "lg:col-span-7 overflow-hidden rounded-2xl md:rounded-[2rem]",
            isImageRight ? "lg:order-2" : "lg:order-1",
            "order-1"
          )}
        >
          <a
            href={projectLink}
            className="block group/media cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-green rounded-2xl md:rounded-[2rem]"
            aria-label={`View project details for ${project.title}`}
          >
            <ProjectMedia
              src={project.desktopPreview || project.thumbnail}
              alt={project.title}
              aspectRatio="aspect-[16/10]"
              projectTitle={project.title}
              projectCategory={project.category}
            />
          </a>
        </motion.div>

        {/* Information Column */}
        <div
          className={cn(
            "lg:col-span-5 flex flex-col justify-between h-full",
            isImageRight ? "lg:order-1" : "lg:order-2",
            "order-2"
          )}
        >
          <div>
            <motion.div variants={fadeUpVariants} className="font-mono text-xs text-elegant-green font-bold tracking-widest uppercase mb-2">
              {project.industry ? `${project.industry} · Case Study` : 'Custom Architecture'}
            </motion.div>

            <motion.h3 variants={fadeUpVariants} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-main tracking-tight leading-tight mb-4">
              <a href={projectLink} className="hover:text-fresh-green transition-colors">
                {project.title}
              </a>
            </motion.h3>

            <motion.p variants={fadeUpVariants} className="text-sm sm:text-base text-text-muted font-medium leading-relaxed mb-6">
              {project.description}
            </motion.p>

            {/* Scope / Services */}
            <motion.div variants={fadeUpVariants} className="mb-8">
              <span className="block text-[11px] font-mono tracking-wider text-text-muted uppercase font-semibold mb-2">
                Services & Capabilities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {services.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-soft-white border border-border-color text-text-main font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Interactive CTA Link */}
          <motion.div variants={fadeUpVariants} className="pt-6 border-t border-border-color/60 flex items-center justify-between">
            <a
              href={projectLink}
              className="inline-flex items-center gap-2 font-bold text-text-main hover:text-fresh-green group/link text-sm sm:text-base transition-colors"
            >
              <span className="border-b-2 border-text-main/20 group-hover/link:border-fresh-green pb-0.5 transition-colors">
                View Project
              </span>
              <ArrowUpRight
                size={18}
                className="transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300 text-fresh-green"
              />
            </a>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono font-semibold text-text-muted hover:text-text-main inline-flex items-center gap-1 transition-colors"
              >
                <span>Live Demo</span>
                <ExternalLink size={12} />
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}
