CREATE TABLE public._probe (id uuid PRIMARY KEY DEFAULT gen_random_uuid());
GRANT ALL ON public._probe TO service_role;
ALTER TABLE public._probe ENABLE ROW LEVEL SECURITY;