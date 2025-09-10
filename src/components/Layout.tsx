import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Receipt, 
  Package, 
  Users, 
  CreditCard, 
  FileText, 
  Settings, 
  Smartphone, 
  Crown,
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navigationItems = [
  { id: "onboarding", title: "Onboarding", icon: UserPlus, path: "/onboarding" },
  { id: "dashboard", title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { id: "create-invoice", title: "Create Invoice", icon: Receipt, path: "/create-invoice" },
  { id: "inventory", title: "Inventory Mgmt", icon: Package, path: "/inventory" },
  { id: "parties", title: "Parties Mgmt", icon: Users, path: "/parties" },
  { id: "payments", title: "Payments", icon: CreditCard, path: "/payments" },
  { id: "reports", title: "Reports", icon: FileText, path: "/reports" },
  { id: "customization", title: "Customization", icon: Settings, path: "/customization" },
  { id: "multi-platform", title: "Multi-Platform", icon: Smartphone, path: "/multi-platform" },
  { id: "subscription", title: "Subscription", icon: Crown, path: "/subscription" },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const currentItem = navigationItems.find(item => item.path === location.pathname) || navigationItems[1];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <Receipt className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">MyBillBook</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices, customers..."
                className="pl-10 w-64"
              />
            </div>
            
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "bg-card border-r transition-all duration-300 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto",
          sidebarOpen ? "w-64" : "w-16"
        )}>
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-11",
                    !sidebarOpen && "px-3"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {sidebarOpen && <span>{item.title}</span>}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>MyBillBook</span>
                <span>/</span>
                <span className="text-foreground font-medium">{currentItem.title}</span>
              </div>
              <h1 className="text-3xl font-bold">{currentItem.title}</h1>
            </div>
            
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}