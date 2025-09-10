import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for reports
const gstReportData = [
  {
    date: "01-01-2025",
    invoiceNo: "INV001",
    customer: "ABC Co.",
    gstin: "24ABCDE123F1Z5",
    taxableValue: 50000,
    cgst: 4500,
    sgst: 4500,
    igst: 0,
    totalInvoice: 59000
  },
  {
    date: "02-01-2025",
    invoiceNo: "INV002", 
    customer: "XYZ Ltd",
    gstin: "27XYZAB456G2H6",
    taxableValue: 75000,
    cgst: 6750,
    sgst: 6750,
    igst: 0,
    totalInvoice: 88500
  },
  {
    date: "03-01-2025",
    invoiceNo: "INV003",
    customer: "PQR Corp",
    gstin: "29PQRST789J3K4",
    taxableValue: 100000,
    cgst: 9000,
    sgst: 9000,
    igst: 0,
    totalInvoice: 118000
  }
];

const profitLossData = {
  salesRevenue: 565000,
  purchases: 280000,
  grossProfit: 285000,
  operatingExpenses: 125000,
  netProfit: 160000,
  grossMargin: 50.4,
  netMargin: 28.3
};

const receivablesData = [
  {
    customer: "ABC Co.",
    invoiceNo: "INV005",
    dueDate: "15-01-2025",
    amount: 45000,
    status: "Pending"
  },
  {
    customer: "XYZ Ltd",
    invoiceNo: "INV006", 
    dueDate: "20-01-2025",
    amount: 67500,
    status: "Overdue"
  },
  {
    customer: "Tech Solutions",
    invoiceNo: "INV007",
    dueDate: "25-01-2025", 
    amount: 23000,
    status: "Pending"
  }
];

const payablesData = [
  {
    vendor: "PQR Ltd",
    billNo: "B001",
    dueDate: "12-01-2025",
    amount: 15000,
    status: "Pending"
  },
  {
    vendor: "LMN Pvt",
    billNo: "B002",
    dueDate: "18-01-2025",
    amount: 32500,
    status: "Paid"
  }
];

const salesByItemData = [
  {
    item: "Wireless Headphones",
    quantity: 45,
    revenue: 135000,
    margin: 35.5
  },
  {
    item: "USB Cable",
    quantity: 120,
    revenue: 30000,
    margin: 66.7
  },
  {
    item: "Laptop Stand",
    quantity: 15,
    revenue: 18000,
    margin: 33.3
  }
];

