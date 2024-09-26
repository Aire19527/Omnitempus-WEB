export interface AddRisk {
  name: string;
  percentage: number;
  description: string;
}
export interface Risk extends AddRisk {
  id: number;
}
