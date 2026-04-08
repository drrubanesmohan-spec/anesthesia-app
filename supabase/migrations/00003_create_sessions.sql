CREATE TYPE public.session_type AS ENUM (
  'theatre',
  'icu',
  'tutorial',
  'simulation',
  'other'
);

CREATE TABLE public.sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  session_type    public.session_type NOT NULL DEFAULT 'theatre',
  location        TEXT,
  scheduled_date  DATE NOT NULL,
  start_time      TIME,
  end_time        TIME,
  supervisor_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes           TEXT,
  is_cancelled    BOOLEAN NOT NULL DEFAULT FALSE,
  created_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_date ON public.sessions(scheduled_date);
CREATE INDEX idx_sessions_supervisor ON public.sessions(supervisor_id);

CREATE TRIGGER sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
