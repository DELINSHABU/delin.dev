import React from 'react';
import { useEditorState } from '../../hooks/useEditorState';
import EditorShell from './EditorShell';

interface AboutData {
  title: string;
  description: string;
}

const INITIAL: AboutData = {
  title: 'About Me',
  description:
    "I'm a passionate developer who loves creating beautiful and functional web applications. My journey in web development started with a curiosity about how things work on the internet, and that curiosity has grown into a full-fledged passion for creating digital experiences.",
};

const AboutEditor: React.FC = () => {
  const {
    data: aboutData,
    tempData,
    setTempData,
    isEditing,
    startEdit,
    handleSave,
    handleCancel,
  } = useEditorState<AboutData>('aboutData', INITIAL, 'About section updated successfully!');

  return (
    <EditorShell
      title="About Me Editor"
      isEditing={isEditing}
      onEdit={startEdit}
      onSave={handleSave}
      onCancel={handleCancel}
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
    </EditorShell>
  );
};

export default AboutEditor;
