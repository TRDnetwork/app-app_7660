import React, { memo } from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = memo(({ title, description, image, link, index }) => {
  return (
    <article
      className="bg-surface p-6 rounded-lg shadow-md hover-lift animate-slide-up focus-glow flex flex-col"
      style={{ animationDelay: `${index * 150}ms` }}
      tabIndex={0}
      aria-labelledby={`project-title-${index}`}
      role="article" /* a11y fix: explicit role for semantic clarity */
    >
      <img
        src={image}
        alt={description} /* a11y fix: descriptive alt text based on content */
        width="400"
        height="225"
        loading="lazy"
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 id={`project-title-${index}`} className="text-xl font-bold mb-2 text-text">
        {title}
      </h3>
      <p className="text-text-dim flex-grow">{description}</p>
      <a
        href={link}
        className="mt-4 text-accent hover:underline focus:outline-none focus:underline"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View project: ${title}`} /* a11y fix: more descriptive link purpose */
      >
        View Project
      </a>
    </article>
  );
});

export default ProjectCard;
// PERF: Added memo, explicit width/height, loading="lazy", and key-based animation delay