-- Fix the RLS policy to be more restrictive
DROP POLICY IF EXISTS "Permitir leer respuestas propias de diagnóstico" ON public.respuestas_diagnostico;

-- Create a secure policy that prevents unauthorized access
-- This will be used with application-level filtering for security
CREATE POLICY "Restrict diagnostic results access" 
ON public.respuestas_diagnostico 
FOR SELECT 
USING (false); -- Deny all direct access by default

-- Enable RLS to ensure the policy is enforced
ALTER TABLE public.respuestas_diagnostico ENABLE ROW LEVEL SECURITY;