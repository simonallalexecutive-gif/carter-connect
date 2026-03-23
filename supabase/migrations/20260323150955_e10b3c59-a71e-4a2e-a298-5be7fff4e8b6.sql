-- Table for admin-created candidate invitations
CREATE TABLE public.admin_candidate_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  submission_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  created_by uuid NOT NULL,
  claimed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_candidate_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage invites" ON public.admin_candidate_invites
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view invite by token" ON public.admin_candidate_invites
  FOR SELECT TO public
  USING (true);

-- Table for cabinet notification alerts
CREATE TABLE public.cabinet_notification_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cabinet_account_id uuid NOT NULL REFERENCES cabinet_accounts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  label text NOT NULL DEFAULT '',
  seniority_criteria text[] NOT NULL DEFAULT '{}',
  practice_criteria text[] NOT NULL DEFAULT '{}',
  origin_firms text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cabinet_notification_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own alerts" ON public.cabinet_notification_alerts
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_admin_candidate_invites_updated_at
  BEFORE UPDATE ON public.admin_candidate_invites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cabinet_notification_alerts_updated_at
  BEFORE UPDATE ON public.cabinet_notification_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();