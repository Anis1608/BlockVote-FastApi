import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  RefreshCw,
  Search,
  Shield,
  Lock,
  CheckCircle,
  ArrowRight,
  Vote,
  Fingerprint,
  Globe,
  Flag,
} from "lucide-react";
import digitalVoting from "@/assets/digital-voting.jpg";
import parliamentImage from "@/assets/parliament-blockchain.jpg";
import indianFlag from "@/assets/indian-flag.jpg";
import { Link } from "react-router-dom";

export function Features() {
  const features = [
    {
      icon: UserPlus,
      title: "Register & Get Digital Voter ID",
      description:
        "Create your secure blockchain-based voter identity with biometric verification and instant digital ID generation.",
      color: "text-primary",
      bgColor: "bg-primary/10 dark:bg-primary/20",
      link:"/register"
    },
    {
      icon: RefreshCw,
      title: "Update Your Voter Information",
      description:
        "Seamlessly update your personal details, address, and voting preferences with real-time blockchain verification.",
      color: "text-secondary",
      bgColor: "bg-secondary/10 dark:bg-secondary/20",
      link:"/update"
    },
    {
      icon: Search,
      title: "View Voter Details Using Voter ID",
      description:
        "Instantly access and verify voter information using secure blockchain lookup with complete privacy protection.",
      color: "text-accent",
      bgColor: "bg-accent/10 dark:bg-accent/20",
      link:"/view",                              
    },
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: "Military-Grade Security",
      description: "Advanced cryptographic protection",
    },
    {
      icon: Lock,
      title: "Immutable Records",
      description: "Blockchain-verified vote integrity",
    },
    {
      icon: CheckCircle,
      title: "Instant Verification",
      description: "Real-time vote confirmation",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-br from-background to-primary-light/5"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-secondary-light/20 border border-secondary/30 mb-6">
            <img
              src={indianFlag}
              alt="Indian Flag"
              className="h-5 w-7 mr-3 rounded-sm"
            />
            <Vote className="h-4 w-4 text-secondary mr-2" />
            <span className="text-sm font-semibold text-secondary">
              डिजिटल भारत | Digital India Features
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient mb-4">
            Powerful Features for
          </h2>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Modern Indian Democracy
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience democracy reimagined with cutting-edge blockchain
            technology and user-friendly interfaces designed for every Indian
            citizen across all states and territories.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="indian-card group bg-white dark:!bg-black border border-border dark:border-neutral-800 shadow-md hover:shadow-lg transition-all"
            >
              <CardHeader className="text-center pb-4">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.bgColor} 
                      mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-glow`}
                >
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-gradient">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <Button
                  className="group relative overflow-hidden border-2 border-primary text-primary dark:text-white px-6 py-2 rounded-lg 
             hover:text-white transition-colors"
                  variant="outline"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center">
                    <Link to ={feature.link} >शुरू करें | Get Started</Link>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features with Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1">
            <div className="tricolor-border pl-6">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6">
                <span className="text-gradient">Blockchain Security</span>
                <span className="block text-lg font-medium text-muted-foreground mt-2">
                  ब्लॉकचेन सुरक्षा
                </span>
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Immutable Vote Records
                    </h4>
                    <p className="text-muted-foreground">
                      Every vote is permanently recorded on the blockchain,
                      ensuring complete transparency and preventing tampering
                      across all Indian states.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Globe className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Pan-India Compatibility
                    </h4>
                    <p className="text-muted-foreground">
                      Works seamlessly across all 28 states and 8 union
                      territories with multi-language support including Hindi,
                      English, and regional languages.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Fingerprint className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Aadhaar Integration
                    </h4>
                    <p className="text-muted-foreground">
                      Seamless integration with Aadhaar for secure identity
                      verification and streamlined voter registration process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img
                src={digitalVoting}
                alt="Digital voting interface with Indian flag elements"
                className="w-full h-80 object-cover rounded-2xl shadow-tricolor"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Parliament Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="relative">
              <img
                src={parliamentImage}
                alt="Indian Parliament with blockchain network overlay"
                className="w-full h-80 object-cover rounded-2xl shadow-tricolor"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
          <div>
            <div className="tricolor-border pl-6">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6">
                <span className="text-gradient">Democratic Innovation</span>
                <span className="block text-lg font-medium text-muted-foreground mt-2">
                  लोकतांत्रिक नवाचार
                </span>
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Built in collaboration with the Election Commission of India and
                state governments to ensure the highest standards of democratic
                participation across Bharat.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-foreground font-medium">
                    ECI Certified & Approved
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <span className="text-foreground font-medium">
                    Multi-language Support (22 Official Languages)
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span className="text-foreground font-medium">
                    Accessible Design for All Citizens
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                  <span className="text-foreground font-medium">
                    State Government Integration
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div
          className="bg-primary-light/5 rounded-3xl p-8 lg:p-12 border-2 border-transparent shadow-tricolor relative overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg, hsl(var(--background)), hsl(var(--primary-light) / 0.1))",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: "var(--gradient-tricolor)" }}
          ></div>
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gradient mb-4">
              Built for Security & Trust
            </h3>
            <p className="text-lg font-medium text-muted-foreground mb-2">
              सुरक्षा और विश्वसनीयता के लिए निर्मित
            </p>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our blockchain infrastructure ensures every vote is secure,
              transparent, and verifiable across the Indian subcontinent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-light/10 border-2 border-primary/20 mb-4 group-hover:bg-primary-light/20 group-hover:scale-110 transition-all duration-300 shadow-glow">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-bold text-foreground mb-2 text-lg">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
