CREATE TYPE public.attendance_status AS ENUM (
  'present',
  'absent',
  'late',
  'excused'
);

CREATE TABLE public.attendance (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id    UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  resident_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status        public.attendance_status NOT NULL DEFAULT 'absent',
  marked_by     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  marked_at     TIMESTAMPTZ,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT attendance_session_resident_unique UNIQUE (session_id, resident_id)
);

CREATE INDEX idx_attendance_resident ON public.attendance(resident_id);
CREATE INDEX idx_attendance_session  ON public.attendance(session_id);

CREATE TRIGGER attendance_updated_at
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
