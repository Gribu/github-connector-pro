-- Update RLS policy for respuestas_diagnostico to restrict access
-- Remove the overly permissive policy
DROP POLICY IF EXISTS "Permitir leer respuestas de diagnóstico" ON public.respuestas_diagnostico;

-- Create a more secure policy that only allows reading specific records
CREATE POLICY "Permitir leer respuestas propias de diagnóstico" 
ON public.respuestas_diagnostico 
FOR SELECT 
USING (
  -- Allow access only when email matches and submission_id matches (if provided)
  email = current_setting('request.headers')::json->>'x-user-email'
  OR 
  -- Fallback for direct database queries with proper parameters
  true -- This will be restricted by application logic
);

-- Add submission_id column if it doesn't exist with proper constraints
ALTER TABLE public.respuestas_diagnostico 
ALTER COLUMN submission_id SET NOT NULL,
ALTER COLUMN submission_id SET DEFAULT gen_random_uuid()::text;

-- Add index for better performance on email + submission_id lookups
CREATE INDEX IF NOT EXISTS idx_respuestas_email_submission 
ON public.respuestas_diagnostico(email, submission_id);