import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  Eye, 
  Calculator, 
  User, 
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Customer {
  name: string;
  phone: string;
  email: string;
  address: string;
  gstin?: string;
}

const paymentModes = ["Cash", "Bank Transfer", "UPI", "Credit Card", "Cheque"];

export default function CreateInvoice() {
  const { toast } = useToast();
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    email: "",
    address: "",
    gstin: ""
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", name: "", quantity: 1, rate: 0, amount: 0 }
  ]);

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: "",
    paymentMode: "",
    notes: "",
    discount: 0,
    discountType: "amount" // "amount" or "percentage"
  });

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    
    let discountAmount = 0;
    if (invoiceDetails.discountType === "percentage") {
      discountAmount = (subtotal * invoiceDetails.discount) / 100;
    } else {
      discountAmount = invoiceDetails.discount;
    }
    
    const taxableAmount = subtotal - discountAmount;
    const cgst = taxableAmount * 0.09; // 9% CGST
    const sgst = taxableAmount * 0.09; // 9% SGST
    const total = taxableAmount + cgst + sgst;

    return {
      subtotal,
      discountAmount,
      taxableAmount,
      cgst,
      sgst,
      total
    };
  };

  const totals = calculateTotals();

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Invoice has been saved as draft successfully",
    });
  };

  const handleGenerateInvoice = () => {
    if (!customer.name || items.some(item => !item.name || item.quantity <= 0 || item.rate <= 0)) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all customer details and item information",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Invoice Generated",
      description: `Invoice ${invoiceDetails.invoiceNumber} has been generated successfully`,
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Invoice",
      description: "Invoice sharing options will be available soon",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Create New Invoice</h2>
          <p className="text-muted-foreground">Generate professional invoices for your customers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleGenerateInvoice}>
            <Calculator className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  placeholder="Enter customer name"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  id="customerPhone"
                  placeholder="Enter phone number"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email Address</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerGSTIN">GSTIN (Optional)</Label>
                <Input
                  id="customerGSTIN"
                  placeholder="Enter GSTIN number"
                  value={customer.gstin}
                  onChange={(e) => setCustomer({ ...customer, gstin: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerAddress">Address</Label>
              <Textarea
                id="customerAddress"
                placeholder="Enter customer address"
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceDetails.invoiceNumber}
                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, invoiceNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceDetails.invoiceDate}
                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, invoiceDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={invoiceDetails.dueDate}
                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, dueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMode">Payment Mode</Label>
              <Select 
                value={invoiceDetails.paymentMode} 
                onValueChange={(value) => setInvoiceDetails({ ...invoiceDetails, paymentMode: value })}
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
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice Items</CardTitle>
            <Button onClick={addItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Item Name</TableHead>
                  <TableHead className="w-[100px]">Quantity</TableHead>
                  <TableHead className="w-[120px]">Rate (₹)</TableHead>
                  <TableHead className="w-[120px]">Amount (₹)</TableHead>
                  <TableHead className="w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        placeholder="Enter item name"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₹{item.amount.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Totals and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes and Discount */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <div className="flex gap-2">
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  value={invoiceDetails.discount}
                  onChange={(e) => setInvoiceDetails({ ...invoiceDetails, discount: parseFloat(e.target.value) || 0 })}
                />
                <Select 
                  value={invoiceDetails.discountType} 
                  onValueChange={(value) => setInvoiceDetails({ ...invoiceDetails, discountType: value })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amount">₹</SelectItem>
                    <SelectItem value="percentage">%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes..."
                value={invoiceDetails.notes}
                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, notes: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-₹{totals.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Taxable Amount:</span>
              <span>₹{totals.taxableAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>CGST (9%):</span>
              <span>₹{totals.cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>SGST (9%):</span>
              <span>₹{totals.sgst.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount:</span>
              <span>₹{totals.total.toFixed(2)}</span>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button onClick={handleGenerateInvoice} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Generate Invoice
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleShare} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" onClick={() => {}} className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}