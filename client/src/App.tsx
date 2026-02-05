import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import History from "@/pages/History";
import UploadPage from "@/pages/Upload";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/upload" component={UploadPage} />
      <Route path="/history" component={History} />
      {/* This ID is passed to your Dashboard component, 
        which we already updated to fetch from Django 
      */}
      <Route path="/dashboard/:id" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Progress bar or global loaders can be added here if needed */}
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;