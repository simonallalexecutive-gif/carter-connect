import { Link } from 'react-router-dom';
import { UserPlus, Building2, ArrowRight } from 'lucide-react';

const AdminInscrireChooser = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-foreground">Inscrire</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choisissez le type de profil à inscrire. Vous suivrez le même questionnaire que celui présenté à l'utilisateur lors de son inscription.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
        <Link
          to="/admin/inscrire/candidat"
          className="group bg-background border border-border rounded-lg p-7 hover:border-foreground/40 hover:shadow-lg transition-all"
        >
          <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center mb-5 group-hover:bg-foreground group-hover:text-background transition-colors">
            <UserPlus className="w-5 h-5" />
          </div>
          <div className="font-serif text-lg font-semibold text-foreground mb-1.5">Inscrire un candidat</div>
          <p className="text-[12px] text-muted-foreground leading-relaxed mb-5">
            Remplir le questionnaire candidat (identité, parcours, activités, projet) et générer un lien d'invitation.
          </p>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
            Commencer <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>

        <Link
          to="/admin/inscrire/cabinet"
          className="group bg-background border border-border rounded-lg p-7 hover:border-foreground/40 hover:shadow-lg transition-all"
        >
          <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center mb-5 group-hover:bg-foreground group-hover:text-background transition-colors">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="font-serif text-lg font-semibold text-foreground mb-1.5">Inscrire un cabinet</div>
          <p className="text-[12px] text-muted-foreground leading-relaxed mb-5">
            Remplir le questionnaire cabinet (identité, abonnement, validation) et générer un lien d'invitation.
          </p>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
            Commencer <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminInscrireChooser;
