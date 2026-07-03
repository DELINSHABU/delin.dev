import React from 'react';
import { useEditorState } from '../../hooks/useEditorState';
import { useListEditor } from '../../hooks/useListEditor';
import EditorShell from './EditorShell';

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  technologies: string[];
}

const INITIAL: Project[] = [
  {
    id: 'project-one',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with React.js and Node.js',
    imageUrl: '/project1.jpg',
    link: '#',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
  },
  {
    id: 'project-two',
    title: 'Task Management App',
    description: 'Real-time task management with full-stack capabilities',
    imageUrl: '/project2.jpg',
    link: '#',
    technologies: ['React', 'TypeScript', 'Firebase', 'Material-UI'],
  },
  {
    id: 'project-three',
    title: 'Portfolio Website',
    description: 'Modern UI/UX Design with React and TypeScript',
    imageUrl: '/project3.jpg',
    link: '#',
    technologies: ['React', 'TypeScript', 'Framer Motion', 'CSS3'],
  },
];

const ProjectsEditor: React.FC = () => {
  const {
    data: projects,
    tempData: tempProjects,
    setTempData,
    isEditing,
    startEdit,
    handleSave,
    handleCancel,
  } = useEditorState<Project[]>('projectsData', INITIAL, 'Projects updated successfully!');
  const { addItem, removeItem, updateItem } = useListEditor(tempProjects, setTempData);

  const addTechnology = (projectIndex: number) =>
    updateItem(projectIndex, {
      technologies: [...tempProjects[projectIndex].technologies, 'New Tech'],
    });

  const removeTechnology = (projectIndex: number, techIndex: number) =>
    updateItem(projectIndex, {
      technologies: tempProjects[projectIndex].technologies.filter((_, i) => i !== techIndex),
    });

  const updateTechnology = (projectIndex: number, techIndex: number, value: string) =>
    updateItem(projectIndex, {
      technologies: tempProjects[projectIndex].technologies.map((t, i) =>
        i === techIndex ? value : t
      ),
    });

  return (
    <EditorShell
      title="Projects Editor"
      isEditing={isEditing}
      onEdit={startEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      {isEditing ? (
        <div className="projects-editor">
          {tempProjects.map((project, projectIndex) => (
            <div key={project.id} className="project-editor">
              <div className="project-header">
                <h3>Project {projectIndex + 1}</h3>
                <button
                  className="remove-project-btn"
                  onClick={() => removeItem(projectIndex)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>

              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => updateItem(projectIndex, { title: e.target.value })}
                  placeholder="Project title"
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateItem(projectIndex, { description: e.target.value })}
                  placeholder="Project description"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Image URL:</label>
                <input
                  type="text"
                  value={project.imageUrl}
                  onChange={(e) => updateItem(projectIndex, { imageUrl: e.target.value })}
                  placeholder="Image URL"
                />
              </div>

              <div className="form-group">
                <label>Link:</label>
                <input
                  type="text"
                  value={project.link}
                  onChange={(e) => updateItem(projectIndex, { link: e.target.value })}
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
                        onChange={(e) =>
                          updateTechnology(projectIndex, techIndex, e.target.value)
                        }
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
          <button
            className="add-project-btn"
            onClick={() =>
              addItem({
                id: `project-${Date.now()}`,
                title: 'New Project',
                description: 'Project description',
                imageUrl: '/placeholder.jpg',
                link: '#',
                technologies: ['React'],
              })
            }
          >
            <i className="fas fa-plus"></i> Add Project
          </button>
        </div>
      ) : (
        <div className="projects-preview">
          {projects.map((project) => (
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
    </EditorShell>
  );
};

export default ProjectsEditor;
