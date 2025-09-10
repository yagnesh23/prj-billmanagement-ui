import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle, Phone, Building, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, title: "Mobile Verification", icon: Phone },
  { id: 2, title: "Business Details", icon: Building },
  { id: 3, title: "Setup Complete", icon: CheckCircle },
];

const businessTypes = [
  "Retail Store",
  "Wholesale Business", 
  "Manufacturing",
  "Service Provider",
  "Trading Business",
  "Restaurant/Food Service",
  "E-commerce",
  "Other"
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    mobile: "",
    otp: "",
    businessName: "",
    gstin: "",
    businessType: "",
    hasGST: false,
  });
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOTP = async () => {
    if (!formData.mobile || formData.mobile.length !== 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      toast({
        title: "OTP Sent",
        description: "Please check your mobile for the verification code",
      });
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP sent to your mobile",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setCurrentStep(2);
      setIsLoading(false);
      toast({
        title: "Mobile Verified",
        description: "Your mobile number has been successfully verified",
      });
    }, 1500);
  };

  const handleBusinessSetup = async () => {
    if (!formData.businessName || !formData.businessType) {
      toast({
        title: "Incomplete Details",
        description: "Please fill in all required business details",
        variant: "destructive",
      });
      return;
    }

    if (formData.hasGST && !formData.gstin) {
      toast({
        title: "GSTIN Required",
        description: "Please enter your GSTIN number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate business setup
    setTimeout(() => {
      setCurrentStep(3);
      setIsLoading(false);
      toast({
        title: "Setup Complete",
        description: "Your business profile has been created successfully",
      });
    }, 2000);
  };

  const handleComplete = () => {
    toast({
      title: "Welcome to MyBillBook!",
      description: "You're all set to start managing your business",
    });
    navigate("/");
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  isCompleted ? "bg-success text-success-foreground" :
                  isActive ? "bg-primary text-primary-foreground" :
                  "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-sm ${
                  isActive ? "text-foreground font-medium" : "text-muted-foreground"
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step 1: Mobile Verification */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Mobile Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 py-2 bg-muted rounded-md text-sm">+91</span>
                <Input
                  id="mobile"
                  placeholder="Enter your 10-digit mobile number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  maxLength={10}
                  disabled={otpSent}
                />
              </div>
            </div>

            {!otpSent ? (
              <Button onClick={handleSendOTP} disabled={isLoading} className="w-full">
                {isLoading ? "Sending OTP..." : "Send OTP"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    maxLength={6}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setOtpSent(false)}>
                    Change Number
                  </Button>
                  <Button onClick={handleVerifyOTP} disabled={isLoading} className="flex-1">
                    {isLoading ? "Verifying..." : "Verify OTP"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Business Details */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Business Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                placeholder="Enter your business name"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type *</Label>
              <Select 
                value={formData.businessType} 
                onValueChange={(value) => setFormData({ ...formData, businessType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasGST"
                checked={formData.hasGST}
                onCheckedChange={(checked) => setFormData({ ...formData, hasGST: !!checked })}
              />
              <Label htmlFor="hasGST">I have GST registration</Label>
            </div>

            {formData.hasGST && (
              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN Number</Label>
                <Input
                  id="gstin"
                  placeholder="Enter your 15-digit GSTIN"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  maxLength={15}
                />
              </div>
            )}

            <Button onClick={handleBusinessSetup} disabled={isLoading} className="w-full">
              {isLoading ? "Setting up..." : "Complete Setup"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Setup Complete */}
      {currentStep === 3 && (
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-2xl">Setup Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              Congratulations! Your MyBillBook account has been set up successfully. 
              You can now start creating invoices, managing inventory, and tracking payments.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h3 className="font-medium">Business Profile</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Business:</strong> {formData.businessName}</p>
                <p><strong>Type:</strong> {formData.businessType}</p>
                <p><strong>Mobile:</strong> +91 {formData.mobile}</p>
                {formData.hasGST && <p><strong>GSTIN:</strong> {formData.gstin}</p>}
              </div>
            </div>

            <Button onClick={handleComplete} className="w-full">
              Start Using MyBillBook
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}