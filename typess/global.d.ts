// types/global.d.ts
export interface ThaiIDData {
  TitleNameTh: string;
  FirstNameTh: string;
  LastNameTh: string;
  BirthDate: string;
  CitizenNo: string;
  Gender: string;
  HomeNo?: string;
  VillageNo?: string;
  Road?: string;
  Tumbol?: string;
  Amphur?: string;
  Province?: string;
}

interface Window {
  callback?: (data: ThaiIDData) => void;
}
