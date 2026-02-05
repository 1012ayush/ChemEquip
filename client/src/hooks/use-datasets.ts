import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// 🛠️ Config for environment
const API_URL_PREFIX = import.meta.env.VITE_API_URL || "";
const API_BASE = "/api/datasets";

export function useDatasets() {
  return useQuery({
    queryKey: [API_BASE],
    queryFn: async () => {
      // ✅ Using template literal to combine Prefix + Path
      const res = await fetch(`${API_URL_PREFIX}${API_BASE}/`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch history");
      return await res.json();
    },
  });
}

export function useDataset(id: number | null) {
  return useQuery({
    queryKey: [API_BASE, id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`${API_URL_PREFIX}${API_BASE}/${id}/`, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch details");
      return await res.json();
    },
    enabled: !!id,
  });
}

export function useUploadDataset() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${API_URL_PREFIX}${API_BASE}/upload/`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE] });
      toast({ title: "Success", description: "Dataset processed by Django." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteDataset() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL_PREFIX}${API_BASE}/${id}/`, { 
        method: "DELETE", 
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE] });
      toast({ title: "Deleted", description: "Dataset removed." });
    },
  });
}