import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  technologies: string[];
}

const ProjectsEditor: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'project-one',
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with React.js and Node.js",
      imageUrl: "/project1.jpg",
      link: "#",
      technologies: ["React", "Node.js", "MongoDB", "Express"]
    },
    {
      id: 'project-two',
      title: "Task Management App",
      description: "Real-time task management with full-stack capabilities",
      imageUrl: "/project2.jpg",
      link: "#",
      technologies: ["React", "TypeScript", "Firebase", "Material-UI"]
    },
    {
      id: 'project-three',
      title: "Portfolio Website",
      description: "Modern UI/UX Design with React and TypeScript",
      imageUrl: "/project3.jpg",
      link: "#",
      technologies: ["React", "TypeScript", "Framer Motion", "CSS3"]
    }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProjects, setTempProjects] = useState<Project[]>(projects);

  useEffect(() => {
    const savedData = localStorage.getItem('projectsData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setProjects(parsed);
      setTempProjects(parsed);
    }
  }, []);

  const handleSave = () => {
    setProjects(tempProjects);
    localStorage.setItem('projectsData', JSON.stringify(tempProjects));
    setIsEditing(false);
    alert('Projects updated successfully!');
  };

  const handleCancel = () => {
    setTempProjects(projects);
    setIsEditing(false);
  };

  const addProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: "New Project",
      description: "Project description",
      imageUrl: "/placeholder.jpg",
      link: "#",
      technologies: ["React"]
    };
    setTempProjects([...tempProjects, newProject]);
  };

  const removeProject = (index: number) => {
    setTempProjects(tempProjects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const updated = [...tempProjects];
    updated[index] = { ...updated[index], [field]: value };
    setTempProjects(updated);
  };

  const addTechnology = (projectIndex: number) => {
    const updated = [...tempProjects];
    updated[projectIndex].technologies.push("New Tech");
    setTempProjects(updated);
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const updated = [...tempProjects];
    updated[projectIndex].technologies = updated[projectIndex].technologies.filter((_, i) => i !== techIndex);
    setTempProjects(updated);
  };

  const updateTechnology = (projectIndex: number, techIndex: number, value: string) => {
    const updated = [...tempProjects];
    updated[projectIndex].technologies[techIndex] = value;
    setTempProjects(updated);
  };

  return (
    <div className="editor-section">
      <motion.div 
        className="editor-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Projects Editor</h2>
        {!isEditing ? (
          <motion.button 
            className="edit-btn"
            onClick={() => setIsEditing(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-edit"></i> Edit
          </motion.button>
        ) : (
          <div className="action-buttons">
            <motion.button 
              className="save-btn"
              onClick={handleSave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-save"></i> Save
            </motion.button>
            <motion.button 
              className="cancel-btn"
              onClick={handleCancel}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-times"></i> Cancel
            </motion.button>
          </div>
        )}
      </motion.div>

      <motion.div 
        className="editor-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {isEditing ? (
          <div className="projects-editor">
            {tempProjects.map((project, projectIndex) => (
              <div key={project.id} className="project-editor">
                <div className="project-header">
                  <h3>Project {projectIndex + 1}</h3>
                  <button 
                    className="remove-project-btn"
                    onClick={() => removeProject(projectIndex)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => updateProject(projectIndex, 'title', e.target.value)}
                    placeholder="Project title"
                  />
                </div>
                
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(projectIndex, 'description', e.target.value)}
                    placeholder="Project description"
                    rows={3}
                  />
                </div>
                
                <div className="form-group">
                  <label>Image URL:</label>
                  <input
                    type="text"
                    value={project.imageUrl}
                    onChange={(e) => updateProject(projectIndex, 'imageUrl', e.target.value)}
                    placeholder="Image URL"
                  />
                </div>
                
                <div className="form-group">
                  <label>Link:</label>
                  <input
                    type="text"
                    value={project.link}
                    onChange={(e) => updateProject(projectIndex, 'link', e.target.value)}
                    placeholder="Project link"
                  />
                </div>
                
                <div className="form-group">
                  <label>Technologies:</label>
                  <div className="technologies-editor">
                    {project.technologies.map((tech, techIndex) => (
                      <div key={techIndex} className="tech-item-editor">
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) => updateTechnology(projectIndex, techIndex, e.target.value)}
                        />
                        <button 
                          className="remove-tech-btn"
                          onClick={() => removeTechnology(projectIndex, techIndex)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                    <button 
                      className="add-tech-btn"
                      onClick={() => addTechnology(projectIndex)}
                    >
                      <i className="fas fa-plus"></i> Add Tech
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button className="add-project-btn" onClick={addProject}>
              <i className="fas fa-plus"></i> Add Project
            </button>
          </div>
        ) : (
          <div className="projects-preview">
            {projects.map((project, index) => (
              <div key={project.id} className="project-preview">
                <img src={project.imageUrl} alt={project.title} />
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="technologies">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    View Project
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectsEditor;