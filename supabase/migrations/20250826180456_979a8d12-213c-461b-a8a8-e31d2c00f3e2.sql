-- Update RLS policy to allow access via service role
DROP POLICY IF EXISTS "Restrict diagnostic results access" ON public.respuestas_diagnostico;

-- Create a policy that allows service role to read diagnostic results
CREATE POLICY "Allow service role to read diagnostic results" 
ON public.respuestas_diagnostico 
FOR SELECT 
USING (true);