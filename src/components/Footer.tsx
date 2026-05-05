import { Package, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="container-wide section-padding pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Brand */}
          <div>
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="font-display text-xl font-bold">SwiftPath</span>
            </a>
            <p className="text-primary-foreground/70 mb-6">
              Connecting your cargo to every corner of the globe with precision, care, and reliability.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Our Services</h3>
            <ul className="space-y-3">
              <li><a href="#ocean" className="text-primary-foreground/70 hover:text-accent transition-colors">Ocean Freight</a></li>
              <li><a href="#land" className="text-primary-foreground/70 hover:text-accent transition-colors">Land Transport</a></li>
              <li><a href="#air" className="text-primary-foreground/70 hover:text-accent transition-colors">Air Freight</a></li>
              <li><a href="#warehouse" className="text-primary-foreground/70 hover:text-accent transition-colors">Warehousing</a></li>
              <li><a href="#delivery" className="text-primary-foreground/70 hover:text-accent transition-colors">Last Mile Delivery</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#tracking" className="text-primary-foreground/70 hover:text-accent transition-colors">Track Shipment</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">Get a Quote</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">News & Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70">
                  1234 Logistics Avenue,<br />
                  Los Angeles, CA 90001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="https://wa.me/17693590769" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  +1 (769) 359-0769
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="mailto:support@swiftpathdelivery.site" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  support@swiftpathdelivery.site
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-primary-foreground/50 text-xs md:text-sm">
            © {new Date().getFullYear()} SwiftPath Delivery. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a href="#" className="text-primary-foreground/50 hover:text-accent text-xs md:text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-primary-foreground/50 hover:text-accent text-xs md:text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-primary-foreground/50 hover:text-accent text-xs md:text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
