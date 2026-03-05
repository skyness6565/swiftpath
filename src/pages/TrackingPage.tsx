import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  ArrowLeft,
  Plane,
  Ship,
  Building2,
  Home,
  Box,
  PackageCheck,
  AlertTriangle,
  Weight,
  Mail,
  User,
  Calendar,
  DollarSign,
  FileText,
  ImageIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ShipmentData {
  tracking_number: string;
  status: string;
  origin_location: string;
  destination_location: string;
  current_location: string | null;
  estimated_delivery: string | null;
  sender_name: string | null;
  sender_email: string | null;
  sender_address: string | null;
  sender_country: string | null;
  recipient_name: string | null;
  recipient_email: string | null;
  recipient_address: string | null;
  recipient_country: string | null;
  package_description: string | null;
  weight_kg: number | null;
  shipping_fee: number | null;
  currency: string | null;
  service_type: string;
  package_value: number | null;
  delivery_days: number | null;
  created_at: string;
  customs_hold: boolean | null;
  package_images: string[] | null;
}

interface TrackingEvent {
  id: string;
  title: string;
  location: string;
  event_date: string;
  completed: boolean;
}

const statusIcons: Record<string, React.ReactNode> = {
  "processing": <Box className="w-5 h-5" />,
  "picked-up": <PackageCheck className="w-5 h-5" />,
  "in-transit": <Truck className="w-5 h-5" />,
  "at-sorting-center": <Building2 className="w-5 h-5" />,
  "customs-clearance": <Ship className="w-5 h-5" />,
  "out-for-delivery": <Plane className="w-5 h-5" />,
  "delivered": <Home className="w-5 h-5" />,
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

const allStatuses = [
  "processing",
  "picked-up",
  "in-transit",
  "at-sorting-center",
  "customs-clearance",
  "out-for-delivery",
  "delivered",
];

const TrackingPage = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (trackingNumber) {
      fetchShipment();
    }
  }, [trackingNumber]);

  const fetchShipment = async () => {
    setIsLoading(true);
    setNotFound(false);

    const { data: shipmentData, error: shipmentError } = await supabase
      .from("shipments")
      .select("*")
      .eq("tracking_number", trackingNumber?.toUpperCase())
      .maybeSingle();

    if (shipmentError || !shipmentData) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setShipment(shipmentData as ShipmentData);

    // Fetch events
    const { data: eventsData } = await supabase
      .from("shipment_events")
      .select("*")
      .eq("shipment_id", shipmentData.id)
      .order("event_date", { ascending: false });

    setEvents(eventsData || []);
    setIsLoading(false);
  };

  const getCurrentStatusIndex = () => {
    if (!shipment) return 0;
    return allStatuses.indexOf(shipment.status);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            {/* Animated truck */}
            <div className="absolute inset-0 flex items-center justify-center animate-bounce">
              <Truck className="w-10 h-10 text-accent" />
            </div>
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full border-4 border-accent/30 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-accent/50 animate-pulse" />
          </div>
          <p className="text-primary-foreground/70 animate-pulse">Loading shipment details...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <AlertCircle className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-primary-foreground mb-2">
            Shipment Not Found
          </h1>
          <p className="text-primary-foreground/70 mb-6">
            We couldn't find a shipment with tracking number{" "}
            <span className="font-mono font-bold">{trackingNumber}</span>
          </p>
          <Button variant="hero" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const currentStatusIndex = getCurrentStatusIndex();

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <header className="bg-navy-light border-b border-border/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground/70 hover:text-primary-foreground"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Customs Hold Warning */}
        {shipment?.customs_hold && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-red-500 mb-2">
                    ⚠️ Customs Hold - Action Required
                  </h2>
                  <p className="text-red-400 text-sm leading-relaxed">
                    Your goods have been seized by customs. To avoid losing your package, please contact our support team immediately via WhatsApp at{" "}
                    <a href="https://wa.me/17693590769" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-red-300 transition-colors">
                      +1 (769) 359-0769
                    </a>{" "}or email{" "}
                    <a href="mailto:support@swiftpathdelivery.site" className="font-bold underline hover:text-red-300 transition-colors">
                      support@swiftpathdelivery.site
                    </a>
                    . Failure to respond within 48 hours may result in permanent confiscation of your shipment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-accent to-orange-glow rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden animate-fade-in">
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          
          {/* Animated truck moving across */}
          <div className="absolute bottom-4 left-0 right-0 overflow-hidden pointer-events-none">
            <div className="animate-truck-move">
              <Truck className="w-8 h-8 text-accent-foreground/20" />
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <p className="text-accent-foreground/70 text-sm mb-1">Tracking Number</p>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-accent-foreground">
                  {shipment?.tracking_number}
                </h1>
              </div>
              <div className={`flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                shipment?.customs_hold 
                  ? "bg-red-500/30 ring-2 ring-red-500/50" 
                  : "bg-accent-foreground/20"
              }`}>
                {shipment?.customs_hold ? (
                  <AlertTriangle className="w-5 h-5 text-red-200 animate-pulse" />
                ) : (
                  <div className="relative">
                    {statusIcons[shipment?.status || "processing"]}
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                  </div>
                )}
                <span className="font-semibold text-accent-foreground">
                  {shipment?.customs_hold ? "Customs Hold" : statusLabels[shipment?.status || "processing"]}
                </span>
              </div>
            </div>

            {/* Status Progress Bar */}
            <div className="mt-8">
              <div className="flex justify-between mb-2">
                {allStatuses.map((status, index) => (
                  <div
                    key={status}
                    className={`flex-1 flex flex-col items-center transition-all duration-500 ${
                      index <= currentStatusIndex ? "text-accent-foreground" : "text-accent-foreground/40"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-500 transform ${
                        index < currentStatusIndex
                          ? "bg-accent-foreground text-accent scale-100"
                          : index === currentStatusIndex
                          ? "bg-accent-foreground text-accent ring-4 ring-accent-foreground/30 scale-110"
                          : "bg-accent-foreground/20 scale-90"
                      }`}
                    >
                      {index < currentStatusIndex ? (
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                      ) : index === currentStatusIndex ? (
                        <div className="relative">
                          {statusIcons[status]}
                          <span className="absolute inset-0 rounded-full animate-ping bg-accent-foreground/30" />
                        </div>
                      ) : (
                        statusIcons[status]
                      )}
                    </div>
                    <span className="text-[10px] md:text-xs text-center hidden md:block">
                      {statusLabels[status]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-accent-foreground/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-foreground rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${((currentStatusIndex + 1) / allStatuses.length) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Shipment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-card rounded-xl p-4 border border-border transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center relative">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
                  </div>
                  <span className="text-xs text-muted-foreground">Current Location</span>
                </div>
                <p className="font-semibold text-foreground">
                  {shipment?.current_location || shipment?.origin_location}
                </p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-xs text-muted-foreground">Est. Delivery</span>
                </div>
                <p className="font-semibold text-foreground">
                  {shipment?.estimated_delivery
                    ? new Date(shipment.estimated_delivery).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Calculating..."}
                </p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-purple-500" />
                  </div>
                  <span className="text-xs text-muted-foreground">Service</span>
                </div>
                <p className="font-semibold text-foreground capitalize">
                  {shipment?.service_type || "Standard"}
                </p>
              </div>
            </div>

            {/* Package Images */}
            {shipment?.package_images && shipment.package_images.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
                <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-accent" />
                  Package Images
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {shipment.package_images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image}
                        alt={`Package image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm">View</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
              <h2 className="text-lg font-display font-bold text-foreground mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Tracking History
              </h2>
              {events.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tracking events available yet.
                </p>
              ) : (
                <div className="space-y-1">
                  {events.map((event, index) => (
                    <div
                      key={event.id}
                      className={`relative flex gap-4 pb-6 animate-fade-in ${
                        index === events.length - 1 ? "pb-0" : ""
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Timeline line */}
                      {index < events.length - 1 && (
                        <div
                          className={`absolute left-4 top-8 w-0.5 h-[calc(100%-8px)] transition-all duration-500 ${
                            event.completed ? "bg-accent" : "bg-muted"
                          }`}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          event.completed
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground"
                        } ${index === 0 && event.completed ? "ring-4 ring-accent/20 animate-pulse" : ""}`}
                      >
                        {event.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 transform hover:translate-x-2 transition-transform duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <p
                            className={`font-medium ${
                              event.completed ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {event.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.event_date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Package Info */}
          <div className="space-y-6">
            {/* Route */}
            <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
              <h3 className="font-semibold text-foreground mb-4">Route</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 transform hover:translate-x-2 transition-transform duration-300">
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Origin</p>
                    <p className="font-medium text-foreground">{shipment?.origin_location}</p>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-dashed border-muted h-8 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Truck className="w-4 h-4 text-accent animate-bounce" />
                  </div>
                </div>
                <div className="flex items-start gap-3 transform hover:translate-x-2 transition-transform duration-300">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Destination</p>
                    <p className="font-medium text-foreground">{shipment?.destination_location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sender Info */}
            {shipment?.sender_name && (
              <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Sender
                </h3>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">{shipment.sender_name}</p>
                  {shipment.sender_email && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      {shipment.sender_email}
                    </p>
                  )}
                  {shipment.sender_address && (
                    <p className="text-sm text-muted-foreground">{shipment.sender_address}</p>
                  )}
                  {shipment.sender_country && (
                    <p className="text-sm text-muted-foreground">{shipment.sender_country}</p>
                  )}
                </div>
              </div>
            )}

            {/* Recipient */}
            {shipment?.recipient_name && (
              <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Recipient
                </h3>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">{shipment.recipient_name}</p>
                  {shipment.recipient_email && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      {shipment.recipient_email}
                    </p>
                  )}
                  {shipment.recipient_address && (
                    <p className="text-sm text-muted-foreground">{shipment.recipient_address}</p>
                  )}
                  {shipment.recipient_country && (
                    <p className="text-sm text-muted-foreground">{shipment.recipient_country}</p>
                  )}
                </div>
              </div>
            )}

            {/* Package Details */}
            <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                Package Details
              </h3>
              <div className="space-y-3">
                {shipment?.package_description && (
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-sm text-foreground">{shipment.package_description}</p>
                    </div>
                  </div>
                )}
                {shipment?.weight_kg && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Weight className="w-4 h-4" />
                      Weight
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {shipment.weight_kg} kg
                    </span>
                  </div>
                )}
                {shipment?.package_value && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Value
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {shipment.currency} {shipment.package_value.toFixed(2)}
                    </span>
                  </div>
                )}
                {shipment?.shipping_fee && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Shipping Fee
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {shipment.currency} {shipment.shipping_fee.toFixed(2)}
                    </span>
                  </div>
                )}
                {shipment?.delivery_days && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Delivery Days
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {shipment.delivery_days} days
                    </span>
                  </div>
                )}
                {shipment?.created_at && (
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">Shipped On</span>
                    <span className="text-sm font-medium text-foreground">
                      {new Date(shipment.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img
              src={selectedImage}
              alt="Package"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes truck-move {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(calc(100vw + 100%)); }
        }
        .animate-truck-move {
          animation: truck-move 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TrackingPage;