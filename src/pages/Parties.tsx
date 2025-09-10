import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Users, 
  UserCheck, 
  Building, 
  Phone, 
  Mail, 
  Eye,
  Edit,
  Trash2,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Party {
  id: string;
  name: string;
  type: "Customer" | "Vendor";
  phone: string;
  email: string;
  address: string;
  gstin?: string;
  creditLimit: number;
  balance: number;
  totalTransactions: number;
  lastTransaction: string;
  status: "Active" | "Inactive";
}

const mockParties: Party[] = [
  {
    id: "1",
    name: "ABC Corporation",
    type: "Customer",
    phone: "+91 98765 43210",
    email: "contact@abccorp.com",
    address: "123 Business District, Mumbai, MH 400001",
    gstin: "27ABCDE1234F1Z5",
    creditLimit: 100000,
    balance: 25000,
    totalTransactions: 15,
    lastTransaction: "2025-01-10",
    status: "Active"
  },
  {
    id: "2",
    name: "XYZ Ltd",
    type: "Customer",
    phone: "+91 87654 32109",
    email: "info@xyzltd.com",
    address: "456 Tech Park, Bangalore, KA 560001",
    gstin: "29XYZAB5678G2H6",
    creditLimit: 50000,
    balance: -5000,
    totalTransactions: 8,
    lastTransaction: "2025-01-08",
    status: "Active"
  },
  {
    id: "3",
    name: "PQR Supplies",
    type: "Vendor",
    phone: "+91 76543 21098",
    email: "sales@pqrsupplies.com",
    address: "789 Industrial Area, Delhi, DL 110001",
    gstin: "07PQRST9012J3K4",
    creditLimit: 75000,
    balance: 15000,
    totalTransactions: 22,
    lastTransaction: "2025-01-09",
    status: "Active"
  },
  {
    id: "4",
    name: "Inactive Trader",
    type: "Customer",
    phone: "+91 65432 10987",
    email: "trader@inactive.com",
    address: "Old Market Street",
    creditLimit: 25000,
    balance: 0,
    totalTransactions: 3,
    lastTransaction: "2024-12-15",
    status: "Inactive"
  }
];

