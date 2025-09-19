import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Users, Eye, ArrowRight, Flag } from "lucide-react";
import { RegisterVoterForm } from "@/components/forms/RegisterVoterForm";
import { UpdateVoterForm } from "@/components/forms/UpdateVoterForm";
import { ViewVoterForm } from "@/components/forms/ViewVoterForm";
import heroImage from "@/assets/india-voting-hero.jpg";
import indianFlag from "@/assets/indian-flag.jpg";

export function Hero() {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 hero-pattern">
        <img
          src={heroImage}
          alt="India blockchain voting with democratic elements"
          className="w-full h-full object-cover opacity-1 dark:opacity-1"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/80 to-background/80" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Indian Flag Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-tricolor/10 border-2 border-primary/20 mb-8 shadow-tricolor mt-20">
            <img
              src={indianFlag}
              alt="Indian Flag"
              className="h-6 w-8 mr-3 rounded-sm"
            />
            <Shield className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-semibold text-gradient">
              Digital India | Blockchain Democracy
            </span>
            <Flag className="h-4 w-4 text-secondary ml-2" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6">
            <span className="text-gradient">BlockVote</span>
            <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              India
            </span>
          </h1>

          <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-4">
            भारत में डिजिटल मतदान - Secure, Transparent &
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gradient mb-8">
            Blockchain-powered Voting System
          </p>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of Indian democracy with our revolutionary
            blockchain-based voting system. Built for Digital India, ensuring
            transparency, security, and trust in every election across all
            states.
          </p>

          {/* Action Buttons */}
         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Dialog open={activeDialog === "register"} onOpenChange={(open) => setActiveDialog(open ? "register" : null)}>
              <DialogTrigger asChild>
                <Button className="btn-hero w-full sm:w-auto">
                  <Users className="mr-2 h-5 w-5" />
                  Register for Voter ID
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <RegisterVoterForm />
              </DialogContent>
            </Dialog>

            <Dialog open={activeDialog === "update"} onOpenChange={(open) => setActiveDialog(open ? "update" : null)}>
              <DialogTrigger asChild>
                <Button className="btn-secondary-hero w-full sm:w-auto">
                  <Shield className="mr-2 h-5 w-5" />
                  Update Voter ID
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <UpdateVoterForm />
              </DialogContent>
            </Dialog>

            <Dialog open={activeDialog === "view"} onOpenChange={(open) => setActiveDialog(open ? "view" : null)}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto border-2 hover:bg-accent-light/10">
                  <Eye className="mr-2 h-5 w-5" />
                  View Voter Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <ViewVoterForm />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10M+</div>
              <div className="text-muted-foreground">Registered Voters</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">
                99.9%
              </div>
              <div className="text-muted-foreground">Security Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">500+</div>
              <div className="text-muted-foreground">Elections Conducted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
