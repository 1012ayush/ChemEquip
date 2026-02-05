import { z } from 'zod';
import { type Dataset, type Equipment, type AnalyticsSummary } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  datasets: {
    upload: {
      method: 'POST' as const,
      path: '/api/upload',
      responses: {
        201: z.custom<Dataset>(), // Changed from $inferSelect
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/history',
      responses: {
        200: z.array(z.custom<Dataset>()), // Changed from $inferSelect
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/datasets/:id',
      responses: {
        200: z.object({
          dataset: z.custom<Dataset>(), // Changed from $inferSelect
          equipment: z.array(z.custom<Equipment>()) // Changed from $inferSelect
        }),
        404: errorSchemas.notFound,
      },
    },
    delete: {
        method: 'DELETE' as const,
        path: '/api/datasets/:id',
        responses: {
            204: z.void(),
            404: errorSchemas.notFound,
        }
    }
  },
  reports: {
    pdf: {
      method: 'GET' as const,
      path: '/api/report/:id',
      responses: {
        200: z.any(), // Returns Blob/PDF
        404: errorSchemas.notFound,
      }
    }
  }
};

// ============================================
// HELPER
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}