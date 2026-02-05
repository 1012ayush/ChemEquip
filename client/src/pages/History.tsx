import { Layout } from "@/components/Layout";
import { useDatasets, useDeleteDataset } from "@/hooks/use-datasets";
import { Link } from "wouter";
import { 
  Trash2, 
  Download, 
  ChevronRight, 
  Search,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function History() {
  const { data: datasets, isLoading } = useDatasets();
  const deleteMutation = useDeleteDataset();
  const [search, setSearch] = useState("");

  const filteredDatasets = datasets?.filter((d:any ) => 
    d.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Dataset History">
      <div className="space-y-6">
        <div className="flex w-full max-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by filename..."
              className="pl-9 bg-card"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        ) : filteredDatasets?.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground">No datasets found matching your search.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredDatasets?.map((dataset: any) => (
              <div 
                key={dataset.id}
                className="group relative bg-card hover:bg-accent/5 rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-md flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary font-bold">
                  CSV
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg truncate">{dataset.filename}</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                      ID: {dataset.id}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(parseISO(dataset.upload_timestamp), "PPP 'at' p")}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {dataset.total_equipment} Units
                    </div>
                  </div>
                </div>

                <div className="hidden lg:grid grid-cols-3 gap-6 mr-8 text-sm border-l border-border pl-6">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Flowrate</p>
                    <p className="font-mono font-medium">{Number(dataset.avg_flowrate).toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Pressure</p>
                    <p className="font-mono font-medium">{Number(dataset.avg_pressure).toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Temp</p>
                    <p className="font-mono font-medium">{Number(dataset.avg_temperature).toFixed(1)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-border">
                  <Link href={`/dashboard/${dataset.id}`}>
                    <Button variant="default" size="sm">
                      Analyze
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => window.open(`${import.meta.env.VITE_API_URL}/api/report/${dataset.id}/`, '_blank')}
                  >
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Dataset?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{dataset.filename}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-destructive text-destructive-foreground"
                          onClick={() => deleteMutation.mutate(dataset.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
