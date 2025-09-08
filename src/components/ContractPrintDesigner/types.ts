export interface Field {
  id: string;
  label: string;
}

export interface InputItem {
  fieldId: string;
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export const ItemTypes = {
  INPUT: "input",
};
