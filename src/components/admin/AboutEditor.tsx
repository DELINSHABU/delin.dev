import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AboutData {
  title: string;
  description: string;
}

const AboutEditor: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData>({
    title: "About Me",
    description: "I'm a passionate developer who loves creating beautiful and functional web applications. My journey in web development started with a curiosity about how things work on the internet, and that curiosity has grown into a full-fledged passion for creating digital experiences."
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<AboutData>(aboutData);

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('aboutData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setAboutData(parsed);
      setTempData(parsed);
    }
  }, []);

  const handleSave = () => {
    setAboutData(tempData);
    localStorage.setItem('aboutData', JSON.stringify(tempData));
    setIsEditing(false);
    alert('About section updated successfully!');
  };

  const handleCancel = () => {
    setTempData(aboutData);
    setIsEditing(false);
  };

  return (
    <div className="editor-section">
      <motion.div 
        className="editor-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>About Me Editor</h2>
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
          <div className="form-container">
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={tempData.title}
                onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                placeholder="Section title"
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={tempData.description}
                onChange={(e) => setTempData({ ...tempData, description: e.target.value })}
                placeholder="About me description"
                rows={6}
              />
            </div>
          </div>
        ) : (
          <div className="preview-container">
            <h3>{aboutData.title}</h3>
            <p>{aboutData.description}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AboutEditor;