import React from 'react';
import { useEditorState } from '../../hooks/useEditorState';
import { useListEditor } from '../../hooks/useListEditor';
import EditorShell from './EditorShell';

interface SkillCategory {
  title: string;
  skills: string[];
}

const INITIAL: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: ['React', 'TypeScript', 'Next.js', 'HTML5/CSS3', 'Modern UI/UX'],
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Python'],
  },
  {
    title: 'AI & Tools',
    skills: [
      'Prompt Engineering',
      'AI Integration',
      'Git & Version Control',
      'VS Code',
      'Docker',
      'Automation Tools',
    ],
  },
  {
    title: 'Languages I Actually Use',
    skills: [
      'JavaScript/TypeScript',
      'Python',
      'C++',
      'Java',
      'Lua',
      'Brainfuck (for the culture)',
    ],
  },
  {
    title: 'Soft Skills',
    skills: ['Problem Solving', 'Team Collaboration', 'Communication', 'Adaptability', 'AI Whispering'],
  },
];

const SkillsEditor: React.FC = () => {
  const {
    data: skillCategories,
    tempData: tempCategories,
    setTempData,
    isEditing,
    startEdit,
    handleSave,
    handleCancel,
  } = useEditorState<SkillCategory[]>('skillsData', INITIAL, 'Skills updated successfully!');
  const { addItem, removeItem, updateItem } = useListEditor(tempCategories, setTempData);

  const addSkill = (categoryIndex: number) =>
    updateItem(categoryIndex, {
      skills: [...tempCategories[categoryIndex].skills, 'New Skill'],
    });

  const removeSkill = (categoryIndex: number, skillIndex: number) =>
    updateItem(categoryIndex, {
      skills: tempCategories[categoryIndex].skills.filter((_, i) => i !== skillIndex),
    });

  const updateSkill = (categoryIndex: number, skillIndex: number, value: string) =>
    updateItem(categoryIndex, {
      skills: tempCategories[categoryIndex].skills.map((s, i) =>
        i === skillIndex ? value : s
      ),
    });

  return (
    <EditorShell
      title="Skills & Expertise Editor"
      isEditing={isEditing}
      onEdit={startEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      {isEditing ? (
        <div className="skills-editor">
          {tempCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="category-editor">
              <div className="category-header">
                <input
                  type="text"
                  value={category.title}
                  onChange={(e) => updateItem(categoryIndex, { title: e.target.value })}
                  className="category-title-input"
                />
                <button
                  className="remove-category-btn"
                  onClick={() => removeItem(categoryIndex)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              <div className="skills-list">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-item-editor">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateSkill(categoryIndex, skillIndex, e.target.value)}
                    />
                    <button
                      className="remove-skill-btn"
                      onClick={() => removeSkill(categoryIndex, skillIndex)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
                <button className="add-skill-btn" onClick={() => addSkill(categoryIndex)}>
                  <i className="fas fa-plus"></i> Add Skill
                </button>
              </div>
            </div>
          ))}
          <button
            className="add-category-btn"
            onClick={() => addItem({ title: 'New Category', skills: ['New Skill'] })}
          >
            <i className="fas fa-plus"></i> Add Category
          </button>
        </div>
      ) : (
        <div className="skills-preview">
          {skillCategories.map((category, index) => (
            <div key={index} className="category-preview">
              <h3>{category.title}</h3>
              <div className="skills-grid-preview">
                {category.skills.map((skill, skillIndex) => (
                  <span key={skillIndex} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </EditorShell>
  );
};

export default SkillsEditor;
