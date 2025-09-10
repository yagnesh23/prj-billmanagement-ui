import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Save, 
  Eye, 
  Settings, 
  Image as ImageIcon, 
  FileText,
  Palette,
  Layout,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const templateOptions = [
  {
    id: "modern",
    name: "Modern Business",
    preview: "bg-gradient-to-br from-blue-50 to-indigo-100",
    description: "Clean and professional design with blue accents"
  },
  {
    id: "classic",
    name: "Classic Corporate", 
    preview: "bg-gradient-to-br from-gray-50 to-slate-100",
    description: "Traditional business layout with neutral colors"
  },
  {
    id: "creative",
    name: "Creative Studio",
    preview: "bg-gradient-to-br from-purple-50 to-pink-100", 
    description: "Vibrant and modern design for creative businesses"
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    preview: "bg-gradient-to-br from-green-50 to-emerald-100",
    description: "Simple and elegant design with minimal elements"
  },
  {
    id: "tech",
    name: "Tech Startup",
    preview: "bg-gradient-to-br from-orange-50 to-red-100",
    description: "Modern tech-inspired design with bold colors"
  },
  {
    id: "professional",
    name: "Professional Services",
    preview: "bg-gradient-to-br from-teal-50 to-cyan-100", 
    description: "Sophisticated design for professional services"
  }
];

export default function Customization() {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [businessInfo, setBusinessInfo] = useState({
    companyName: "MyBillBook Business",
    address: "123 Business Street, City, State 12345",
    phone: "+91 98765 43210",
    email: "contact@mybillbook.com",
    website: "www.mybillbook.com",
    gstin: "22ABCDE1234F1Z5"
  });
  const [termsConditions, setTermsConditions] = useState(`1. Payment Terms: Payment is due within 30 days of invoice date.
2. Late Payment: A late payment fee of 1.5% per month will be charged on overdue amounts.
3. Returns: All returns must be made within 15 days of delivery.
4. Warranty: Products are covered under manufacturer warranty.
5. Governing Law: This agreement shall be governed by the laws of India.`);
  
  const { toast } = useToast();

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 2MB",
          variant: "destructive",
        });
        return;
      }
      setLogoFile(file);
      toast({
        title: "Logo Uploaded",
        description: "Your logo has been uploaded successfully",
      });
    }
  };

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // 1MB limit
        toast({
          title: "File Too Large", 
          description: "Please select a file smaller than 1MB",
          variant: "destructive",
        });
        return;
      }
      setSignatureFile(file);
      toast({
        title: "Signature Uploaded",
        description: "Your digital signature has been uploaded successfully",
      });
    }
  };

  const handleSaveCustomization = () => {
    toast({
      title: "Settings Saved",
      description: "Your customization settings have been saved successfully",
    });
  };

  const handlePreviewInvoice = () => {
    toast({
      title: "Preview Generated",
      description: "Invoice preview will open with your custom settings",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customization</h2>
          <p className="text-muted-foreground">Customize your invoice templates and branding</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreviewInvoice}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSaveCustomization}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="business-info">Business Info</TabsTrigger>
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
        </TabsList>

        {/* Template Selection */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Invoice Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templateOptions.map((template) => (
                  <div
                    key={template.id}
                    className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedTemplate === template.id
                        ? "border-primary shadow-lg ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className={`h-32 rounded-t-lg ${template.preview} flex items-center justify-center`}>
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded shadow-sm">
                        <div className="w-16 h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="w-20 h-2 bg-gray-200 rounded mb-1"></div>
                        <div className="w-12 h-2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{template.name}</h3>
                        {selectedTemplate === template.id && (
                          <Badge variant="default">Selected</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Company Logo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  {logoFile ? (
                    <div className="space-y-4">
                      <div className="w-24 h-24 mx-auto bg-muted rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{logoFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(logoFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setLogoFile(null)}>
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Upload your company logo</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG up to 2MB</p>
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <Button variant="outline" asChild>
                          <label htmlFor="logo-upload" className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                          </label>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Digital Signature */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Digital Signature
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  {signatureFile ? (
                    <div className="space-y-4">
                      <div className="w-24 h-16 mx-auto bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{signatureFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(signatureFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSignatureFile(null)}>
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Upload your digital signature</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG up to 1MB</p>
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSignatureUpload}
                          className="hidden"
                          id="signature-upload"
                        />
                        <Button variant="outline" asChild>
                          <label htmlFor="signature-upload" className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                          </label>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Color Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Scheme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="primaryColor"
                      defaultValue="#2563eb"
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input defaultValue="#2563eb" className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="secondaryColor"
                      defaultValue="#64748b"
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input defaultValue="#64748b" className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="accentColor"
                      defaultValue="#10b981"
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input defaultValue="#10b981" className="flex-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Information */}
        <TabsContent value="business-info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={businessInfo.companyName}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input
                    id="gstin"
                    value={businessInfo.gstin}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, gstin: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={businessInfo.email}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={businessInfo.website}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Terms & Conditions */}
        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Terms & Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="termsConditions">Invoice Terms & Conditions</Label>
                <Textarea
                  id="termsConditions"
                  value={termsConditions}
                  onChange={(e) => setTermsConditions(e.target.value)}
                  rows={12}
                  placeholder="Enter your terms and conditions..."
                />
              </div>
              
              <div className="flex gap-4 text-sm text-muted-foreground">
                <p>Tip: These terms will appear at the bottom of all your invoices.</p>
              </div>
              
              {/* Quick Templates */}
              <div className="space-y-2">
                <Label>Quick Templates</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTermsConditions(`1. Payment Terms: Payment is due within 30 days of invoice date.
2. Late Payment: A late payment fee of 1.5% per month will be charged on overdue amounts.
3. Returns: All returns must be made within 15 days of delivery.
4. Warranty: Products are covered under manufacturer warranty.
5. Governing Law: This agreement shall be governed by the laws of India.`)}
                  >
                    Standard Terms
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTermsConditions(`1. Payment Terms: Payment is due immediately upon receipt.
2. No Returns: All sales are final, no returns or exchanges.
3. Service Warranty: Services are guaranteed for 90 days from completion.
4. Limitation of Liability: Our liability is limited to the invoice amount.`)}
                  >
                    Service Business
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTermsConditions(`1. Payment Terms: Payment is due within 15 days of invoice date.
2. Bulk Orders: Special pricing available for orders over ₹50,000.
3. Delivery: Free delivery for orders above ₹10,000 within city limits.
4. Returns: Defective products can be returned within 7 days.`)}
                  >
                    Retail Business
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}