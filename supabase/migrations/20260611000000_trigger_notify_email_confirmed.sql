-- Enable pg_net for HTTP calls from Postgres triggers
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function called when a user confirms their email
CREATE OR REPLACE FUNCTION public.trigger_notify_email_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  -- Only fire when email_confirmed_at transitions from NULL → value
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    PERFORM net.http_post(
      url     := 'https://syfluylekcaxlncospig.supabase.co/functions/v1/notify-email-confirmed',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body    := json_build_object(
        'record', json_build_object(
          'id',                  NEW.id,
          'email',               NEW.email,
          'email_confirmed_at',  NEW.email_confirmed_at,
          'raw_user_meta_data',  NEW.raw_user_meta_data
        ),
        'old_record', json_build_object(
          'id',                  OLD.id,
          'email',               OLD.email,
          'email_confirmed_at',  OLD.email_confirmed_at,
          'raw_user_meta_data',  OLD.raw_user_meta_data
        )
      )::text::jsonb
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_email_confirmed ON auth.users;
CREATE TRIGGER on_email_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.trigger_notify_email_confirmed();
