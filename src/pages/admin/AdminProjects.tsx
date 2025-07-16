import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AdminLayout from '../../components/admin/AdminLayout';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  githubUrl: string;
  liveUrl?: string;
}

const AdminProjects: React.FC = () => {
  const { theme } = useTheme();
  const [newProject, setNewProject] = useState<Project>({
    title: '',
    description: '',
    technologies: [],
    imageUrl: '',
    githubUrl: '',
    liveUrl: ''
  });
  const [techInput, setTechInput] = useState('');

  const handleAddTechnology = () => {
    if (techInput.trim()) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (index: number) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we'll add the API call to save the project
    console.log('Saving project:', newProject);
  };

  return (
    <AdminLayout>
      <div className={`admin-page ${theme}`}>
        <h1>Manage Projects</h1>
        
        <div className="admin-form-section">
          <h2>Add New Project</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="title">Project Title</label>
              <input
                type="text"
                id="title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                placeholder="Enter project title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Describe your project"
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="technologies">Technologies</label>
              <div className="tech-input-container">
                <input
                  type="text"
                  id="technologies"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Add technology"
                />
                <button
                  type="button"
                  onClick={handleAddTechnology}
                  className="admin-button-secondary"
                >
                  Add
                </button>
              </div>
              <div className="tech-tags">
                {newProject.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(index)}
                      className="remove-tech"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                value={newProject.imageUrl}
                onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                placeholder="Enter image URL"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="githubUrl">GitHub URL</label>
              <input
                type="url"
                id="githubUrl"
                value={newProject.githubUrl}
                onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                placeholder="Enter GitHub repository URL"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="liveUrl">Live URL (Optional)</label>
              <input
                type="url"
                id="liveUrl"
                value={newProject.liveUrl}
                onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                placeholder="Enter live project URL"
              />
            </div>

            <button type="submit" className="admin-button">Add Project</button>
          </form>
        </div>

        <div className="admin-list-section">
          <h2>Existing Projects</h2>
          {/* We'll add the list of existing projects here */}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
