-- Tabla de entrenamientos recomendados
CREATE TABLE public.entrenamientos_recomendados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_entrenamiento TEXT NOT NULL,
  link_entrenamiento TEXT NOT NULL,
  area TEXT NOT NULL
);

-- Tabla de respuestas del diagnóstico
CREATE TABLE public.respuestas_diagnostico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  claridad_direccion NUMERIC NOT NULL,
  dominio_emocional NUMERIC NOT NULL,
  energia_enfoque NUMERIC NOT NULL,
  autoliderazgo NUMERIC NOT NULL,
  influencia_comunicacion NUMERIC NOT NULL,
  conexion_proposito NUMERIC NOT NULL,
  area_mas_baja TEXT NOT NULL,
  id_entrenamiento UUID,
  submission_id TEXT,
  fecha_respuesta TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en ambas tablas
ALTER TABLE public.entrenamientos_recomendados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respuestas_diagnostico ENABLE ROW LEVEL SECURITY;

-- Políticas para entrenamientos_recomendados
CREATE POLICY "Allow public read access to training recommendations" 
ON public.entrenamientos_recomendados 
FOR SELECT 
USING (true);

-- Políticas para respuestas_diagnostico
CREATE POLICY "Permitir leer respuestas de diagnóstico" 
ON public.respuestas_diagnostico 
FOR SELECT 
USING (true);

CREATE POLICY "Permitir insertar respuestas de diagnóstico" 
ON public.respuestas_diagnostico 
FOR INSERT 
WITH CHECK (true);

-- Insertar datos de entrenamientos
INSERT INTO public.entrenamientos_recomendados (nombre_entrenamiento, link_entrenamiento, area) VALUES
('Claridad en la Dirección', 'https://ejemplo.com/claridad', 'claridad_direccion'),
('Dominio Emocional', 'https://ejemplo.com/emocional', 'dominio_emocional'),
('Energía y Enfoque', 'https://ejemplo.com/energia', 'energia_enfoque'),
('Autoliderazgo', 'https://ejemplo.com/autoliderazgo', 'autoliderazgo'),
('Influencia y Comunicación', 'https://ejemplo.com/comunicacion', 'influencia_comunicacion'),
('Conexión con el Propósito', 'https://ejemplo.com/proposito', 'conexion_proposito');