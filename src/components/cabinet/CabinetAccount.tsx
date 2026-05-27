import { useState, useRef } from 'react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Pencil, Save, X, Camera, Trash2, Building2 } from 'lucide-react';
import { serializeCabinet } from '@/lib/cabinetSerializer';

const CabinetAccount = () => {
  const s = useCabinetStore();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image trop volumineuse (max 2 Mo)');
      return;
    }
    e.target.value = '';

    if (!user) {
      // Local preview fallback
      const reader = new FileReader();
      reader.onload = (ev) => s.setField('cabinetLogoUrl', ev.target?.result as string);
      reader.readAsDataURL(file);
      return;
    }

    try {
      const ext = file.name.split('.').pop() || 'png';
      const path = `${user.id}/logo-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('cabinet-files')
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;

      await supabase
        .from('cabinet_accounts')
        .update({ logo_url: path } as any)
        .eq('user_id', user.id);

      const { data: signed } = await supabase.storage
        .from('cabinet-files')
        .createSignedUrl(path, 60 * 60);
      if (signed?.signedUrl) s.setField('cabinetLogoUrl', signed.signedUrl);
      toast.success('Photo mise à jour');
    } catch (err: any) {
      toast.error(err.message || 'Échec de l\'upload');
    }
  };

  // Local state for editable fields
  const initialForm = {
    cabinetName: s.cabinetName || '',
    email: s.email || '',
    iban: (s as any).iban || '',
    bic: (s as any).bic || '',
    titulaire: (s as any).titulaire || '',
    creatorPrenom: s.contacts[0]?.prenom || '',
    creatorNom: s.contacts[0]?.nom || '',
    creatorEmail: s.contacts[0]?.email || '',
    creatorMobile: s.contacts[0]?.mobile || '',
    creatorRole: s.contacts[0]?.role || 'Administrateur du compte',
    refPrenom: s.contacts[1]?.prenom || '',
    refNom: s.contacts[1]?.nom || '',
    refEmail: s.contacts[1]?.email || '',
    refMobile: s.contacts[1]?.mobile || '',
    refRole: s.contacts[1]?.role || 'Référent plateforme',
  };
  const [form, setForm] = useState(initialForm);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      s.setField('cabinetName', form.cabinetName);
      s.setField('email', form.email);
      const newContacts = [
        { prenom: form.creatorPrenom, nom: form.creatorNom, email: form.creatorEmail, mobile: form.creatorMobile, role: form.creatorRole },
        { prenom: form.refPrenom, nom: form.refNom, email: form.refEmail, mobile: form.refMobile, role: form.refRole },
      ];
      s.setField('contacts', newContacts);

      if (user) {
        const submissionData = {
          ...serializeCabinet({ ...s, cabinetName: form.cabinetName, email: form.email }),
          iban: form.iban,
          bic: form.bic,
          titulaire: form.titulaire,
        };
        const { error } = await supabase
          .from('cabinet_accounts')
          .update({
            cabinet_name: form.cabinetName,
            contacts: newContacts as any,
            submission_data: submissionData as any,
          } as any)
          .eq('user_id', user.id);
        if (error) throw error;
      }

      setEditing(false);
      toast.success('Informations mises à jour avec succès');
    } catch (err: any) {
      toast.error(err.message || 'Échec de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8">
      <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-4 flex items-center gap-2">
        <span className="w-4 h-[1.5px] bg-foreground rounded-sm" />
        {title}
      </div>
      {children}
    </div>
  );

  const Field = ({ label, value, fieldKey }: { label: string; value: string; fieldKey: string }) => (
    <div>
      <label className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground block mb-1.5">{label}</label>
      {editing ? (
        <Input
          value={form[fieldKey as keyof typeof form] || ''}
          onChange={(e) => handleChange(fieldKey, e.target.value)}
          className="bg-background text-sm"
        />
      ) : (
        <p className="text-sm font-sans text-foreground">{value || '—'}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-sans text-2xl font-normal text-foreground leading-tight">Mon compte</h2>
          <p className="text-xs text-muted-foreground mt-1">Gérez les informations de votre cabinet et les contacts associés.</p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditing(false)} className="text-[11px]" disabled={saving}>
              <X className="w-3.5 h-3.5 mr-1" /> Annuler
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-foreground text-background text-[11px]" disabled={saving}>
              <Save className="w-3.5 h-3.5 mr-1" /> {saving ? 'Sauvegarde…' : 'Enregistrer'}
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="text-[11px]">
            <Pencil className="w-3.5 h-3.5 mr-1" /> Modifier
          </Button>
        )}
      </div>

      <Section title="Informations du cabinet">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-border">
          <Avatar className="w-20 h-20 border border-border">
            {s.cabinetLogoUrl ? (
              <AvatarImage src={s.cabinetLogoUrl} alt={form.cabinetName || 'Logo cabinet'} className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-secondary text-foreground text-base font-sans">
              {form.cabinetName ? form.cabinetName[0].toUpperCase() : <Building2 className="w-6 h-6" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-2">
              Photo / logo du cabinet
            </div>
            <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
              Format JPG ou PNG, 2 Mo maximum. Affichée dans votre espace.
            </p>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <Button
                variant="outline"
                size="sm"
                className="text-[11px]"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-3.5 h-3.5 mr-1.5" />
                {s.cabinetLogoUrl ? 'Remplacer' : 'Ajouter une photo'}
              </Button>
              {s.cabinetLogoUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                  onClick={async () => {
                    s.setField('cabinetLogoUrl', '');
                    if (user) {
                      await supabase
                        .from('cabinet_accounts')
                        .update({ logo_url: null } as any)
                        .eq('user_id', user.id);
                    }
                    toast.success('Photo supprimée');
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Supprimer
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Nom du cabinet" value={form.cabinetName} fieldKey="cabinetName" />
          <Field label="Email du cabinet" value={form.email} fieldKey="email" />
        </div>
        <div className="mt-4">
          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground block mb-1.5">Abonnement</div>
          <p className="text-sm font-sans text-foreground">
            {s.palier ? `${s.palier.charAt(0).toUpperCase() + s.palier.slice(1)} — Actif` : 'Aucun abonnement'}
          </p>
        </div>
      </Section>

      <Section title="Coordonnées bancaires (RIB)">
        <div className="grid grid-cols-2 gap-4">
          <Field label="IBAN" value={form.iban} fieldKey="iban" />
          <Field label="BIC / SWIFT" value={form.bic} fieldKey="bic" />
          <Field label="Titulaire du compte" value={form.titulaire} fieldKey="titulaire" />
        </div>
      </Section>

      <Section title="Personne à l'origine du compte">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Prénom" value={form.creatorPrenom} fieldKey="creatorPrenom" />
          <Field label="Nom" value={form.creatorNom} fieldKey="creatorNom" />
          <Field label="Email" value={form.creatorEmail} fieldKey="creatorEmail" />
          <Field label="Téléphone" value={form.creatorMobile} fieldKey="creatorMobile" />
          <Field label="Rôle" value={form.creatorRole} fieldKey="creatorRole" />
        </div>
      </Section>

      <Section title="Référent plateforme">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Prénom" value={form.refPrenom} fieldKey="refPrenom" />
          <Field label="Nom" value={form.refNom} fieldKey="refNom" />
          <Field label="Email" value={form.refEmail} fieldKey="refEmail" />
          <Field label="Téléphone" value={form.refMobile} fieldKey="refMobile" />
          <Field label="Rôle" value={form.refRole} fieldKey="refRole" />
        </div>
      </Section>
    </div>
  );
};

export default CabinetAccount;
