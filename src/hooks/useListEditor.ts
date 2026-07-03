export function useListEditor<T>(items: T[], setItems: (items: T[]) => void) {
  const addItem = (item: T) => setItems([...items, item]);

  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const updateItem = (index: number, patch: Partial<T>) =>
    setItems(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return { addItem, removeItem, updateItem };
}
