import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Building2,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  partyName: string;
  partyType: "Customer" | "Vendor";
  invoiceNumber: string;
  amount: number;
  paymentMode: "Cash" | "UPI" | "Bank Transfer" | "Credit Card" | "Cheque";
  status: "Completed" | "Pending" | "Failed" | "Partial";
  date: string;
  notes?: string;
  reference?: string;
}

const mockPayments: Payment[] = [
  {
    id: "1",
    partyName: "ABC Corporation",
    partyType: "Customer",
    invoiceNumber: "INV-001",
    amount: 45000,
    paymentMode: "UPI",
    status: "Completed",
    date: "2025-01-10",
    reference: "UPI123456789",
    notes: "Payment received through PhonePe"
  },
  {
    id: "2",
    partyName: "XYZ Ltd",
    partyType: "Customer", 
    invoiceNumber: "INV-002",
    amount: 23500,
    paymentMode: "Bank Transfer",
    status: "Pending",
    date: "2025-01-09",
    reference: "NEFT987654321"
  },
  {
    id: "3",
    partyName: "PQR Supplies",
    partyType: "Vendor",
    invoiceNumber: "BILL-001",
    amount: 15000,
    paymentMode: "Cash",
    status: "Completed",
    date: "2025-01-08"
  },
  {
    id: "4",
    partyName: "Tech Solutions",
    partyType: "Customer",
    invoiceNumber: "INV-003",
    amount: 35000,
    paymentMode: "Cheque",
    status: "Failed",
    date: "2025-01-07",
    reference: "CHQ001234",
    notes: "Cheque bounced - insufficient funds"
  }
];

