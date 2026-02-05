import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, History, Upload, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
}

export function Layout({ children, title, actions }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: "/upload", label: "Upload Data", icon: <Upload className="w-4 h-4" /> },
    { href: "/history", label: "History", icon: <History className="w-4 h-4" /> },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold font-display shadow-lg shadow-primary/25">
            CE
          </div>
          <span className="font-display font-bold text-lg tracking-tight">ChemEquip</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={`nav-link ${isActive ? 'active' : ''}`}>
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <button className="nav-link w-full text-muted-foreground hover:text-foreground">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/20 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-border bg-card fixed h-full z-30">
        <NavContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <NavContent />
                </SheetContent>
              </Sheet>
              
              {title && (
                <h1 className="text-xl font-display font-semibold text-foreground animate-in fade-in slide-in-from-left-2">
                  {title}
                </h1>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {actions}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
