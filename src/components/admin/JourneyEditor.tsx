import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface JourneyItem {
  year: string;
  title: string;
  description: string;
}

const JourneyEditor: React.FC = () => {
  const [journeyItems, setJourneyItems] = useState<JourneyItem[]>([
    {
      year: "2023",
      title: "Started Learning React",
      description: "Began my journey into web development with React and TypeScript."
    },
    {
      year: "2024",
      title: "First Projects",
      description: "Created several personal projects to strengthen my development skills."
    },
    {
      year: "2025",
      title: "Portfolio Development",
      description: "Building my personal portfolio website to showcase my work and skills."
    }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempItems, setTempItems] = useState<JourneyItem[]>(journeyItems);

  useEffect(() => {
    const savedData = localStorage.getItem('journeyData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setJourneyItems(parsed);
      setTempItems(parsed);
    }
  }, []);

  const handleSave = () => {
    setJourneyItems(tempItems);
    localStorage.setItem('journeyData', JSON.stringify(tempItems));
    setIsEditing(false);
    alert('Journey updated successfully!');
  };

  const handleCancel = () => {
    setTempItems(journeyItems);
    setIsEditing(false);
  };

  const addItem = () => {
    setTempItems([...tempItems, { year: "2025", title: "New Milestone", description: "Description of the milestone" }]);
  };

  const removeItem = (index: number) => {
    setTempItems(tempItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof JourneyItem, value: string) => {
    const updated = [...tempItems];
    updated[index] = { ...updated[index], [field]: value };
    setTempItems(updated);
  };

  return (
    <div className="editor-section">
      <motion.div 
        className="editor-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>My Journey Editor</h2>
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
          <div className="journey-editor">
            {tempItems.map((item, index) => (
              <div key={index} className="journey-item-editor">
                <div className="item-header">
                  <input
                    type="text"
                    value={item.year}
                    onChange={(e) => updateItem(index, 'year', e.target.value)}
                    placeholder="Year"
                    className="year-input"
                  />
                  <button 
                    className="remove-item-btn"
                    onClick={() => removeItem(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(index, 'title', e.target.value)}
                    placeholder="Milestone title"
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Milestone description"
                    rows={3}
                  />
                </div>
              </div>
            ))}
            <button className="add-item-btn" onClick={addItem}>
              <i className="fas fa-plus"></i> Add Journey Item
            </button>
          </div>
        ) : (
          <div className="journey-preview">
            {journeyItems.map((item, index) => (
              <div key={index} className="journey-item-preview">
                <div className="year-badge">{item.year}</div>
                <div className="journey-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default JourneyEditor;