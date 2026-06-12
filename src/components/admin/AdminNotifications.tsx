import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Phone, Mail, ExternalLink, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DEPT_KEY_MAP, FIRMS_DB } from '@/lib/cabinetConstants';

type InterestRow = {
  id: string;
  created_at: string;
  status: string;
  logan_validated: boolean;
  // Cabinet
  cabinet_name: string;
  cabinet_email: string;
  contact_prenom: string;
  contact_nom: string;
  contact_role: string;
  contact_tel: string;
  // Candidate
  candidate_prenom: string;
  candidate_nom: string;
  candidate_dept: string;
  candidate_cabinet: string;
  candidate_seniority: string;
  candidate_tel: string;
  candidate_email: string;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const AdminNotifications = () => {
  const [rows, setRows] = useState<InterestRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    // Fetch all interests with cabinet + candidate data
    const { data, error } = await supabase
      .from('cabinet_candidate_interests')
      .select(`
        id, created_at, status, logan_validated,
        cabinet_accounts!cabinet_account_id (
          cabinet_name, submission_data
        ),
        candidate_registrations!candidate_user_id (
          submission_data
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('AdminNotifications error:', error);
      setLoading(false);
      return;
    }

    const mapped: InterestRow[] = (data || []).map((row: any) => {
      const cab = row.cabinet_accounts || {};
      const cabSub = cab.submission_data || {};
      const contacts = Array.isArray(cabSub.contacts) ? cabSub.contacts[0] || {} : {};

      const cand = row.candidate_registrations || {};
      const candSub = cand.submission_data || {};
      const pqeYears = (() => {
        if (!candSub.sermentMois || !candSub.sermentAnnee) return 0;
        const now = new Date();
        return now.getFullYear() - candSub.sermentAnnee + (now.getMonth() + 1 < candSub.sermentMois ? -1 : 0);
      })();
      const pqeLabel = pqeYears <= 2 ? 'Junior' : pqeYears <= 5 ? 'Mid Level' : pqeYears <= 8 ? 'Senior' : candSub.statutAssoc === 'associe' ? 'Associé' : 'Senior';

      return {
        id: row.id,
        created_at: row.created_at,
        status: row.status,
        logan_validated: row.logan_validated,
        // Cabinet
        cabinet_name: cab.cabinet_name || '—',
        cabinet_email: cabSub.contacts?.[0]?.email || '—',
        contact_prenom: contacts.prenom || '',
        contact_nom: contacts.nom || '',
        contact_role: contacts.role || '—',
        contact_tel: contacts.mobile || contacts.tel || '—',
        // Candidate
        candidate_prenom: candSub.prenom || '',
        candidate_nom: candSub.nom || '',
        candidate_dept: candSub.departement || '—',
        candidate_cabinet: candSub.cabinet || '—',
        candidate_seniority: pqeLabel,
        candidate_tel: candSub.telephone || '—',
        candidate_email: candSub.email || '—',
      };
    });

    setRows(mapped);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleValidate = async (id: string, validated: boolean) => {
    await supabase
      .from('cabinet_candidate_interests')
      .update({ logan_validated: validated, status: validated ? 'validated' : 'pending' })
      .eq('id', id);
    await load();
  };

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-normal text-foreground mb-1">Notifications</h1>
          <p className="text-xs text-muted-foreground">
            Intérêts manifestés par les cabinets pour des profils candidats
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="text-xs">
          <RefreshCcw className={cn('w-3.5 h-3.5 mr-1.5', loading && 'animate-spin')} />
          Actualiser
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Chargement…
        </div>
      ) : rows.length === 0 ? (
        <div className="py-20 text-center text-sm text-muted-foreground">Aucune notification pour l'instant.</div>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => (
            <div
              key={row.id}
              className={cn(
                'rounded-lg border overflow-hidden',
                row.logan_validated ? 'border-green-200 bg-green-50/30' : 'border-border bg-background'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 bg-[hsl(0,0%,9%)]">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/60">Intérêt cabinet</span>
                  {row.logan_validated && (
                    <span className="text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-sm bg-green-400/20 text-green-300 border border-green-400/20">
                      Traité
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-sans text-white/40">{formatDate(row.created_at)}</span>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">

                {/* Cabinet */}
                <div className="px-6 py-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground mb-3">Cabinet</p>
                  <p className="text-[15px] font-sans font-semibold text-foreground mb-3">
                    {row.cabinet_name}
                  </p>
                  <div className="space-y-2">
                    {(row.contact_prenom || row.contact_nom) && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-16">Contact</span>
                        <span className="text-[11px] font-medium text-foreground">
                          {row.contact_prenom} {row.contact_nom}
                          {row.contact_role && row.contact_role !== '—' && (
                            <span className="text-muted-foreground font-normal"> · {row.contact_role}</span>
                          )}
                        </span>
                      </div>
                    )}
                    {row.contact_tel && row.contact_tel !== '—' && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-16">Mobile</span>
                        <a href={`tel:${row.contact_tel}`} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground hover:text-muted-foreground transition-colors">
                          <Phone className="w-3 h-3" />
                          {row.contact_tel}
                        </a>
                      </div>
                    )}
                    {row.cabinet_email && row.cabinet_email !== '—' && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-16">Email</span>
                        <a href={`mailto:${row.cabinet_email}`} className="inline-flex items-center gap-1.5 text-[11px] text-foreground hover:text-muted-foreground transition-colors">
                          <Mail className="w-3 h-3" />
                          {row.cabinet_email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Candidate */}
                <div className="px-6 py-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground mb-3">Candidat</p>
                  {(row.candidate_prenom || row.candidate_nom) ? (
                    <p className="text-[15px] font-sans font-semibold text-foreground mb-3">
                      {row.candidate_prenom} {row.candidate_nom}
                    </p>
                  ) : (
                    <p className="text-[15px] font-sans font-semibold text-foreground mb-3">Profil anonyme</p>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-16">Pratique</span>
                      <span className="text-[11px] font-medium text-foreground">{row.candidate_dept}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-16">Cabinet</span>
                      <span className="text-[11px] font-medium text-foreground">{row.candidate_cabinet}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-16">Séniorité</span>
                      <span className="text-[11px] font-medium text-foreground">{row.candidate_seniority}</span>
                    </div>
                    {row.candidate_tel && row.candidate_tel !== '—' && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-16">Mobile</span>
                        <a href={`tel:${row.candidate_tel}`} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground hover:text-muted-foreground transition-colors">
                          <Phone className="w-3 h-3" />
                          {row.candidate_tel}
                        </a>
                      </div>
                    )}
                    {row.candidate_email && row.candidate_email !== '—' && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-16">Email</span>
                        <a href={`mailto:${row.candidate_email}`} className="inline-flex items-center gap-1.5 text-[11px] text-foreground hover:text-muted-foreground transition-colors">
                          <Mail className="w-3 h-3" />
                          {row.candidate_email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-card/50">
                {!row.logan_validated ? (
                  <button
                    onClick={() => handleValidate(row.id, true)}
                    className="text-[10px] font-semibold font-sans px-3 py-1.5 rounded-sm bg-foreground text-background hover:bg-foreground/80 transition-colors"
                  >
                    Marquer comme traité
                  </button>
                ) : (
                  <button
                    onClick={() => handleValidate(row.id, false)}
                    className="text-[10px] font-sans text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Marquer comme non traité
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
