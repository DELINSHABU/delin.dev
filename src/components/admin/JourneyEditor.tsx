import React from 'react';
import { useEditorState } from '../../hooks/useEditorState';
import { useListEditor } from '../../hooks/useListEditor';
import EditorShell from './EditorShell';

interface JourneyItem {
  year: string;
  title: string;
  description: string;
}

const INITIAL: JourneyItem[] = [
  {
    year: '2023',
    title: 'Started Learning React',
    description: 'Began my journey into web development with React and TypeScript.',
  },
  {
    year: '2024',
    title: 'First Projects',
    description: 'Created several personal projects to strengthen my development skills.',
  },
  {
    year: '2025',
    title: 'Portfolio Development',
    description: 'Building my personal portfolio website to showcase my work and skills.',
  },
];

const JourneyEditor: React.FC = () => {
  const {
    data: journeyItems,
    tempData: tempItems,
    setTempData,
    isEditing,
    startEdit,
    handleSave,
    handleCancel,
  } = useEditorState<JourneyItem[]>('journeyData', INITIAL, 'Journey updated successfully!');
  const { addItem, removeItem, updateItem } = useListEditor(tempItems, setTempData);

  return (
    <EditorShell
      title="My Journey Editor"
      isEditing={isEditing}
      onEdit={startEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      {isEditing ? (
        <div className="journey-editor">
          {tempItems.map((item, index) => (
            <div key={index} className="journey-item-editor">
              <div className="item-header">
                <input
                  type="text"
                  value={item.year}
                  onChange={(e) => updateItem(index, { year: e.target.value })}
                  placeholder="Year"
                  className="year-input"
                />
                <button className="remove-item-btn" onClick={() => removeItem(index)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(index, { title: e.target.value })}
                  placeholder="Milestone title"
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={item.description}
                  onChange={(e) => updateItem(index, { description: e.target.value })}
                  placeholder="Milestone description"
                  rows={3}
                />
              </div>
            </div>
          ))}
          <button
            className="add-item-btn"
            onClick={() =>
              addItem({
                year: '2025',
                title: 'New Milestone',
                description: 'Description of the milestone',
              })
            }
          >
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
    </EditorShell>
  );
};

export default JourneyEditor;
