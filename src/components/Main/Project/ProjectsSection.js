import React from 'react';
import ProjectHeader from './ProjectHeader';
import ProjectCard from './ProjectCard';
import EmptyProject from './EmptyProject';
import './ProjectsSection.css';

function ProjectsSection({ projects, onProjectDeleted }) {
  
  return (
    <section className="uniSection">
      <ProjectHeader />
      {/* Рендерим ProjectCard для каждого проекта */}
      {projects.map(project => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          onProjectDeleted={onProjectDeleted}
        />
      ))}
    </section>
  );
}

export default ProjectsSection;