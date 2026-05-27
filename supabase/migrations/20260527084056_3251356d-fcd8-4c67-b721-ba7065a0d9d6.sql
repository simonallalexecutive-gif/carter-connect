INSERT INTO public.candidate_registrations (user_id, submission_data, visibility, no_go_cabinets, status)
VALUES (
  'ccd9603e-6767-4474-8e99-522e9f99bd8a',
  '{"prenom":"David","nom":"Brami","email":"davbrami@gmail.com","telephone":"06.61.87.68.10","linkedinUrl":"https://www.linkedin.com/in/davbrami/","sermentMois":9,"sermentAnnee":2020,"cabinet":"De Pardieu Brocas Maffei","departement":"Restructuring/Insolvency","retrocession":"100.000","bonus":"10.000","statutEcoute":"actif","visibilite":"confidentiel"}'::jsonb,
  'confidentiel',
  '{}'::text[],
  'pending_email_verification'
)
ON CONFLICT DO NOTHING;