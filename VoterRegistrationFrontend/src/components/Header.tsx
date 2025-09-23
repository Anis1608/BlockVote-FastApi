import { Vote, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Utility to highlight active link
  const getLinkClasses = (path: string) =>
    `relative px-1 py-2 transition-colors ${
      location.pathname === path
        ? "text-primary font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-full"
        : "text-foreground hover:text-primary"
    }`;

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg shadow-md">
              <Vote className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              BlockVote India
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={getLinkClasses("/")}>
              Home
            </Link>
            <a href="#features" className="text-foreground hover:text-primary transition-colors">
              Features
            </a>
            <Link to="/register" className={getLinkClasses("/register")}>
              Elections
            </Link>
            <Link to="/candidates" className={getLinkClasses("/candidates")}>
              Candidates
            </Link>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className={getLinkClasses("/")}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <a
                href="#features"
                className="text-foreground hover:text-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <Link
                to="/register"
                className={getLinkClasses("/register")}
                onClick={() => setIsMenuOpen(false)}
              >
                Elections
              </Link>
              <Link
                to="/candidates"
                className={getLinkClasses("/candidates")}
                onClick={() => setIsMenuOpen(false)}
              >
                Candidates
              </Link>
              <a
                href="#contact"
                className="text-foreground hover:text-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
