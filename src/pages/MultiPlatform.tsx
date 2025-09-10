import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Download, 
  Monitor, 
  Tablet, 
  Wifi, 
  WifiOff, 
  Cloud, 
  Shield,
  Zap,
  Globe,
  QrCode,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const platforms = [
  {
    id: "android",
    name: "Android App",
    icon: Smartphone,
    version: "v2.4.1",
    size: "45 MB",
    rating: 4.7,
    downloads: "100K+",
    description: "Full-featured mobile app for Android devices with offline support",
    features: [
      "Create invoices on the go",
      "Inventory management",
      "Payment tracking", 
      "Offline mode",
      "Cloud sync",
      "Camera integration"
    ],
    requirements: "Android 7.0 or higher"
  },
  {
    id: "ios",
    name: "iOS App",
    icon: Tablet,
    version: "v2.4.0",
    size: "52 MB", 
    rating: 4.8,
    downloads: "50K+",
    description: "Optimized iOS app with native features and seamless integration",
    features: [
      "Native iOS experience",
      "Touch ID / Face ID support",
      "iOS shortcuts integration",
      "AirPrint support",
      "iCloud backup",
      "Widget support"
    ],
    requirements: "iOS 13.0 or later"
  },
  {
    id: "windows",
    name: "Windows Desktop",
    icon: Monitor,
    version: "v2.3.5",
    size: "125 MB",
    rating: 4.6,
    downloads: "25K+", 
    description: "Powerful desktop application for Windows with advanced features",
    features: [
      "Advanced reporting",
      "Bulk operations",
      "Multi-window support",
      "Excel integration",
      "Local database",
      "Network printing"
    ],
    requirements: "Windows 10 or higher"
  }
];

const features = [
  {
    icon: Cloud,
    title: "Cloud Backup",
    description: "Automatic cloud backup ensures your data is always safe and accessible from any device"
  },
  {
    icon: WifiOff,
    title: "Offline Mode",
    description: "Work seamlessly even without internet connection. Data syncs when you're back online"
  },
  {
    icon: Shield,
    title: "Secure Sync",
    description: "End-to-end encryption ensures your business data remains private and secure"
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description: "Changes made on any device are instantly synced across all your devices"
  },
  {
    icon: Globe,
    title: "Multi-device Access",
    description: "Access your business data from phone, tablet, or computer - anytime, anywhere"
  },
  {
    icon: Wifi,
    title: "Auto Backup",
    description: "Automatic backups ensure you never lose important business data"
  }
];

export default function MultiPlatform() {
  const { toast } = useToast();

  const handleDownload = (platform: string) => {
    toast({
      title: "Download Started",
      description: `${platform} app download will begin shortly`,
    });
  };

  const generateQRCode = () => {
    toast({
      title: "QR Code Generated",
      description: "Scan the QR code with your mobile device to download the app",
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Multi-Platform Access</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Access MyBillBook from any device - Android, iOS, or Windows. 
          Your data stays synced across all platforms with cloud backup and offline support.
        </p>
      </div>

      {/* Platform Download Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <Card key={platform.id} className="relative overflow-hidden">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                  {platform.name}
                  <Badge variant="secondary">{platform.version}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{platform.rating}</span>
                  </div>
                  <div className="text-muted-foreground">{platform.downloads}</div>
                  <div className="text-muted-foreground">{platform.size}</div>
                </div>

                <p className="text-sm text-muted-foreground">{platform.description}</p>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Features:</h4>
                  <ul className="text-sm space-y-1">
                    {platform.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    <strong>Requirements:</strong> {platform.requirements}
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => handleDownload(platform.name)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download for {platform.name.split(" ")[0]}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* QR Code Section */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <QrCode className="h-6 w-6" />
            Quick Install via QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center space-y-2">
                <QrCode className="h-16 w-16 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">QR Code for App Download</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Scan this QR code with your mobile device to download the MyBillBook app
            </p>
            <Button variant="outline" onClick={generateQRCode}>
              Generate QR Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div>
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">Multi-Platform Features</h3>
          <p className="text-muted-foreground">
            Enjoy these powerful features across all your devices
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* System Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>System Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Android</h4>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Android 7.0 (API level 24) or higher</li>
                <li>• 2GB RAM minimum</li>
                <li>• 100MB free storage</li>
                <li>• Internet connection for sync</li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Tablet className="h-5 w-5 text-primary" />
                <h4 className="font-medium">iOS</h4>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• iOS 13.0 or later</li>
                <li>• Compatible with iPhone, iPad</li>
                <li>• 150MB free storage</li>
                <li>• Internet connection for sync</li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Windows</h4>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Windows 10 or higher</li>
                <li>• 4GB RAM minimum</li>
                <li>• 500MB free storage</li>
                <li>• .NET Framework 4.7.2+</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Developer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Developer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Privacy & Security</h4>
              <p className="text-sm text-muted-foreground">
                All your business data is encrypted and stored securely. We follow industry-standard 
                security practices to ensure your information remains private and protected.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Support & Updates</h4>
              <p className="text-sm text-muted-foreground">
                Regular updates with new features and bug fixes. 24/7 customer support available 
                for all platform versions. Free updates for all users.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-4 border-t">
            <Badge variant="outline">End-to-End Encryption</Badge>
            <Badge variant="outline">Regular Security Updates</Badge>
            <Badge variant="outline">24/7 Support</Badge>
            <Badge variant="outline">Free Updates</Badge>
            <Badge variant="outline">Cloud Backup</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}