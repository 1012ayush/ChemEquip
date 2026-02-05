import { Layout } from "@/components/Layout";
import { UploadDropzone } from "@/components/UploadDropzone";

export default function UploadPage() {
  return (
    <Layout title="Upload Data">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold font-display">New Analysis</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Upload your equipment CSV file. Our Django processing engine will 
            automatically parse metrics for Flowrate, Pressure, and Temperature.
          </p>
        </div>

        {/* The logic for the Django endpoint /api/upload/ should be inside this component */}
        <UploadDropzone />

        <div className="text-xs text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border">
          Supported format: <span className="font-mono text-primary">.csv</span> only
        </div>
      </div>
    </Layout>
  );
}