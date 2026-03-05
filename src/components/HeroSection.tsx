import { Button } from "@/components/ui/button";
import { ArrowRight, Package, FileText } from "lucide-react";
import heroOcean from "@/assets/hero-ocean.jpg";

interface HeroSectionProps {
  onTrackClick: () => void;
  onQuoteClick: () => void;
}

const HeroSection = ({ onTrackClick, onQuoteClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroOcean} alt="Global Logistics" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/60" />
      </div>

      <div className="relative z-10 container-wide section-padding pt-24 md:pt-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-accent/20 text-accent mb-4 md:mb-6 animate-fade-in">
            <Package className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-medium">Global Logistics Solutions</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-primary-foreground mb-4 md:mb-6 leading-tight opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Delivering Your
            <span className="block text-gradient">World, Seamlessly</span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-primary-foreground/80 mb-6 md:mb-8 max-w-2xl opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            From ocean to air, land to doorstep — SwiftPath Delivery connects your cargo to every corner of the globe with precision and care.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="lg" className="text-sm md:text-base" onClick={onQuoteClick}>
              <FileText className="w-4 h-4 md:w-5 md:h-5" />
              Get a Free Quote
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <Button variant="heroOutline" size="lg" className="text-sm md:text-base" onClick={onTrackClick}>
              <Package className="w-4 h-4 md:w-5 md:h-5" />
              Track Your Shipment
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-10 md:mt-16 pt-6 md:pt-8 border-t border-primary-foreground/20 opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div>
              <div className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-accent">150+</div>
              <div className="text-xs md:text-sm text-primary-foreground/70 mt-1">Countries Served</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-accent">50K+</div>
              <div className="text-xs md:text-sm text-primary-foreground/70 mt-1">Deliveries Monthly</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-accent">99.8%</div>
              <div className="text-xs md:text-sm text-primary-foreground/70 mt-1">On-Time Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-accent rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
