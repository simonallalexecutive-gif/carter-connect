import { Clock, Hourglass } from 'lucide-react';

const MOCK_REQUESTS = [
  {
    id: 'REQ-001',
    reference: 'LGN-2026-042',
    dept: 'Private Equity',
    submittedAt: '2026-03-10',
    status: 'En cours de qualification',
  },
  {
    id: 'REQ-002',
    reference: 'LGN-2026-045',
    dept: 'Droit Social',
    submittedAt: '2026-03-12',
    status: 'En attente de retour cabinet',
  },
];

const CandidateRequests = () => (
  <div>
    <div className="mb-8">
      <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Demandes en attente</p>
      <div className="w-8 h-px bg-foreground" />
    </div>

    {MOCK_REQUESTS.length === 0 ? (
      <div className="text-center py-16">
        <Hourglass className="w-8 h-8 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Aucune demande en attente.</p>
      </div>
    ) : (
      <div className="space-y-4">
        {MOCK_REQUESTS.map((req) => (
          <div key={req.id} className="border border-border rounded-lg p-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-serif text-lg text-foreground font-medium">{req.dept}</span>
                <span className="text-[10px] text-muted-foreground tracking-widest uppercase">{req.reference}</span>
              </div>
              <p className="text-xs text-muted-foreground">Soumise le {new Date(req.submittedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[11px] font-medium text-foreground">{req.status}</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default CandidateRequests;
