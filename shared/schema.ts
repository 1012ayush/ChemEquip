import { z } from "zod";

// === TYPES FOR FRONTEND ===
export interface Dataset {
  id: number;
  filename: string;
  uploadTimestamp: string;
  totalEquipment: number;
  avgFlowrate: string;
  avgPressure: string;
  avgTemperature: string;
  typeDistribution: Record<string, number>;
}

export interface Equipment {
  id: number;
  datasetId: number;
  name: string;
  type: string;
  flowrate: string;
  pressure: string;
  temperature: string;
}

// === ZOD SCHEMAS (For Validation) ===
export const insertDatasetSchema = z.object({
  filename: z.string().min(1),
  totalEquipment: z.number(),
  avgFlowrate: z.string(),
  avgPressure: z.string(),
  avgTemperature: z.string(),
  typeDistribution: z.record(z.string(), z.number()),
});

export const insertEquipmentSchema = z.object({
  datasetId: z.number(),
  name: z.string().min(1),
  type: z.string().min(1),
  flowrate: z.string(),
  pressure: z.string(),
  temperature: z.string(),
});

// === ANALYTICS TYPES ===
export interface AnalyticsSummary {
  totalEquipment: number;
  avgFlowrate: number;
  avgPressure: number;
  avgTemperature: number;
  typeDistribution: Record<string, number>;
}

export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;