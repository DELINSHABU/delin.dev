import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';

interface EditorShellProps {
  title: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

const EditorShell: React.FC<EditorShellProps> = ({
  title,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  children,
}) => (
  <div className="editor-section">
    <motion.div
      className="editor-header"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <h2>{title}</h2>
      {!isEditing ? (
        <motion.button
          className="edit-btn"
          onClick={onEdit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-edit"></i> Edit
        </motion.button>
      ) : (
        <div className="action-buttons">
          <motion.button
            className="save-btn"
            onClick={onSave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-save"></i> Save
          </motion.button>
          <motion.button
            className="cancel-btn"
            onClick={onCancel}
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
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ delay: 0.1 }}
    >
      {children}
    </motion.div>
  </div>
);

export default EditorShell;
