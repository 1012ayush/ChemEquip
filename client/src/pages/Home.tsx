import { Button } from "../components/ui/button";
import { Layout } from "@/components/Layout";
import { UploadDropzone } from "@/components/UploadDropzone";
import { useDatasets } from "@/hooks/use-datasets";
import { Link } from "wouter";
import { ArrowRight, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// 1. Added parseISO to the imports
import { formatDistanceToNow, parseISO } from "date-fns";

export default function Home() {
  const { data: recentDatasets, isLoading } = useDatasets();
  const latest = recentDatasets?.[0];

  return (
    <Layout title="Overview">
      <div className="space-y-12">
        {/* Hero / Upload Section */}
        <section className="text-center space-y-8 py-10">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
              Industrial Equipment Analytics
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Upload your equipment logs to visualize performance metrics,
              detect anomalies, and generate professional reports instantly.
            </p>
          </div>

          <UploadDropzone />
        </section>

        {/* Quick Actions / Recent Activity */}
        {latest && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="dashboard-card border-l-4 border-l-primary hover:border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  Latest Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{latest.filename}</h3>
                    <p className="text-sm text-muted-foreground">
                      Processed{" "}
                      {/* 2. Fixed: Used parseISO and matched snake_case field from Django */}
                      {formatDistanceToNow(parseISO(latest.upload_timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-2">
                    <div className="bg-secondary/50 p-2 rounded text-center">
                      <div className="text-xs text-muted-foreground uppercase">
                        Units
                      </div>
                      <div className="font-mono font-bold">
                        {/* 3. Fixed: Matched snake_case */}
                        {latest.total_equipment}
                      </div>
                    </div>
                    <div className="bg-secondary/50 p-2 rounded text-center">
                      <div className="text-xs text-muted-foreground uppercase">
                        Avg Press
                      </div>
                      <div className="font-mono font-bold">
                        {/* 4. Fixed: Matched snake_case */}
                        {Number(latest.avg_pressure).toFixed(0)}
                      </div>
                    </div>
                    <div className="bg-secondary/50 p-2 rounded text-center">
                      <div className="text-xs text-muted-foreground uppercase">
                        Avg Temp
                      </div>
                      <div className="font-mono font-bold">
                        {/* 5. Fixed: Matched snake_case */}
                        {Number(latest.avg_temperature).toFixed(0)}
                      </div>
                    </div>
                  </div>
                  <Link href={`/dashboard/${latest.id}`} className="w-full">
                    <Button className="w-full group">
                      View Dashboard
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card border-l-4 border-l-emerald-500 hover:border-l-emerald-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Access your complete history of uploaded datasets and
                    generated reports.
                  </p>
                  <div className="space-y-2">
                    {(recentDatasets || []).slice(0, 3).map((ds:any) => (
                      <Link
                        key={ds.id}
                        href={`/dashboard/${ds.id}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group">
                          <span className="text-sm font-medium truncate max-w-[200px]">
                            {ds.filename}
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/history" className="block mt-4">
                    <Button variant="outline" className="w-full">
                      Browse All History
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </Layout>
  );
}