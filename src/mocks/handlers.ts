// mock handlers for saved items
export const mockSavedItems: any[] = [];

export const getSavedItems = () => {
  return mockSavedItems;
};

export const toggleSavedItem = (item: any) => {
  const index = mockSavedItems.findIndex(i => i.id === item.id);
  if (index > -1) {
    mockSavedItems.splice(index, 1);
  } else {
    mockSavedItems.push(item);
  }
  return mockSavedItems;
};
