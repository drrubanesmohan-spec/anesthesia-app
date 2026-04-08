-- ============================================================
-- Row Level Security
-- ============================================================

-- ---- profiles ----
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_select_privileged"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('supervisor', 'admin')
    )
  );

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND (
      role = (SELECT role FROM public.profiles WHERE id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );

CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ---- sessions ----
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions_select_authenticated"
  ON public.sessions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "sessions_insert_supervisor"
  ON public.sessions FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('supervisor', 'admin'))
  );

CREATE POLICY "sessions_all_admin"
  ON public.sessions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "sessions_update_own_supervisor"
  ON public.sessions FOR UPDATE
  USING (supervisor_id = auth.uid())
  WITH CHECK (supervisor_id = auth.uid());

-- ---- attendance ----
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attendance_select_own_resident"
  ON public.attendance FOR SELECT
  USING (resident_id = auth.uid());

CREATE POLICY "attendance_select_supervisor"
  ON public.attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions s
      WHERE s.id = attendance.session_id
        AND s.supervisor_id = auth.uid()
    )
  );

CREATE POLICY "attendance_select_admin"
  ON public.attendance FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "attendance_insert_supervisor"
  ON public.attendance FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sessions s
      WHERE s.id = attendance.session_id
        AND s.supervisor_id = auth.uid()
    )
  );

CREATE POLICY "attendance_update_supervisor"
  ON public.attendance FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions s
      WHERE s.id = attendance.session_id
        AND s.supervisor_id = auth.uid()
    )
  );

CREATE POLICY "attendance_all_admin"
  ON public.attendance FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ---- skill_logs: RLS enabled, no policies yet (Phase 2) ----
ALTER TABLE public.skill_logs ENABLE ROW LEVEL SECURITY;
