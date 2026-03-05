import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Package, Phone, FileText } from "lucide-react";

interface NavbarProps {
  onTrackClick: () => void;
  onQuoteClick: () => void;
}

const Navbar = ({ onTrackClick, onQuoteClick }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container-wide section-padding !py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className={`font-display text-xl font-bold ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`}>
              SwiftPath
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollToSection("services")} className={`font-medium transition-colors hover:text-accent ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`}>Services</button>
            <button onClick={() => scrollToSection("ocean")} className={`font-medium transition-colors hover:text-accent ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`}>Ocean Freight</button>
            <button onClick={() => scrollToSection("land")} className={`font-medium transition-colors hover:text-accent ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`}>Land Transport</button>
            <button onClick={() => scrollToSection("air")} className={`font-medium transition-colors hover:text-accent ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`}>Air Freight</button>
            <button onClick={() => scrollToSection("tracking")} className={`font-medium transition-colors hover:text-accent ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`}>Track Shipment</button>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant={isScrolled ? "outline" : "heroOutline"} size="lg" onClick={onTrackClick}>
              <Package className="w-4 h-4" />
              Track
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-border/20 animate-fade-in">
            <div className="flex flex-col gap-4">
              <button onClick={() => scrollToSection("services")} className="text-left font-medium text-foreground hover:text-accent py-2">Services</button>
              <button onClick={() => scrollToSection("ocean")} className="text-left font-medium text-foreground hover:text-accent py-2">Ocean Freight</button>
              <button onClick={() => scrollToSection("land")} className="text-left font-medium text-foreground hover:text-accent py-2">Land Transport</button>
              <button onClick={() => scrollToSection("air")} className="text-left font-medium text-foreground hover:text-accent py-2">Air Freight</button>
              <button onClick={() => scrollToSection("tracking")} className="text-left font-medium text-foreground hover:text-accent py-2">Track Shipment</button>
              <div className="flex flex-col gap-3 pt-4">
                <Button variant="outline" size="lg" onClick={onTrackClick}>
                  <Package className="w-4 h-4" />
                  Track Your Shipment
                </Button>
                <Button variant="hero" size="lg" onClick={onQuoteClick}>
                  <FileText className="w-4 h-4" />
                  Get a Quote
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
