import { useRoute, useLocation, Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useDataset } from "@/hooks/use-datasets";
import { StatCard } from "@/components/StatCard";
import { Activity, Thermometer, Gauge, Database, Download, ArrowLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

export default function Dashboard() {
  const [, params] = useRoute("/dashboard/:id");
  const id = params?.id ? parseInt(params.id) : null;
  const { data, isLoading, error } = useDataset(id);
  const [, setLocation] = useLocation();

  if (isLoading) return <DashboardSkeleton />;
  if (error || !data) return <DashboardError />;

  const { dataset, equipment } = data;
  
  const pieData = Object.entries(dataset.type_distribution || {}).map(([name, value]) => ({
    name,
    value: value as number
  }));

  const typeMetrics = Object.keys(dataset.type_distribution || {}).map(type => {
    const items = equipment.filter((e: any) => e.type === type);
    const count = items.length;
    const avgPress = count > 0 ? items.reduce((acc: number, curr: any) => acc + Number(curr.pressure), 0) / count : 0;
    const avgTemp = count > 0 ? items.reduce((acc: number, curr: any) => acc + Number(curr.temperature), 0) / count : 0;
    return { type, Pressure: parseFloat(avgPress.toFixed(1)), Temperature: parseFloat(avgTemp.toFixed(1)) };
  });

  return (
    <Layout 
      title={`Analysis: ${dataset.filename}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation('/history')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to History
          </Button>
          <Button onClick={() => window.open(`${import.meta.env.VITE_API_URL}/api/report/${dataset.id}/`, '_blank')}>
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Equipment" value={dataset.total_equipment} icon={<Database className="w-6 h-6" />} />
          <StatCard title="Avg Flowrate" value={Number(dataset.avg_flowrate).toFixed(2)} unit="L/min" icon={<Activity className="w-6 h-6" />} />
          <StatCard title="Avg Pressure" value={Number(dataset.avg_pressure).toFixed(2)} unit="PSI" icon={<Gauge className="w-6 h-6" />} />
          <StatCard title="Avg Temperature" value={Number(dataset.avg_temperature).toFixed(1)} unit="°C" icon={<Thermometer className="w-6 h-6" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-md">
            <CardHeader><CardTitle>Equipment Distribution</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                    {pieData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader><CardTitle>Performance by Type</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeMetrics}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="type" /><YAxis /><Tooltip /><Legend />
                  <Bar dataKey="Pressure" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Temperature" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader><CardTitle>Raw Data Logs</CardTitle></CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Type</TableHead>
                <TableHead className="text-right">Flowrate</TableHead><TableHead className="text-right">Pressure</TableHead><TableHead className="text-right">Temp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">#{item.id}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell className="text-right">{Number(item.flowrate).toFixed(2)}</TableCell>
                  <TableCell className="text-right">{Number(item.pressure).toFixed(2)}</TableCell>
                  <TableCell className="text-right">{Number(item.temperature).toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </Layout>
  );
}

function DashboardSkeleton() {
  return (
    <Layout title="Loading..."><div className="space-y-8"><Skeleton className="h-32 w-full" /><Skeleton className="h-[400px] w-full" /></div></Layout>
  );
}

function DashboardError() {
  return (
    <Layout title="Error"><div className="text-center py-20"><h2 className="text-2xl font-bold">Dataset not found</h2><Link href="/history"><Button className="mt-6">Back to History</Button></Link></div></Layout>
  );
}
