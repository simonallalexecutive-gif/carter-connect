import { useEffect, useMemo } from 'react';
import { useRegistrationStore } from '@/stores/registrationStore';
import Step6Review from '@/components/registration/Step6Review';


interface AdminProfilePreviewProps {
  submissionData: Record<string, any> | null;
}

/**
 * Renders a candidate's profile exactly as it appears at the final step
 * of registration (Step6Review), by hydrating the registration store
 * from the saved submission_data and then mounting Step6Review in
 * read-only "admin preview" mode.
 *
 * Snapshot/restore is used so the admin's own in-progress registration
 * (if any) is not overwritten.
 */
const AdminProfilePreview = ({ submissionData }: AdminProfilePreviewProps) => {
  const data = useMemo(() => submissionData || {}, [submissionData]);

  useEffect(() => {
    const store = useRegistrationStore.getState();
    // snapshot all field values (skip functions)
    const snapshot: Record<string, any> = {};
    Object.entries(store).forEach(([k, v]) => {
      if (typeof v !== 'function') snapshot[k] = v;
    });

    // hydrate from submission
    Object.entries(data).forEach(([k, v]) => {
      if (v === undefined) return;
      try {
        store.setField(k as any, v as any);
      } catch {
        /* ignore unknown keys */
      }
    });

    return () => {
      // restore previous state
      const s = useRegistrationStore.getState();
      Object.entries(snapshot).forEach(([k, v]) => {
        try {
          s.setField(k as any, v as any);
        } catch {
          /* ignore */
        }
      });
    };
  }, [data]);

  return <Step6Review adminPreview />;
};

export default AdminProfilePreview;
