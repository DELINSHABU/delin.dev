import { useState, useEffect } from 'react';

export function useEditorState<T>(storageKey: string, initialData: T, successMessage: string) {
  const [data, setData] = useState<T>(initialData);
  const [tempData, setTempData] = useState<T>(initialData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved) as T;
      setData(parsed);
      setTempData(parsed);
    }
  }, [storageKey]);

  const startEdit = () => setIsEditing(true);

  const handleSave = () => {
    setData(tempData);
    localStorage.setItem(storageKey, JSON.stringify(tempData));
    setIsEditing(false);
    alert(successMessage);
  };

  const handleCancel = () => {
    setTempData(data);
    setIsEditing(false);
  };

  return { data, tempData, setTempData, isEditing, startEdit, handleSave, handleCancel };
}
