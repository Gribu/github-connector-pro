-- Create foreign key constraint between respuestas_diagnostico and entrenamientos_recomendados
ALTER TABLE public.respuestas_diagnostico 
ADD CONSTRAINT fk_respuestas_diagnostico_entrenamiento 
FOREIGN KEY (id_entrenamiento) 
REFERENCES public.entrenamientos_recomendados(id);