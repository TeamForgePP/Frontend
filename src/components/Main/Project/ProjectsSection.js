import React from 'react';
import ProjectHeader from './ProjectHeader';
import ProjectCard from './ProjectCard';
import EmptyProject from './EmptyProject';
import './ProjectsSection.css';


function ProjectsSection() {
  return (
    <section className="uniSection">
      <ProjectHeader />
      <ProjectCard/>
    </section>
  );
}

export default ProjectsSection;