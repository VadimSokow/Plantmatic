export interface PlantTemplate {
  id: string;
  latname: string;
  comname: string;
  config: {
    soil_moisture: number;
  };
  category: string;
}
