import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Package, 
  AlertTriangle, 
  Edit, 
  Trash2, 
  TrendingUp,
  TrendingDown,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  costPrice: number;
  sellingPrice: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastUpdated: string;
}

const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    sku: "WBH001",
    category: "Electronics",
    quantity: 45,
    minStock: 10,
    costPrice: 1200,
    sellingPrice: 1800,
    status: "In Stock",
    lastUpdated: "2025-01-10"
  },
  {
    id: "2", 
    name: "USB-C Cable",
    sku: "USC002",
    category: "Accessories",
    quantity: 8,
    minStock: 15,
    costPrice: 150,
    sellingPrice: 250,
    status: "Low Stock",
    lastUpdated: "2025-01-09"
  },
  {
    id: "3",
    name: "Laptop Stand",
    sku: "LPS003",
    category: "Accessories", 
    quantity: 0,
    minStock: 5,
    costPrice: 800,
    sellingPrice: 1200,
    status: "Out of Stock",
    lastUpdated: "2025-01-08"
  },
  {
    id: "4",
    name: "Wireless Mouse",
    sku: "WMS004",
    category: "Electronics",
    quantity: 22,
    minStock: 8,
    costPrice: 400,
    sellingPrice: 650,
    status: "In Stock",
    lastUpdated: "2025-01-07"
  }
];

const categories = ["Electronics", "Accessories", "Stationery", "Furniture", "Other"];

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: 0,
    minStock: 0,
    costPrice: 0,
    sellingPrice: 0,
  });

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const inventoryStats = {
    totalItems: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0),
    lowStockItems: inventory.filter(item => item.status === "Low Stock").length,
    outOfStockItems: inventory.filter(item => item.status === "Out of Stock").length
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.sku || !newItem.category) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const item: InventoryItem = {
      id: Date.now().toString(),
      ...newItem,
      status: newItem.quantity <= newItem.minStock ? 
              (newItem.quantity === 0 ? "Out of Stock" : "Low Stock") : 
              "In Stock",
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setInventory([...inventory, item]);
    setNewItem({
      name: "",
      sku: "",
      category: "",
      quantity: 0,
      minStock: 0,
      costPrice: 0,
      sellingPrice: 0,
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Item Added",
      description: `${item.name} has been added to inventory`,
    });
  };

  const handleDeleteItem = (id: string) => {
    const item = inventory.find(i => i.id === id);
    setInventory(inventory.filter(i => i.id !== id));
    toast({
      title: "Item Deleted",
      description: `${item?.name} has been removed from inventory`,
    });
  };

  const sendLowStockAlert = (item: InventoryItem) => {
    toast({
      title: "Low Stock Alert Sent",
      description: `Alert sent for ${item.name} (Current: ${item.quantity}, Min: ${item.minStock})`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground">Track and manage your stock levels</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name *</Label>
                <Input
                  id="itemName"
                  placeholder="Enter item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    placeholder="Enter SKU"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={newItem.category} 
                    onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Min Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    min="0"
                    value={newItem.minStock}
                    onChange={(e) => setNewItem({ ...newItem, minStock: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price (₹)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newItem.costPrice}
                    onChange={(e) => setNewItem({ ...newItem, costPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newItem.sellingPrice}
                    onChange={(e) => setNewItem({ ...newItem, sellingPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <Button onClick={handleAddItem} className="w-full">
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{inventoryStats.totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">₹{inventoryStats.totalValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-warning">{inventoryStats.lowStockItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-destructive">{inventoryStats.outOfStockItems}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id} className={
                    item.status === "Out of Stock" ? "bg-destructive/5" :
                    item.status === "Low Stock" ? "bg-warning/5" : ""
                  }>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={
                          item.quantity <= item.minStock ? "text-warning font-medium" : ""
                        }>
                          {item.quantity}
                        </span>
                        {item.quantity <= item.minStock && (
                          <AlertTriangle className="h-4 w-4 text-warning" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.minStock}</TableCell>
                    <TableCell>₹{item.costPrice}</TableCell>
                    <TableCell>₹{item.sellingPrice}</TableCell>
                    <TableCell>
                      <Badge variant={
                        item.status === "In Stock" ? "default" :
                        item.status === "Low Stock" ? "secondary" :
                        "destructive"
                      }>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.status === "Low Stock" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => sendLowStockAlert(item)}
                          >
                            Alert
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}