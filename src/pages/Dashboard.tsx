import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  CreditCard,
  Plus,
  Eye,
  ArrowUpRight,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboardHero from "@/assets/dashboard-hero.jpg";

const statsCards = [
  {
    title: "Sales",
    value: "₹2,45,680",
    change: "+12.3%",
    trend: "up",
    icon: DollarSign,
    color: "success",
    description: "Total sales this month",
    action: "View Sales",
    path: "/create-invoice"
  },
  {
    title: "Purchases", 
    value: "₹1,24,350",
    change: "+8.1%",
    trend: "up",
    icon: ShoppingCart,
    color: "primary",
    description: "Total purchases this month",
    action: "View Purchases",
    path: "/inventory"
  },
  {
    title: "Stock Items",
    value: "247",
    change: "-2.4%",
    trend: "down",
    icon: Package,
    color: "warning",
    description: "Total items in inventory",
    action: "Manage Stock",
    path: "/inventory"
  },
  {
    title: "Payments",
    value: "₹89,450",
    change: "+15.7%", 
    trend: "up",
    icon: CreditCard,
    color: "success",
    description: "Payments received this month",
    action: "View Payments",
    path: "/payments"
  }
];

const recentInvoices = [
  { id: "INV-001", customer: "ABC Corporation", amount: "₹45,000", status: "Paid", date: "2025-01-10" },
  { id: "INV-002", customer: "XYZ Ltd", amount: "₹23,500", status: "Pending", date: "2025-01-09" },
  { id: "INV-003", customer: "Tech Solutions", amount: "₹67,800", status: "Overdue", date: "2025-01-08" },
  { id: "INV-004", customer: "Global Systems", amount: "₹12,000", status: "Paid", date: "2025-01-07" },
];

const lowStockItems = [
  { name: "Laptop Stand", current: 5, minimum: 10, urgent: true },
  { name: "Wireless Mouse", current: 8, minimum: 15, urgent: true },
  { name: "USB Cable", current: 12, minimum: 20, urgent: false },
  { name: "Monitor", current: 3, minimum: 5, urgent: true },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-primary-glow p-8 text-primary-foreground">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${dashboardHero})` }}
        />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome to MyBillBook</h2>
          <p className="text-primary-foreground/90 mb-6">
            Your complete billing and inventory management solution
          </p>
          <div className="flex gap-4">
            <Button 
              variant="secondary" 
              onClick={() => navigate("/create-invoice")}
              className="bg-background/20 text-primary-foreground border-background/30 hover:bg-background/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/reports")}
              className="border-background/30 text-primary-foreground hover:bg-background/20"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === "up";
          
          return (
            <Card 
              key={stat.title} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group"
              onClick={() => handleCardClick(stat.path)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${
                    stat.color === "success" ? "bg-success/10" :
                    stat.color === "warning" ? "bg-warning/10" :
                    "bg-primary/10"
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      stat.color === "success" ? "text-success" :
                      stat.color === "warning" ? "text-warning" :
                      "text-primary"
                    }`} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    <span className={`text-sm font-medium ${
                      isPositive ? "text-success" : "text-destructive"
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-muted-foreground">vs last month</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Invoices
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/create-invoice")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <div className="font-medium">{invoice.id}</div>
                    <div className="text-sm text-muted-foreground">{invoice.customer}</div>
                    <div className="text-xs text-muted-foreground">{invoice.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{invoice.amount}</div>
                    <Badge variant={
                      invoice.status === "Paid" ? "default" :
                      invoice.status === "Pending" ? "secondary" :
                      "destructive"
                    }>
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Low Stock Alerts
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/inventory")}>
                Manage Stock
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => {
                const percentage = (item.current / item.minimum) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.name}</span>
                      <Badge variant={item.urgent ? "destructive" : "secondary"}>
                        {item.current}/{item.minimum}
                      </Badge>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-2 ${percentage <= 50 ? "bg-destructive/20" : "bg-warning/20"}`}
                    />
                    <div className="text-xs text-muted-foreground">
                      {item.urgent ? "Urgent: Order immediately" : "Low stock warning"}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}