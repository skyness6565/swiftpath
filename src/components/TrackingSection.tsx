import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search, MapPin, Clock, CheckCircle2, Truck, AlertCircle, ExternalLink, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TrackingResult {
  trackingNumber: string;
  status: string;
  location: string;
  estimatedDelivery: string;
  senderName: string | null;
  recipientName: string | null;
  origin: string;
  destination: string;
  packageDescription: string | null;
  weight: number | null;
  shippingFee: number | null;
  currency: string | null;
  customsHold: boolean;
  steps: {
    title: string;
    location: string;
    date: string;
    completed: boolean;
  }[];
}

const TrackingSection = () => {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }

    setIsLoading(true);
    setNotFound(false);
    setResult(null);

    try {
      // Try to find shipment in database
      const { data: shipment, error: shipmentError } = await supabase
        .from("shipments")
        .select("*")
        .eq("tracking_number", trackingNumber.toUpperCase())
        .maybeSingle();

      if (shipmentError) {
        console.error("Error fetching shipment:", shipmentError);
        toast.error("Error fetching shipment data");
        setIsLoading(false);
        return;
      }

      if (shipment) {
        // Fetch shipment events
        const { data: events, error: eventsError } = await supabase
          .from("shipment_events")
          .select("*")
          .eq("shipment_id", shipment.id)
          .order("event_date", { ascending: true });

        if (eventsError) {
          console.error("Error fetching events:", eventsError);
        }

        const steps = events?.map((event) => ({
          title: event.title,
          location: event.location,
          date: new Date(event.event_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
          completed: event.completed,
        })) || [];

        setResult({
          trackingNumber: shipment.tracking_number,
          status: shipment.status,
          location: shipment.current_location || shipment.origin_location,
          estimatedDelivery: shipment.estimated_delivery
            ? new Date(shipment.estimated_delivery).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "Calculating...",
          senderName: shipment.sender_name,
          recipientName: shipment.recipient_name,
          origin: shipment.origin_location,
          destination: shipment.destination_location,
          packageDescription: shipment.package_description,
          weight: shipment.weight_kg,
          shippingFee: shipment.shipping_fee,
          currency: shipment.currency,
          customsHold: shipment.customs_hold || false,
          steps,
        });
        toast.success("Shipment found!");
      } else {
        setNotFound(true);
        toast.error("Shipment not found");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    }

    setIsLoading(false);
  };

  const viewFullDetails = () => {
    if (result) {
      navigate(`/track/${result.trackingNumber}`);
    }
  };

  const statusLabels: Record<string, string> = {
    "processing": "Processing",
    "picked-up": "Picked Up",
    "in-transit": "In Transit",
    "at-sorting-center": "At Sorting Center",
    "customs-clearance": "Customs Clearance",
    "out-for-delivery": "Out for Delivery",
    "delivered": "Delivered",
  };

  return (
    <section id="tracking" className="relative bg-navy py-12 md:py-20 lg:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-wide section-padding relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-accent/20 text-accent mb-4 md:mb-6">
            <Package className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-medium">Real-Time Tracking</span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-3 md:mb-4">
            Track Your Shipment
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-primary-foreground/70 max-w-2xl mx-auto px-4">
            Enter your tracking number below to get real-time updates on your shipment's location and estimated delivery time.
          </p>
        </div>

        {/* Tracking Form */}
        <div className="max-w-2xl mx-auto mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                className="pl-10 md:pl-12 h-12 md:h-14 text-sm md:text-base bg-card border-border"
              />
            </div>
            <Button
              variant="hero"
              size="lg"
              className="h-12 md:h-14 px-6 md:px-8"
              onClick={handleTrack}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  <span className="text-sm md:text-base">Tracking...</span>
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Track Now</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Not Found Message */}
        {notFound && (
          <div className="max-w-2xl mx-auto mb-8 p-6 bg-card rounded-xl text-center animate-fade-in">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Shipment Not Found</h3>
            <p className="text-muted-foreground">
              We couldn't find a shipment with that tracking number. Please check the number and try again.
            </p>
          </div>
        )}

        {/* Tracking Result */}
        {result && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-card rounded-2xl shadow-card overflow-hidden">
              {/* Customs Hold Warning */}
              {result.customsHold && (
                <div className="bg-red-500/10 border-b-2 border-red-500/50 p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-red-500 mb-1">⚠️ Customs Hold - Action Required</h3>
                      <p className="text-red-400 text-sm">
                        Your goods have been seized by customs. Contact us via WhatsApp{" "}
                        <a href="https://wa.me/17693590769" target="_blank" rel="noopener noreferrer" className="font-bold underline">+1 (769) 359-0769</a>{" "}
                        or email <a href="mailto:support@swiftpathdelivery.site" className="font-bold underline">support@swiftpathdelivery.site</a>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="bg-accent p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-accent-foreground/70 text-xs md:text-sm mb-1">Tracking Number</p>
                    <p className="text-lg md:text-xl font-bold text-accent-foreground">{result.trackingNumber}</p>
                  </div>
                  <div className={`flex items-center gap-3 px-3 md:px-4 py-2 rounded-full ${
                    result.customsHold ? "bg-red-500/30" : "bg-accent-foreground/20"
                  }`}>
                    <Truck className="w-4 h-4 md:w-5 md:h-5 text-accent-foreground" />
                    <span className="font-semibold text-sm md:text-base text-accent-foreground">
                      {result.customsHold ? "Customs Hold" : statusLabels[result.status] || result.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Cards */}
              <div className="grid md:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6 border-b border-border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Current Location</p>
                    <p className="text-sm md:text-base font-semibold text-foreground">{result.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="text-sm md:text-base font-semibold text-foreground">{result.estimatedDelivery}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Status</p>
                    <p className="text-sm md:text-base font-semibold text-foreground">
                      {result.customsHold ? "On Hold" : "On Schedule"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Package Details Summary */}
              <div className="grid md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 border-b border-border bg-muted/30">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Route</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">From:</span>
                    <span className="font-medium text-foreground">{result.origin}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span className="text-muted-foreground">To:</span>
                    <span className="font-medium text-foreground">{result.destination}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Package Info</h4>
                  {result.senderName && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Sender:</span>
                      <span className="font-medium text-foreground">{result.senderName}</span>
                    </div>
                  )}
                  {result.recipientName && (
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <span className="text-muted-foreground">Recipient:</span>
                      <span className="font-medium text-foreground">{result.recipientName}</span>
                    </div>
                  )}
                  {result.weight && (
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium text-foreground">{result.weight} kg</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              {result.steps.length > 0 && (
                <div className="p-4 md:p-6 border-b border-border">
                  <h3 className="font-semibold text-foreground mb-4 md:mb-6 text-sm md:text-base">Shipment Progress</h3>
                  <div className="space-y-3 md:space-y-4">
                    {result.steps.slice(0, 4).map((step, index) => (
                      <div key={index} className="flex gap-3 md:gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                              step.completed
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {step.completed ? (
                              <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                            ) : (
                              <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                            )}
                          </div>
                          {index < Math.min(result.steps.length, 4) - 1 && (
                            <div
                              className={`w-0.5 flex-1 mt-2 ${
                                step.completed ? "bg-accent" : "bg-muted"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-4 md:pb-6">
                          <p className={`text-sm md:text-base font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.title}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">{step.location}</p>
                          <p className="text-xs md:text-sm text-muted-foreground">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View Full Details Button */}
              <div className="p-4 md:p-6 bg-muted/20">
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={viewFullDetails}
                >
                  <span>View Full Details</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrackingSection;