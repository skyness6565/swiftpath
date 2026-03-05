-- Fix: recreate policies as truly PERMISSIVE

-- shipments
DROP POLICY IF EXISTS "Allow public select shipments" ON public.shipments;
DROP POLICY IF EXISTS "Allow public insert shipments" ON public.shipments;
DROP POLICY IF EXISTS "Allow public update shipments" ON public.shipments;
DROP POLICY IF EXISTS "Allow public delete shipments" ON public.shipments;

CREATE POLICY "Public select shipments" ON public.shipments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert shipments" ON public.shipments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update shipments" ON public.shipments FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Public delete shipments" ON public.shipments FOR DELETE TO anon, authenticated USING (true);

-- shipment_events
DROP POLICY IF EXISTS "Allow public select shipment_events" ON public.shipment_events;
DROP POLICY IF EXISTS "Allow public insert shipment_events" ON public.shipment_events;
DROP POLICY IF EXISTS "Allow public update shipment_events" ON public.shipment_events;
DROP POLICY IF EXISTS "Allow public delete shipment_events" ON public.shipment_events;

CREATE POLICY "Public select shipment_events" ON public.shipment_events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert shipment_events" ON public.shipment_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update shipment_events" ON public.shipment_events FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Public delete shipment_events" ON public.shipment_events FOR DELETE TO anon, authenticated USING (true);

-- quote_requests
DROP POLICY IF EXISTS "Allow public insert quote_requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow public select quote_requests" ON public.quote_requests;

CREATE POLICY "Public select quote_requests" ON public.quote_requests FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert quote_requests" ON public.quote_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update quote_requests" ON public.quote_requests FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Public delete quote_requests" ON public.quote_requests FOR DELETE TO anon, authenticated USING (true);