import {
  BarChart3,
  FolderOpen,
  Users,
  RotateCcw,
  Database,
  Target,
  Shield,
  Activity,
  Settings,
  Globe,
  ArrowRight,
  Zap
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", href: "/" },
    { icon: FolderOpen, label: "Projects", href: "/projects" },
    { icon: Users, label: "Vendors", href: "/vendors" },
    { icon: ArrowRight, label: "Link Flow", href: "/linkflow" },
    { icon: RotateCcw, label: "Redirects", href: "/redirects" },
    { icon: Database, label: "Responses", href: "/responses" },
    { icon: Target, label: "Quotas", href: "/quotas" },
    { icon: Shield, label: "Fraud Prevention", href: "/fraud" },
    { icon: Activity, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">SurveyPanel</h1>
            <p className="text-xs text-sidebar-foreground/60">Admin Dashboard</p>
          </div>
        </Link>
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
