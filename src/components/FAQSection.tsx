import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Clock, Shield, Package, FileText, Globe } from "lucide-react";

const faqs = [
  {
    category: "Shipping Times",
    icon: Clock,
    questions: [
      {
        question: "How long does ocean freight shipping take?",
        answer: "Ocean freight typically takes 15-45 days depending on the origin and destination ports. Trans-Pacific routes (Asia to North America) average 15-25 days, while Asia to Europe routes can take 25-35 days. We provide real-time tracking so you can monitor your shipment's progress.",
      },
      {
        question: "What is the transit time for air freight?",
        answer: "Air freight is our fastest option, with most shipments arriving within 1-7 days. Express air services can deliver within 24-48 hours for urgent cargo. Standard air freight typically takes 3-7 days depending on the route and customs processing.",
      },
      {
        question: "How long does ground transportation take?",
        answer: "Ground transportation times vary based on distance. Local deliveries are completed same-day or next-day. Regional shipments typically take 2-5 days, while cross-country transport may take 5-10 days. We offer expedited ground services for time-sensitive shipments.",
      },
    ],
  },
  {
    category: "Customs & Documentation",
    icon: FileText,
    questions: [
      {
        question: "What documents are required for international shipping?",
        answer: "Required documents typically include: Commercial Invoice, Packing List, Bill of Lading (ocean) or Air Waybill (air), Certificate of Origin, and any product-specific certifications. Our customs experts will guide you through the documentation process and ensure compliance.",
      },
      {
        question: "Do you handle customs clearance?",
        answer: "Yes, we provide comprehensive customs brokerage services. Our licensed customs brokers handle all import/export documentation, duty calculations, and clearance procedures. We ensure your shipments comply with all regulatory requirements to avoid delays.",
      },
      {
        question: "What items are restricted for international shipping?",
        answer: "Restricted items vary by country but commonly include: hazardous materials, perishables without proper packaging, live animals, weapons, and certain electronics. Contact our team for specific guidance on your cargo and destination.",
      },
    ],
  },
  {
    category: "Insurance & Protection",
    icon: Shield,
    questions: [
      {
        question: "Is my shipment insured?",
        answer: "Basic carrier liability is included with all shipments. However, we strongly recommend purchasing comprehensive cargo insurance for full protection. Our insurance covers loss, damage, and theft during transit, with claims processing support.",
      },
      {
        question: "What does cargo insurance cover?",
        answer: "Our cargo insurance covers physical loss or damage to goods during transit, including loading/unloading, natural disasters, accidents, and theft. Coverage can be customized based on your cargo value and risk tolerance. General average contributions are also covered.",
      },
      {
        question: "How do I file an insurance claim?",
        answer: "To file a claim: 1) Document the damage with photos immediately upon receipt, 2) Note any damage on the delivery receipt, 3) Contact our claims department within 24 hours, 4) Submit the claim form with supporting documentation. Claims are typically processed within 30 days.",
      },
    ],
  },
  {
    category: "Package Requirements",
    icon: Package,
    questions: [
      {
        question: "What are the packaging requirements for freight shipping?",
        answer: "Freight shipments must be packaged in sturdy containers capable of withstanding handling and stacking. Use quality materials like double-wall corrugated boxes, proper cushioning, and weatherproof wrapping. Palletized freight should be properly secured with stretch wrap and strapping.",
      },
      {
        question: "Are there size and weight limits?",
        answer: "Size and weight limits vary by service: Ocean FCL accepts full containers (20ft, 40ft, 45ft). Air freight typically limits pieces to 150kg each. Ground freight can handle up to 20,000kg per truck. Contact us for oversized or heavy-lift cargo solutions.",
      },
      {
        question: "How should I label my packages?",
        answer: "Each package should have clear labels showing: recipient name and address, sender details, handling instructions (fragile, this side up, etc.), tracking barcode or number, and any required hazmat or special handling labels. We provide compliant shipping labels.",
      },
    ],
  },
  {
    category: "International Services",
    icon: Globe,
    questions: [
      {
        question: "Which countries do you ship to?",
        answer: "SwiftPath Delivery operates in over 150 countries worldwide. We have established networks across North America, South America, Europe, Asia-Pacific, Middle East, and Africa. Some remote locations may have limited service options.",
      },
      {
        question: "Do you offer door-to-door international delivery?",
        answer: "Yes, we offer complete door-to-door international delivery services. This includes pickup from origin, export customs clearance, international transport, import customs clearance, and final delivery to the destination address.",
      },
      {
        question: "Can you handle dangerous goods internationally?",
        answer: "Yes, we are certified to handle dangerous goods (DG) shipments. Our trained specialists ensure proper classification, packaging, labeling, and documentation per IATA, IMDG, and DOT regulations. Additional fees and transit times may apply for DG cargo.",
      },
    ],
  },
];

const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>("Shipping Times");

  return (
    <section id="faq" className="bg-background py-12 md:py-20 lg:py-24">
      <div className="container-wide section-padding">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-accent/10 text-accent mb-4 md:mb-6">
            <HelpCircle className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-medium">Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-3 md:mb-4">
            Got Questions? We've Got Answers
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our shipping services, customs procedures, insurance, and more.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12">
          {faqs.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.category}
                onClick={() => setActiveCategory(activeCategory === category.category ? null : category.category)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                  activeCategory === category.category
                    ? "bg-accent text-accent-foreground shadow-glow"
                    : "bg-secondary text-secondary-foreground hover:bg-accent/10"
                }`}
              >
                <Icon className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">{category.category}</span>
                <span className="sm:hidden">{category.category.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((category) => (
            <div
              key={category.category}
              className={`transition-all duration-300 ${
                activeCategory === category.category || activeCategory === null ? "opacity-100" : "hidden"
              }`}
            >
              {(activeCategory === null || activeCategory === category.category) && (
                <div className="mb-8">
                  {activeCategory === null && (
                    <h3 className="text-lg md:text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                      <category.icon className="w-5 h-5 text-accent" />
                      {category.category}
                    </h3>
                  )}
                  <Accordion type="single" collapsible className="space-y-3">
                    {category.questions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.category}-${index}`}
                        className="bg-card rounded-xl border border-border px-4 md:px-6 data-[state=open]:shadow-card"
                      >
                        <AccordionTrigger className="text-left text-sm md:text-base font-medium text-foreground hover:text-accent py-4 md:py-5">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm md:text-base text-muted-foreground pb-4 md:pb-5 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10 md:mt-16">
          <p className="text-muted-foreground mb-4 text-sm md:text-base">
            Still have questions? Our support team is here to help.
          </p>
          <a
            href="mailto:support@swiftpathdelivery.site"
            className="inline-flex items-center gap-2 text-accent font-medium hover:underline text-sm md:text-base"
          >
            Contact Support
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