const paymentModes = ["Cash", "UPI", "Bank Transfer", "Credit Card", "Cheque"];
const parties = ["ABC Corporation", "XYZ Ltd", "PQR Supplies", "Tech Solutions"];

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMode, setFilterMode] = useState("all");
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { toast } = useToast();

  const [newPayment, setNewPayment] = useState({
    partyName: "",
    invoiceNumber: "",
    amount: 0,
    paymentMode: "" as Payment["paymentMode"] | "",
    reference: "",
    notes: "",
  });

  const [reminderData, setReminderData] = useState({
    message: "",
    method: "whatsapp" as "whatsapp" | "sms" | "email"
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesMode = filterMode === "all" || payment.paymentMode === filterMode;
    
    return matchesSearch && matchesStatus && matchesMode;
  });

  const paymentStats = {
    totalPayments: payments.length,
    completedAmount: payments.filter(p => p.status === "Completed").reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter(p => p.status === "Pending").reduce((sum, p) => sum + p.amount, 0),
    failedAmount: payments.filter(p => p.status === "Failed").reduce((sum, p) => sum + p.amount, 0),
  };

  const handleRecordPayment = () => {
    if (!newPayment.partyName || !newPayment.invoiceNumber || newPayment.amount <= 0 || !newPayment.paymentMode) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const payment: Payment = {
      id: Date.now().toString(),
      partyName: newPayment.partyName,
      partyType: "Customer", // This would be determined based on the party
      invoiceNumber: newPayment.invoiceNumber,
      amount: newPayment.amount,
      paymentMode: newPayment.paymentMode as Payment["paymentMode"],
      status: "Completed",
      date: new Date().toISOString().split('T')[0],
      reference: newPayment.reference,
      notes: newPayment.notes,
    };

    setPayments([payment, ...payments]);
    setNewPayment({
      partyName: "",
      invoiceNumber: "",
      amount: 0,
      paymentMode: "",
      reference: "",
      notes: "",
    });
    setIsRecordDialogOpen(false);
    
    toast({
      title: "Payment Recorded",
      description: `Payment of ₹${payment.amount.toLocaleString()} has been recorded successfully`,
    });
  };

  const handleSendReminder = () => {
    if (!selectedPayment || !reminderData.message) {
      toast({
        title: "Incomplete Information",
        description: "Please enter a reminder message",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${selectedPayment.partyName} via ${reminderData.method}`,
    });
    
    setReminderData({ message: "", method: "whatsapp" });
    setIsReminderDialogOpen(false);
  };

  const markAsSettled = (paymentId: string) => {
    const updatedPayments = payments.map(payment => {
      if (payment.id === paymentId) {
        return { ...payment, status: "Completed" as const };
      }
      return payment;
    });
    
    setPayments(updatedPayments);
    const payment = payments.find(p => p.id === paymentId);
    toast({
      title: "Payment Settled",
      description: `Payment for ${payment?.invoiceNumber} has been marked as settled`,
    });
  };

  const getStatusIcon = (status: Payment["status"]) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "Failed":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "Partial":
        return <Clock className="h-4 w-4 text-primary" />;
    }
  };

  const getPaymentModeIcon = (mode: Payment["paymentMode"]) => {
    switch (mode) {
      case "Cash":
        return <Banknote className="h-4 w-4" />;
      case "UPI":
        return <Smartphone className="h-4 w-4" />;
      case "Bank Transfer":
        return <Building2 className="h-4 w-4" />;
      case "Credit Card":
        return <CreditCard className="h-4 w-4" />;
      case "Cheque":
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payments</h2>
          <p className="text-muted-foreground">Record and track payment transactions</p>
        </div>
        <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="partyName">Party Name *</Label>
                <Select 
                  value={newPayment.partyName} 
                  onValueChange={(value) => setNewPayment({ ...newPayment, partyName: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select party" />
                  </SelectTrigger>
                  <SelectContent>
                    {parties.map((party) => (
                      <SelectItem key={party} value={party}>{party}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                  <Input
                    id="invoiceNumber"
                    placeholder="INV-001"
                    value={newPayment.invoiceNumber}
                    onChange={(e) => setNewPayment({ ...newPayment, invoiceNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMode">Payment Mode *</Label>
                <Select 
                  value={newPayment.paymentMode} 
                  onValueChange={(value) => setNewPayment({ ...newPayment, paymentMode: value as Payment["paymentMode"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentModes.map((mode) => (
                      <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Reference Number</Label>
                <Input
                  id="reference"
                  placeholder="Transaction reference"
                  value={newPayment.reference}
                  onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes..."
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                  rows={2}
                />
              </div>
              <Button onClick={handleRecordPayment} className="w-full">
                Record Payment
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
                <p className="text-sm font-medium text-muted-foreground">Total Payments</p>
                <p className="text-2xl font-bold">{paymentStats.totalPayments}</p>
              </div>
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">₹{paymentStats.completedAmount.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">₹{paymentStats.pendingAmount.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-destructive">₹{paymentStats.failedAmount.toLocaleString()}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
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
                  placeholder="Search by party name, invoice number, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Partial">Partial</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterMode} onValueChange={setFilterMode}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Payment Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                {paymentModes.map((mode) => (
                  <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Party</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.partyName}</div>
                        <Badge variant={payment.partyType === "Customer" ? "default" : "secondary"} className="text-xs">
                          {payment.partyType}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                    <TableCell>
                      <span className="font-medium">₹{payment.amount.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentModeIcon(payment.paymentMode)}
                        <span>{payment.paymentMode}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <Badge variant={
                          payment.status === "Completed" ? "default" :
                          payment.status === "Pending" ? "secondary" :
                          payment.status === "Failed" ? "destructive" :
                          "outline"
                        }>
                          {payment.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {payment.reference || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {payment.status === "Pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPayment(payment);
                                setIsReminderDialogOpen(true);
                              }}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsSettled(payment.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {payment.status === "Failed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsSettled(payment.id)}
                          >
                            Retry
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Send Reminder Dialog */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Payment Reminder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Sending reminder to</p>
              <p className="font-medium">{selectedPayment?.partyName}</p>
              <p className="text-sm text-muted-foreground">
                Invoice: {selectedPayment?.invoiceNumber} • Amount: ₹{selectedPayment?.amount.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Send via</Label>
              <Select 
                value={reminderData.method} 
                onValueChange={(value) => setReminderData({ ...reminderData, method: value as typeof reminderData.method })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminderMessage">Message</Label>
              <Textarea
                id="reminderMessage"
                placeholder="Enter your reminder message..."
                value={reminderData.message}
                onChange={(e) => setReminderData({ ...reminderData, message: e.target.value })}
                rows={4}
              />
            </div>
            <Button onClick={handleSendReminder} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Reminder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}