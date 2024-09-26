export interface AddAreas {
  name: string;
  groupId: string;
  description: string;
}

export interface Areas extends AddAreas {
  id: number;
}
