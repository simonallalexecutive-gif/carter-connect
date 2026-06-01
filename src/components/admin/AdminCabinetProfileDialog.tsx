import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Mail, Users, Search, FileText, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CabinetRow {
  id: string;
  user_id: string;
  cabinet_name: string;
  is_verified: boolean;
  logo_url: string | null;
  palier: string | null;
  submission_data: any;
  searches: any;
  contacts: any;
  created_at: string;
  auth_email: string | null;
  full_name: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cabinet: CabinetRow | null;
}

const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <section className="bg-white border border-black/10 rounded-sm p-5">
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-black/10">
      <Icon className="w-3.5 h-3.5 text-black" />
      <h3 className="text-[10px] font-bold tracking-[0.16em] uppercase text-black">{title}</h3>
    </div>
    <div className="text-[13px] text-black space-y-2">{children}</div>
  </section>
);

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-[160px_1fr] gap-3 py-1.5 border-b border-black/5 last:border-0">
    <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-black/55">{label}</div>
    <div className="text-[13px] text-black">{value || <span className="text-black/40">—</span>}</div>
  </div>
);

const AdminCabinetProfileDialog = ({ open, onOpenChange, cabinet }: Props) => {
  const [logoUrl, setLogoUrl] = useState<string>('');

  useEffect(() => {
    if (!open || !cabinet) { setLogoUrl(''); return; }
    const raw = cabinet.logo_url || '';
    if (!raw) { setLogoUrl(''); return; }
    if (raw.startsWith('http') || raw.startsWith('data:')) { setLogoUrl(raw); return; }
    (async () => {
      const { data } = await supabase.storage.from('cabinet-files').createSignedUrl(raw, 60 * 30);
      if (data?.signedUrl) setLogoUrl(data.signedUrl);
    })();
  }, [open, cabinet]);

  if (!cabinet) return null;
  const data = cabinet.submission_data || {};
  const contacts = Array.isArray(cabinet.contacts) ? cabinet.contacts : [];
  const searches = Array.isArray(cabinet.searches) ? cabinet.searches : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[92vh] p-0 overflow-hidden flex flex-col gap-0 bg-white text-black border border-black/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 bg-white">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="w-10 h-10 object-contain rounded-sm border border-black/10 bg-white" />
            ) : (
              <div className="w-10 h-10 rounded-sm bg-black/5 border border-black/10 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-black/50" />
              </div>
            )}
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-black/60 font-semibold">Fiche cabinet</p>
              <h2 className="text-base font-serif text-black mt-0.5">{cabinet.cabinet_name || '—'}</h2>
            </div>
          </div>
          <span className={cn(
            'text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-sm',
            cabinet.is_verified ? 'bg-black text-white' : 'bg-black/5 text-black border border-black/15'
          )}>
            {cabinet.is_verified ? 'Email vérifié' : 'Email non vérifié'}
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-6 space-y-5">
          <Section title="Identité du cabinet" icon={Building2}>
            <Field label="Nom" value={cabinet.cabinet_name} />
            <Field label="Cabinet sélectionné" value={data.selectedFirm} />
            <Field label="Nationalité" value={data.detectedNat} />
            <Field
              label="Rankings Chambers"
              value={Array.isArray(data.detectedRankings) && data.detectedRankings.length
                ? data.detectedRankings.map((r: any) => `${r.label} — Band ${r.tier}`).join(' · ')
                : null}
            />
          </Section>

          <Section title="Compte" icon={Mail}>
            <Field label="Email principal" value={cabinet.auth_email} />
            <Field label="Nom du référent" value={cabinet.full_name} />
            <Field label="Inscrit le" value={new Date(cabinet.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} />
          </Section>

          <Section title="Abonnement" icon={Shield}>
            <Field label="Palier" value={cabinet.palier ? cabinet.palier.toUpperCase() : null} />
          </Section>

          <Section title={`Référents (${contacts.length})`} icon={Users}>
            {contacts.length === 0 ? (
              <p className="text-[12px] text-black/50">Aucun référent renseigné.</p>
            ) : (
              <div className="space-y-3">
                {contacts.map((c: any, i: number) => (
                  <div key={i} className="p-3 border border-black/10 rounded-sm bg-black/[0.02]">
                    <div className="text-[12px] font-semibold text-black">
                      {[c.prenom, c.nom].filter(Boolean).join(' ') || '—'}
                      {c.role && <span className="ml-2 text-[10px] font-normal text-black/60 uppercase tracking-[0.1em]">{c.role}</span>}
                    </div>
                    <div className="text-[11px] text-black/70 mt-1">{c.email || '—'}{c.mobile ? ` · ${c.mobile}` : ''}</div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title={`Recherches publiées (${searches.length})`} icon={Search}>
            {searches.length === 0 ? (
              <p className="text-[12px] text-black/50">Aucune recherche publiée pour le moment.</p>
            ) : (
              <div className="space-y-2">
                {searches.map((s: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-black/10 rounded-sm bg-black/[0.02]">
                    <div>
                      <div className="text-[12px] font-semibold text-black flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        {s.deptLabel || s.deptKey || 'Recherche'}
                      </div>
                      {Array.isArray(s.seniorities) && s.seniorities.length > 0 && (
                        <div className="text-[10px] text-black/60 mt-1 uppercase tracking-[0.08em]">
                          {s.seniorities.join(' · ')}
                        </div>
                      )}
                    </div>
                    <span className={cn(
                      'text-[9px] font-bold tracking-[0.08em] uppercase px-2 py-0.5 rounded-sm',
                      s.status === 'active' ? 'bg-black text-white' : 'bg-black/5 text-black border border-black/15'
                    )}>
                      {s.status || '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-black/10 bg-white">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-sm text-xs bg-white text-black border-black/20 hover:bg-black/5">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCabinetProfileDialog;
