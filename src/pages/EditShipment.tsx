import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Package, Save, Plus, Trash2, MapPin, Clock, Upload, X, ImageIcon, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";
import { supabase } from "@/integrations/supabase/client";

interface ShipmentEvent {
  id?: string;
  title: string;
  location: string;
  event_date: string;
  completed: boolean;
}

const statusOptions = [
  { value: "processing", label: "Processing" },
  { value: "picked-up", label: "Picked Up" },
  { value: "in-transit", label: "In Transit" },
  { value: "at-sorting-center", label: "At Sorting Center" },
  { value: "customs-clearance", label: "Customs Clearance" },
  { value: "out-for-delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const currencies = [
  "USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY", "INR", "BRL", "MXN",
  "KRW", "SGD", "HKD", "NOK", "SEK", "DKK", "NZD", "ZAR", "CHF", "TRY",
  "RUB", "PLN", "THB", "IDR", "MYR", "PHP", "CZK", "HUF", "ILS", "CLP",
  "TWD", "ARS", "COP", "PEN", "SAR", "AED", "QAR", "KWD", "BHD", "OMR",
  "EGP", "NGN", "KES", "GHS", "UGX", "TZS", "MAD", "DZD", "PKR", "BDT",
  "LKR", "VND", "MMK", "UAH", "RON", "BGN", "HRK", "ISK", "GEL", "AMD",
  "JOD", "LBP", "IQD", "XOF", "XAF", "XCD", "FJD", "PGK", "WST", "TOP",
  "BWP", "MZN", "ZMW", "ETB", "RWF", "UZS", "KZT", "AZN", "TMT", "GEL",
  "MDL", "ALL", "MKD", "RSD", "BAM", "GTQ", "HNL", "NIO", "CRC", "PAB",
  "DOP", "JMD", "TTD", "BBD", "BZD", "GYD", "SRD", "HTG", "CUP", "BOB",
  "PYG", "UYU", "VES", "AWG", "ANG", "BMD", "KYD", "BSD", "XPF", "MVR",
  "NPR", "BND", "LAK", "KHR", "MNT", "KPW", "IRR", "AFN", "SYP", "YER",
  "TND", "LYD", "SDG", "SOS", "DJF", "KMF", "SCR", "MUR", "MGA", "MWK",
  "LSL", "SZL", "NAD", "ERN", "GMD", "SLL", "GNF", "LRD", "CVE", "STN",
  "BIF", "CDF", "AOA", "SBD", "VUV", "TVD", "KID"
];

const EditShipment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAdmin();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [packageImages, setPackageImages] = useState<string[]>([]);

  const [shipment, setShipment] = useState({
    tracking_number: "",
    status: "processing",
    sender_name: "",
    sender_email: "",
    sender_address: "",
    sender_country: "",
    recipient_name: "",
    recipient_email: "",
    recipient_address: "",
    recipient_country: "",
    origin_location: "",
    destination_location: "",
    current_location: "",
    package_value: "",
    package_description: "",
    weight_kg: "",
    shipping_fee: "",
    currency: "USD",
    delivery_days: "",
    service_type: "standard",
    estimated_delivery: "",
    customs_hold: false,
  });

  const [events, setEvents] = useState<ShipmentEvent[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/auth");
      return;
    }
    if (id) {
      fetchShipment();
    }
  }, [id, isAuthenticated, navigate]);

  const fetchShipment = async () => {
    setIsLoading(true);

    const { data: shipmentData, error: shipmentError } = await supabase
      .from("shipments")
      .select("*")
      .eq("id", id)
      .single();

    if (shipmentError) {
      toast.error("Failed to fetch shipment");
      navigate("/admin/dashboard");
      return;
    }

    setShipment({
      tracking_number: shipmentData.tracking_number,
      status: shipmentData.status,
      sender_name: shipmentData.sender_name || "",
      sender_email: shipmentData.sender_email || "",
      sender_address: shipmentData.sender_address || "",
      sender_country: shipmentData.sender_country || "",
      recipient_name: shipmentData.recipient_name || "",
      recipient_email: shipmentData.recipient_email || "",
      recipient_address: shipmentData.recipient_address || "",
      recipient_country: shipmentData.recipient_country || "",
      origin_location: shipmentData.origin_location,
      destination_location: shipmentData.destination_location,
      current_location: shipmentData.current_location || "",
      package_value: shipmentData.package_value?.toString() || "",
      package_description: shipmentData.package_description || "",
      weight_kg: shipmentData.weight_kg?.toString() || "",
      shipping_fee: shipmentData.shipping_fee?.toString() || "",
      currency: shipmentData.currency || "USD",
      delivery_days: shipmentData.delivery_days?.toString() || "",
      service_type: shipmentData.service_type,
      estimated_delivery: shipmentData.estimated_delivery || "",
      customs_hold: shipmentData.customs_hold || false,
    });

    setPackageImages(shipmentData.package_images || []);

    // Fetch events
    const { data: eventsData } = await supabase
      .from("shipment_events")
      .select("*")
      .eq("shipment_id", id)
      .order("event_date", { ascending: true });

    setEvents(
      eventsData?.map((e) => ({
        id: e.id,
        title: e.title,
        location: e.location,
        event_date: e.event_date,
        completed: e.completed,
      })) || []
    );

    setIsLoading(false);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setShipment((prev) => ({ ...prev, [field]: value }));
  };

  const handleEventChange = (index: number, field: string, value: string | boolean) => {
    setEvents((prev) =>
      prev.map((event, i) => (i === index ? { ...event, [field]: value } : event))
    );
  };

  const addEvent = () => {
    setEvents((prev) => [
      ...prev,
      {
        title: "",
        location: "",
        event_date: new Date().toISOString(),
        completed: false,
      },
    ]);
  };

  const removeEvent = async (index: number) => {
    const event = events[index];
    if (event.id) {
      await supabase.from("shipment_events").delete().eq("id", event.id);
    }
    setEvents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `packages/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('package-images')
        .upload(filePath, file);

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('package-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    setPackageImages((prev) => [...prev, ...uploadedUrls]);
    setUploadingImages(false);
    
    if (uploadedUrls.length > 0) {
      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    }
  };

  const removeImage = (index: number) => {
    setPackageImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Update shipment
    const { error: shipmentError } = await supabase
      .from("shipments")
      .update({
        status: shipment.status,
        sender_name: shipment.sender_name || null,
        sender_email: shipment.sender_email || null,
        sender_address: shipment.sender_address || null,
        sender_country: shipment.sender_country || null,
        recipient_name: shipment.recipient_name || null,
        recipient_email: shipment.recipient_email || null,
        recipient_address: shipment.recipient_address || null,
        recipient_country: shipment.recipient_country || null,
        origin_location: shipment.origin_location,
        destination_location: shipment.destination_location,
        current_location: shipment.current_location || null,
        package_value: shipment.package_value ? parseFloat(shipment.package_value) : null,
        package_description: shipment.package_description || null,
        weight_kg: shipment.weight_kg ? parseFloat(shipment.weight_kg) : null,
        shipping_fee: shipment.shipping_fee ? parseFloat(shipment.shipping_fee) : null,
        currency: shipment.currency,
        delivery_days: shipment.delivery_days ? parseInt(shipment.delivery_days) : null,
        service_type: shipment.service_type,
        estimated_delivery: shipment.estimated_delivery || null,
        customs_hold: shipment.customs_hold,
        package_images: packageImages.length > 0 ? packageImages : null,
      })
      .eq("id", id);

    if (shipmentError) {
      toast.error("Failed to update shipment");
      setIsSaving(false);
      return;
    }

    // Update/create events
    for (const event of events) {
      if (!event.title || !event.location) continue;

      if (event.id) {
        await supabase
          .from("shipment_events")
          .update({
            title: event.title,
            location: event.location,
            event_date: event.event_date,
            completed: event.completed,
          })
          .eq("id", event.id);
      } else {
        await supabase.from("shipment_events").insert({
          shipment_id: id,
          title: event.title,
          location: event.location,
          event_date: event.event_date,
          completed: event.completed,
        });
      }
    }

    toast.success("Shipment updated successfully!");
    setIsSaving(false);
    navigate("/admin/dashboard");
  };

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <span className="font-mono text-sm text-muted-foreground">
              {shipment.tracking_number}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Edit Shipment
          </h1>
          <p className="text-muted-foreground mt-1">Update shipment details and tracking events</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Status & Location */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Status & Location</CardTitle>
                  <CardDescription>Current shipment status and location</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={shipment.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Current Location</Label>
                <Input
                  value={shipment.current_location}
                  onChange={(e) => handleChange("current_location", e.target.value)}
                  placeholder="e.g., Distribution Center, LA"
                />
              </div>
              <div className="space-y-2">
                <Label>Origin</Label>
                <Input
                  value={shipment.origin_location}
                  onChange={(e) => handleChange("origin_location", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Destination</Label>
                <Input
                  value={shipment.destination_location}
                  onChange={(e) => handleChange("destination_location", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Estimated Delivery</Label>
                <Input
                  type="date"
                  value={shipment.estimated_delivery}
                  onChange={(e) => handleChange("estimated_delivery", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Customs Hold Toggle */}
          <Card className="bg-card border-border border-red-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Customs Settings</CardTitle>
                  <CardDescription>Enable customs hold warning</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Customs Hold</p>
                  <p className="text-sm text-muted-foreground">
                    When enabled, displays a warning that the package has been seized by customs
                  </p>
                </div>
                <Switch
                  checked={shipment.customs_hold}
                  onCheckedChange={(checked) => handleChange("customs_hold", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tracking Events */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Tracking Events</CardTitle>
                    <CardDescription>Shipment journey milestones</CardDescription>
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addEvent}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tracking events yet. Add events to show shipment progress.
                </p>
              ) : (
                events.map((event, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-4 p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="flex-1 grid md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs">Event Title</Label>
                        <Input
                          value={event.title}
                          onChange={(e) => handleEventChange(index, "title", e.target.value)}
                          placeholder="e.g., Package Picked Up"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Location</Label>
                        <Input
                          value={event.location}
                          onChange={(e) => handleEventChange(index, "location", e.target.value)}
                          placeholder="e.g., Shanghai, China"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Date & Time</Label>
                        <Input
                          type="datetime-local"
                          value={event.event_date.slice(0, 16)}
                          onChange={(e) =>
                            handleEventChange(index, "event_date", new Date(e.target.value).toISOString())
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={event.completed ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleEventChange(index, "completed", !event.completed)}
                      >
                        {event.completed ? "Completed" : "Pending"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeEvent(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Package Images */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Package Images</CardTitle>
                  <CardDescription>Upload photos or videos of the package</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="package-images"
                    disabled={uploadingImages}
                  />
                  <label htmlFor="package-images" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      {uploadingImages ? (
                        <>
                          <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-3" />
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                          <p className="text-sm font-medium text-foreground">
                            Click to upload images or videos
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, GIF, MP4 up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {/* Image Preview */}
                {packageImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {packageImages.map((image, index) => (
                      <div key={index} className="relative aspect-square group">
                        <img
                          src={image}
                          alt={`Package ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Package Details */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Package Details</CardTitle>
                  <CardDescription>Package and pricing information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={shipment.package_description}
                  onChange={(e) => handleChange("package_description", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={shipment.weight_kg}
                  onChange={(e) => handleChange("weight_kg", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Package Value</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={shipment.package_value}
                  onChange={(e) => handleChange("package_value", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Shipping Fee</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={shipment.shipping_fee}
                  onChange={(e) => handleChange("shipping_fee", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={shipment.currency}
                  onValueChange={(value) => handleChange("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Select
                  value={shipment.service_type}
                  onValueChange={(value) => handleChange("service_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="overnight">Overnight</SelectItem>
                    <SelectItem value="freight">Freight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/admin/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1" disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditShipment;