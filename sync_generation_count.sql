-- Add research_generations_count column to forms table if it doesn't exist
ALTER TABLE public.forms 
ADD COLUMN IF NOT EXISTS research_generations_count INTEGER DEFAULT 0;

-- Function to atomically increment research_generations_count
CREATE OR REPLACE FUNCTION increment_research_generations(form_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.forms
  SET research_generations_count = research_generations_count + 1
  WHERE id = form_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
