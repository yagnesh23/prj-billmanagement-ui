import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Crown, 
  Check, 
  X, 
  Zap, 
  Users, 
  BarChart3, 
  Shield,
  Star,
  Diamond,
  Gem,
  CreditCard,
  Gift
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "silver",
    name: "Silver",
    icon: Star,
    price: { monthly: 199, yearly: 1990 },
    originalPrice: { monthly: 299, yearly: 2990 },
    color: "from-gray-400 to-gray-600",
    popular: false,
    description: "Perfect for small businesses just starting out",
    features: [
      { name: "Up to 100 invoices/month", included: true },
      { name: "Basic inventory management", included: true },
      { name: "5 party management", included: true },
      { name: "Basic reports", included: true },
      { name: "Email support", included: true },
      { name: "Multi-user access", included: false },
      { name: "Advanced reports", included: false },
      { name: "API access", included: false },
      { name: "Barcode scanning", included: false },
      { name: "Priority support", included: false }
    ]
  },
  {
    id: "gold",
    name: "Gold",
    icon: Crown,
    price: { monthly: 499, yearly: 4990 },
    originalPrice: { monthly: 699, yearly: 6990 },
    color: "from-yellow-400 to-yellow-600",
    popular: true,
    description: "Most popular plan for growing businesses",
    features: [
      { name: "Unlimited invoices", included: true },
      { name: "Advanced inventory management", included: true },
      { name: "Unlimited parties", included: true },
      { name: "Advanced reports & analytics", included: true },
      { name: "Email & phone support", included: true },
      { name: "Up to 3 users", included: true },
      { name: "GST reports", included: true },
      { name: "API access", included: true },
      { name: "Barcode scanning", included: false },
      { name: "Priority support", included: false }
    ]
  },
  {
    id: "diamond",
    name: "Diamond",
    icon: Diamond,
    price: { monthly: 999, yearly: 9990 },
    originalPrice: { monthly: 1299, yearly: 12990 },
    color: "from-blue-400 to-blue-600",
    popular: false,
    description: "Advanced features for established businesses",
    features: [
      { name: "Everything in Gold", included: true },
      { name: "Advanced inventory with alerts", included: true },
      { name: "Multi-location management", included: true },
      { name: "Advanced analytics dashboard", included: true },
      { name: "Priority support", included: true },
      { name: "Up to 10 users", included: true },
      { name: "Custom reports", included: true },
      { name: "Barcode scanning", included: true },
      { name: "White-label options", included: true },
      { name: "Dedicated account manager", included: false }
    ]
  },
  {
    id: "platinum",
    name: "Platinum", 
    icon: Gem,
    price: { monthly: 1999, yearly: 19990 },
    originalPrice: { monthly: 2499, yearly: 24990 },
    color: "from-purple-400 to-purple-600",
    popular: false,
    description: "Enterprise solution with premium features",
    features: [
      { name: "Everything in Diamond", included: true },
      { name: "Unlimited users", included: true },
      { name: "Advanced automation", included: true },
      { name: "Custom integrations", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "24/7 priority support", included: true },
      { name: "Custom branding", included: true },
      { name: "Advanced security features", included: true },
      { name: "SLA guarantee", included: true },
      { name: "On-premise deployment", included: true }
    ]
  }
];

const additionalFeatures = [
  {
    icon: Users,
    title: "Multi-User Collaboration",
    description: "Work together with your team seamlessly across all devices"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get detailed insights into your business performance"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with regular backups and encryption"
  },
  {
    icon: Zap,
    title: "API Integration",
    description: "Connect with your existing tools and workflows"
  }
];

export default function Subscription() {
  const [isYearly, setIsYearly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpgrade = (planName: string) => {
    setSelectedPlan(planName);
    toast({
      title: "Upgrading to " + planName,
      description: "Redirecting to secure payment gateway...",
    });
  };

  const handleFreeTrial = (planName: string) => {
    toast({
      title: "7-Day Free Trial Started",
      description: `Your ${planName} plan trial has been activated successfully!`,
    });
  };

  const getSavingsPercentage = (monthly: number, yearly: number) => {
    const monthlyCost = monthly * 12;
    const savings = ((monthlyCost - yearly) / monthlyCost) * 100;
    return Math.round(savings);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock premium features and scale your business with our flexible subscription plans. 
          Start with a 7-day free trial on any plan.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 p-1 bg-muted rounded-lg max-w-xs mx-auto">
          <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
            Yearly
          </span>
          {isYearly && (
            <Badge variant="default" className="ml-2">Save up to 23%</Badge>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const currentPrice = isYearly ? plan.price.yearly : plan.price.monthly;
          const originalPrice = isYearly ? plan.originalPrice.yearly : plan.originalPrice.monthly;
          const savings = getSavingsPercentage(plan.price.monthly, plan.price.yearly);
          
          return (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular ? "ring-2 ring-primary shadow-lg scale-105" : ""
              } ${selectedPlan === plan.name ? "ring-2 ring-success" : ""}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? "pt-12" : "pt-6"}`}>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold">₹{currentPrice.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    per {isYearly ? "year" : "month"}
                  </p>
                  {isYearly && (
                    <Badge variant="outline" className="text-xs">
                      Save {savings}%
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-success shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span className={`text-sm ${
                        feature.included ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.name)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Upgrade to {plan.name}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={() => handleFreeTrial(plan.name)}
                  >
                    <Gift className="h-3 w-3 mr-1" />
                    Start 7-Day Free Trial
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Why Upgrade?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* FAQ or Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Money-Back Guarantee</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Not satisfied? Get a full refund within 30 days of your subscription. 
              No questions asked, no hidden fees.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">30-Day Money Back Guarantee</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help Choosing?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Our team is here to help you find the perfect plan for your business needs.
            </p>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm">
                Schedule a Demo
              </Button>
              <Button variant="outline" size="sm">
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}