export default function Reports() {
  const [dateRange, setDateRange] = useState({
    from: "2025-01-01",
    to: "2025-01-31"
  });
  const [selectedParty, setSelectedParty] = useState("all");
  const [selectedInvoiceType, setSelectedInvoiceType] = useState("all");
  const { toast } = useToast();

  const handleExport = (reportType: string, format: string) => {
    toast({
      title: "Export Started",
      description: `${reportType} report is being exported as ${format.toUpperCase()}`,
    });
  };

  const calculateGSTTotals = () => {
    return gstReportData.reduce(
      (acc, row) => ({
        taxableValue: acc.taxableValue + row.taxableValue,
        cgst: acc.cgst + row.cgst,
        sgst: acc.sgst + row.sgst,
        igst: acc.igst + row.igst,
        totalInvoice: acc.totalInvoice + row.totalInvoice
      }),
      { taxableValue: 0, cgst: 0, sgst: 0, igst: 0, totalInvoice: 0 }
    );
  };

  const gstTotals = calculateGSTTotals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports</h2>
          <p className="text-muted-foreground">Generate and analyze business reports</p>
        </div>
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Party</Label>
              <Select value={selectedParty} onValueChange={setSelectedParty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Parties</SelectItem>
                  <SelectItem value="abc">ABC Co.</SelectItem>
                  <SelectItem value="xyz">XYZ Ltd</SelectItem>
                  <SelectItem value="pqr">PQR Corp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Invoice Type</Label>
              <Select value={selectedInvoiceType} onValueChange={setSelectedInvoiceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sales">Sales Invoice</SelectItem>
                  <SelectItem value="purchase">Purchase Invoice</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs defaultValue="gst" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gst">GST Report</TabsTrigger>
          <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
          <TabsTrigger value="receivables">Receivables</TabsTrigger>
          <TabsTrigger value="sales-analysis">Sales Analysis</TabsTrigger>
        </TabsList>

        {/* GST Report */}
        <TabsContent value="gst" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  GST Sales Summary
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport("GST Report", "pdf")}>
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport("GST Report", "excel")}>
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Invoice No</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>GSTIN</TableHead>
                      <TableHead className="text-right">Taxable Value</TableHead>
                      <TableHead className="text-right">CGST</TableHead>
                      <TableHead className="text-right">SGST</TableHead>
                      <TableHead className="text-right">IGST</TableHead>
                      <TableHead className="text-right">Total Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gstReportData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell className="font-medium">{row.invoiceNo}</TableCell>
                        <TableCell>{row.customer}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{row.gstin}</TableCell>
                        <TableCell className="text-right">₹{row.taxableValue.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{row.cgst.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{row.sgst.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{row.igst.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">₹{row.totalInvoice.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    {/* Totals Row */}
                    <TableRow className="bg-muted/50 font-medium">
                      <TableCell colSpan={4}>Total</TableCell>
                      <TableCell className="text-right">₹{gstTotals.taxableValue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">₹{gstTotals.cgst.toLocaleString()}</TableCell>
                      <TableCell className="text-right">₹{gstTotals.sgst.toLocaleString()}</TableCell>
                      <TableCell className="text-right">₹{gstTotals.igst.toLocaleString()}</TableCell>
                      <TableCell className="text-right">₹{gstTotals.totalInvoice.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profit & Loss Report */}
        <TabsContent value="profit-loss" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Profit & Loss Statement
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport("P&L Report", "pdf")}>
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport("P&L Report", "excel")}>
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-success" />
                        <div>
                          <p className="text-sm text-muted-foreground">Sales Revenue</p>
                          <p className="text-xl font-bold">₹{profitLossData.salesRevenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Gross Profit</p>
                          <p className="text-xl font-bold">₹{profitLossData.grossProfit.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-success" />
                        <div>
                          <p className="text-sm text-muted-foreground">Net Profit</p>
                          <p className="text-xl font-bold">₹{profitLossData.netProfit.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-warning" />
                        <div>
                          <p className="text-sm text-muted-foreground">Net Margin</p>
                          <p className="text-xl font-bold">{profitLossData.netMargin}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* P&L Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Particulars</TableHead>
                        <TableHead className="text-right">Amount (₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Sales Revenue</TableCell>
                        <TableCell className="text-right">₹{profitLossData.salesRevenue.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Less: Purchases</TableCell>
                        <TableCell className="text-right">₹{profitLossData.purchases.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-medium">Gross Profit</TableCell>
                        <TableCell className="text-right font-medium">₹{profitLossData.grossProfit.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Less: Operating Expenses</TableCell>
                        <TableCell className="text-right">₹{profitLossData.operatingExpenses.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow className="bg-success/10 border-success">
                        <TableCell className="font-bold">Net Profit</TableCell>
                        <TableCell className="text-right font-bold text-success">₹{profitLossData.netProfit.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receivables Report */}
        <TabsContent value="receivables" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Receivables */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Accounts Receivable
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleExport("Receivables", "pdf")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Invoice No</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Amount (₹)</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {receivablesData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.customer}</TableCell>
                          <TableCell>{row.invoiceNo}</TableCell>
                          <TableCell>{row.dueDate}</TableCell>
                          <TableCell className="text-right">₹{row.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={row.status === "Pending" ? "secondary" : "destructive"}>
                              {row.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-medium">
                        <TableCell colSpan={3}>Total Outstanding</TableCell>
                        <TableCell className="text-right">₹{receivablesData.reduce((sum, row) => sum + row.amount, 0).toLocaleString()}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Payables */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Accounts Payable
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleExport("Payables", "pdf")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Bill No</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Amount (₹)</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payablesData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.vendor}</TableCell>
                          <TableCell>{row.billNo}</TableCell>
                          <TableCell>{row.dueDate}</TableCell>
                          <TableCell className="text-right">₹{row.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={row.status === "Paid" ? "default" : "secondary"}>
                              {row.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-medium">
                        <TableCell colSpan={3}>Total Payable</TableCell>
                        <TableCell className="text-right">₹{payablesData.filter(row => row.status === "Pending").reduce((sum, row) => sum + row.amount, 0).toLocaleString()}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Analysis */}
        <TabsContent value="sales-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sales by Item Analysis
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => handleExport("Sales Analysis", "excel")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead className="text-right">Quantity Sold</TableHead>
                      <TableHead className="text-right">Revenue (₹)</TableHead>
                      <TableHead className="text-right">Margin (%)</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesByItemData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">₹{item.revenue.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.margin}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.margin > 50 ? (
                              <TrendingUp className="h-4 w-4 text-success" />
                            ) : item.margin > 30 ? (
                              <TrendingUp className="h-4 w-4 text-warning" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-destructive" />
                            )}
                            <Badge variant={
                              item.margin > 50 ? "default" :
                              item.margin > 30 ? "secondary" :
                              "destructive"
                            }>
                              {item.margin > 50 ? "High" : item.margin > 30 ? "Medium" : "Low"}
                            </Badge>
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
    </div>
  );
}