export default function Parties() {
  const [parties, setParties] = useState<Party[]>(mockParties);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("customers");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isCreditDialogOpen, setIsCreditDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newParty, setNewParty] = useState({
    name: "",
    type: "Customer" as "Customer" | "Vendor",
    phone: "",
    email: "",
    address: "",
    gstin: "",
    creditLimit: 0,
  });

  const [creditAdjustment, setCreditAdjustment] = useState({
    amount: 0,
    reason: "",
    type: "increase" as "increase" | "decrease"
  });

  const filteredParties = parties.filter(party => {
    const matchesSearch = party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         party.phone.includes(searchTerm) ||
                         party.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeTab === "all" || 
                       (activeTab === "customers" && party.type === "Customer") ||
                       (activeTab === "vendors" && party.type === "Vendor");
    
    return matchesSearch && matchesType;
  });

  const partyStats = {
    totalCustomers: parties.filter(p => p.type === "Customer").length,
    totalVendors: parties.filter(p => p.type === "Vendor").length,
    totalReceivables: parties.filter(p => p.type === "Customer").reduce((sum, p) => sum + Math.max(0, p.balance), 0),
    totalPayables: parties.filter(p => p.type === "Vendor").reduce((sum, p) => sum + Math.max(0, p.balance), 0),
  };

  const handleAddParty = () => {
    if (!newParty.name || !newParty.phone) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in name and phone number",
        variant: "destructive",
      });
      return;
    }

    const party: Party = {
      id: Date.now().toString(),
      ...newParty,
      balance: 0,
      totalTransactions: 0,
      lastTransaction: new Date().toISOString().split('T')[0],
      status: "Active"
    };

    setParties([...parties, party]);
    setNewParty({
      name: "",
      type: "Customer",
      phone: "",
      email: "",
      address: "",
      gstin: "",
      creditLimit: 0,
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Party Added",
      description: `${party.name} has been added as a ${party.type.toLowerCase()}`,
    });
  };

  const handleCreditAdjustment = () => {
    if (!selectedParty || creditAdjustment.amount <= 0) {
      toast({
        title: "Invalid Adjustment",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const updatedParties = parties.map(party => {
      if (party.id === selectedParty.id) {
        const adjustment = creditAdjustment.type === "increase" ? 
                          creditAdjustment.amount : 
                          -creditAdjustment.amount;
        return {
          ...party,
          balance: party.balance + adjustment
        };
      }
      return party;
    });

    setParties(updatedParties);
    setCreditAdjustment({ amount: 0, reason: "", type: "increase" });
    setIsCreditDialogOpen(false);
    
    toast({
      title: "Credit Adjusted",
      description: `Credit ${creditAdjustment.type}d by ₹${creditAdjustment.amount} for ${selectedParty.name}`,
    });
  };

  const mockTransactions = [
    { date: "2025-01-10", type: "Invoice", number: "INV-001", amount: 25000 },
    { date: "2025-01-05", type: "Payment", number: "PAY-001", amount: -15000 },
    { date: "2024-12-28", type: "Invoice", number: "INV-002", amount: 35000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Parties Management</h2>
          <p className="text-muted-foreground">Manage your customers and vendors</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Party
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Party</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partyName">Name *</Label>
                  <Input
                    id="partyName"
                    placeholder="Enter party name"
                    value={newParty.name}
                    onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partyType">Type</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={newParty.type}
                    onChange={(e) => setNewParty({ ...newParty, type: e.target.value as "Customer" | "Vendor" })}
                  >
                    <option value="Customer">Customer</option>
                    <option value="Vendor">Vendor</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partyPhone">Phone *</Label>
                  <Input
                    id="partyPhone"
                    placeholder="Enter phone number"
                    value={newParty.phone}
                    onChange={(e) => setNewParty({ ...newParty, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partyEmail">Email</Label>
                  <Input
                    id="partyEmail"
                    type="email"
                    placeholder="Enter email"
                    value={newParty.email}
                    onChange={(e) => setNewParty({ ...newParty, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="partyAddress">Address</Label>
                <Textarea
                  id="partyAddress"
                  placeholder="Enter address"
                  value={newParty.address}
                  onChange={(e) => setNewParty({ ...newParty, address: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partyGstin">GSTIN</Label>
                  <Input
                    id="partyGstin"
                    placeholder="Enter GSTIN"
                    value={newParty.gstin}
                    onChange={(e) => setNewParty({ ...newParty, gstin: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit (₹)</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    min="0"
                    value={newParty.creditLimit}
                    onChange={(e) => setNewParty({ ...newParty, creditLimit: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <Button onClick={handleAddParty} className="w-full">
                Add Party
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
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{partyStats.totalCustomers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Vendors</p>
                <p className="text-2xl font-bold">{partyStats.totalVendors}</p>
              </div>
              <Building className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receivables</p>
                <p className="text-2xl font-bold text-success">₹{partyStats.totalReceivables.toLocaleString()}</p>
              </div>
              <CreditCard className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payables</p>
                <p className="text-2xl font-bold text-warning">₹{partyStats.totalPayables.toLocaleString()}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search parties by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Parties Tabs and Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="all">All Parties</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Credit Limit</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParties.filter(p => p.type === "Customer").map((party) => (
                      <TableRow key={party.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{party.name}</div>
                            <div className="text-sm text-muted-foreground">{party.gstin}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              <span className="text-sm">{party.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              <span className="text-sm">{party.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            party.balance > 0 ? "text-success" :
                            party.balance < 0 ? "text-destructive" :
                            "text-muted-foreground"
                          }`}>
                            ₹{party.balance.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>₹{party.creditLimit.toLocaleString()}</TableCell>
                        <TableCell>{party.totalTransactions}</TableCell>
                        <TableCell>
                          <Badge variant={party.status === "Active" ? "default" : "secondary"}>
                            {party.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedParty(party);
                                setIsTransactionDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedParty(party);
                                setIsCreditDialogOpen(true);
                              }}
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="vendors" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Credit Limit</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParties.filter(p => p.type === "Vendor").map((party) => (
                      <TableRow key={party.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{party.name}</div>
                            <div className="text-sm text-muted-foreground">{party.gstin}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              <span className="text-sm">{party.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              <span className="text-sm">{party.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            party.balance > 0 ? "text-success" :
                            party.balance < 0 ? "text-destructive" :
                            "text-muted-foreground"
                          }`}>
                            ₹{party.balance.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>₹{party.creditLimit.toLocaleString()}</TableCell>
                        <TableCell>{party.totalTransactions}</TableCell>
                        <TableCell>
                          <Badge variant={party.status === "Active" ? "default" : "secondary"}>
                            {party.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedParty(party);
                                setIsTransactionDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedParty(party);
                                setIsCreditDialogOpen(true);
                              }}
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParties.map((party) => (
                      <TableRow key={party.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{party.name}</div>
                            <div className="text-sm text-muted-foreground">{party.gstin}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={party.type === "Customer" ? "default" : "secondary"}>
                            {party.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              <span className="text-sm">{party.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              <span className="text-sm">{party.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            party.balance > 0 ? "text-success" :
                            party.balance < 0 ? "text-destructive" :
                            "text-muted-foreground"
                          }`}>
                            ₹{party.balance.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={party.status === "Active" ? "default" : "secondary"}>
                            {party.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedParty(party);
                                setIsTransactionDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
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
        </TabsContent>
      </Tabs>

      {/* Transaction History Dialog */}
      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction History - {selectedParty?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className={`text-lg font-bold ${
                  (selectedParty?.balance || 0) > 0 ? "text-success" :
                  (selectedParty?.balance || 0) < 0 ? "text-destructive" :
                  "text-muted-foreground"
                }`}>
                  ₹{selectedParty?.balance?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-lg font-bold">{selectedParty?.totalTransactions}</p>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === "Invoice" ? "default" : "secondary"}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.number}</TableCell>
                    <TableCell className={
                      transaction.amount > 0 ? "text-success" : "text-destructive"
                    }>
                      ₹{Math.abs(transaction.amount).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Credit Adjustment Dialog */}
      <Dialog open={isCreditDialogOpen} onOpenChange={setIsCreditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Credit - {selectedParty?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className={`text-lg font-bold ${
                (selectedParty?.balance || 0) > 0 ? "text-success" :
                (selectedParty?.balance || 0) < 0 ? "text-destructive" :
                "text-muted-foreground"
              }`}>
                ₹{selectedParty?.balance?.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Adjustment Type</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={creditAdjustment.type}
                onChange={(e) => setCreditAdjustment({ ...creditAdjustment, type: e.target.value as "increase" | "decrease" })}
              >
                <option value="increase">Increase Balance</option>
                <option value="decrease">Decrease Balance</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adjustAmount">Amount (₹)</Label>
              <Input
                id="adjustAmount"
                type="number"
                min="0"
                step="0.01"
                value={creditAdjustment.amount}
                onChange={(e) => setCreditAdjustment({ ...creditAdjustment, amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adjustReason">Reason</Label>
              <Textarea
                id="adjustReason"
                placeholder="Enter reason for adjustment..."
                value={creditAdjustment.reason}
                onChange={(e) => setCreditAdjustment({ ...creditAdjustment, reason: e.target.value })}
                rows={3}
              />
            </div>
            <Button onClick={handleCreditAdjustment} className="w-full">
              Adjust Credit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}