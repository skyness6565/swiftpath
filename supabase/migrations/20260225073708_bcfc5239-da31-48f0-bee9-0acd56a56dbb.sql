
-- Drop all restrictive policies and recreate as permissive

-- shipments table
DROP POLICY IF EXISTS "Allow delete for admin operations" ON public.shipments;
DROP POLICY IF EXISTS "Allow insert for admin operations" ON public.shipments;
DROP POLICY IF EXISTS "Allow update for admin operations" ON public.shipments;
DROP POLICY IF EXISTS "Anyone can view shipments by tracking number" ON public.shipments;

CREATE POLICY "Allow public select shipments" ON public.shipments FOR SELECT USING (true);
CREATE POLICY "Allow public insert shipments" ON public.shipments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update shipments" ON public.shipments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete shipments" ON public.shipments FOR DELETE USING (true);

-- shipment_events table
DROP POLICY IF EXISTS "Allow delete shipment events" ON public.shipment_events;
DROP POLICY IF EXISTS "Allow insert shipment events" ON public.shipment_events;
DROP POLICY IF EXISTS "Allow update shipment events" ON public.shipment_events;
DROP POLICY IF EXISTS "Anyone can view shipment events" ON public.shipment_events;

CREATE POLICY "Allow public select shipment_events" ON public.shipment_events FOR SELECT USING (true);
CREATE POLICY "Allow public insert shipment_events" ON public.shipment_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update shipment_events" ON public.shipment_events FOR UPDATE USING (true);
CREATE POLICY "Allow public delete shipment_events" ON public.shipment_events FOR DELETE USING (true);

-- quote_requests table
DROP POLICY IF EXISTS "Anyone can submit quote requests" ON public.quote_requests;

CREATE POLICY "Allow public insert quote_requests" ON public.quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select quote_requests" ON public.quote_requests FOR SELECT USING (true);
