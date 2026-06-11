import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SkillCategory {
  title: string;
  skills: string[];
}

const SkillsEditor: React.FC = () => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([
    {
      title: "Frontend",
      skills: ["React", "TypeScript", "Next.js", "HTML5/CSS3", "Modern UI/UX"]
    },
    {
      title: "Backend", 
      skills: ["Node.js", "Express", "MongoDB", "REST APIs", "Python"]
    },
    {
      title: "AI & Tools",
      skills: ["Prompt Engineering", "AI Integration", "Git & Version Control", "VS Code", "Docker", "Automation Tools"]
    },
    {
      title: "Languages I Actually Use",
      skills: ["JavaScript/TypeScript", "Python", "C++", "Java", "Lua", "Brainfuck (for the culture)"]
    },
    {
      title: "Soft Skills",
      skills: ["Problem Solving", "Team Collaboration", "Communication", "Adaptability", "AI Whispering"]
    }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempCategories, setTempCategories] = useState<SkillCategory[]>(skillCategories);

  useEffect(() => {
    const savedData = localStorage.getItem('skillsData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setSkillCategories(parsed);
      setTempCategories(parsed);
    }
  }, []);

  const handleSave = () => {
    setSkillCategories(tempCategories);
    localStorage.setItem('skillsData', JSON.stringify(tempCategories));
    setIsEditing(false);
    alert('Skills updated successfully!');
  };

  const handleCancel = () => {
    setTempCategories(skillCategories);
    setIsEditing(false);
  };

  const addCategory = () => {
    setTempCategories([...tempCategories, { title: "New Category", skills: ["New Skill"] }]);
  };

  const removeCategory = (index: number) => {
    setTempCategories(tempCategories.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, field: keyof SkillCategory, value: any) => {
    const updated = [...tempCategories];
    updated[index] = { ...updated[index], [field]: value };
    setTempCategories(updated);
  };

  const addSkill = (categoryIndex: number) => {
    const updated = [...tempCategories];
    updated[categoryIndex].skills.push("New Skill");
    setTempCategories(updated);
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const updated = [...tempCategories];
    updated[categoryIndex].skills = updated[categoryIndex].skills.filter((_, i) => i !== skillIndex);
    setTempCategories(updated);
  };

  const updateSkill = (categoryIndex: number, skillIndex: number, value: string) => {
    const updated = [...tempCategories];
    updated[categoryIndex].skills[skillIndex] = value;
    setTempCategories(updated);
  };

  return (
    <div className="editor-section">
      <motion.div 
        className="editor-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Skills & Expertise Editor</h2>
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
          <div className="skills-editor">
            {tempCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="category-editor">
                <div className="category-header">
                  <input
                    type="text"
                    value={category.title}
                    onChange={(e) => updateCategory(categoryIndex, 'title', e.target.value)}
                    className="category-title-input"
                  />
                  <button 
                    className="remove-category-btn"
                    onClick={() => removeCategory(categoryIndex)}
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
                  <button 
                    className="add-skill-btn"
                    onClick={() => addSkill(categoryIndex)}
                  >
                    <i className="fas fa-plus"></i> Add Skill
                  </button>
                </div>
              </div>
            ))}
            <button className="add-category-btn" onClick={addCategory}>
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
      </motion.div>
    </div>
  );
};

export default SkillsEditor;