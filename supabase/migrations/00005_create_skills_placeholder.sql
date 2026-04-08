-- Phase 2 placeholder
CREATE TYPE public.skill_level AS ENUM (
  'observed',
  'assisted',
  'performed_supervised',
  'independent'
);

CREATE TABLE public.skill_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_name    TEXT NOT NULL,
  skill_level   public.skill_level NOT NULL,
  session_id    UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  supervisor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes         TEXT,
  logged_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.skill_logs IS 'Phase 2 – not yet surfaced in the UI';
