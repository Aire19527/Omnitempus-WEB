export interface ParameterGen {
  parameter: string;
  value: string;
  isRange: boolean;
  maximumAllowedValue: number;
  minimumAllowedValue: number;
  valueType: string;
  parameterType: string;
  minimumValue: string;
  maximumValue: string;
  isEditable: boolean;
  description: string;
  id: number;
}
