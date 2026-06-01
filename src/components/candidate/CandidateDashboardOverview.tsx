import CandidateOffers from '@/components/candidate/CandidateOffers';
import CandidateProcesses from '@/components/candidate/CandidateProcesses';
import CandidateRequests from '@/components/candidate/CandidateRequests';
import CandidateNotifications from '@/components/candidate/CandidateNotifications';

const CandidateDashboardOverview = () => (
  <div>
    <div className="mb-8">
      <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Tableau de bord</p>
      <div className="w-8 h-px bg-foreground" />
    </div>

    <div className="space-y-14">
      <CandidateOffers />
      <CandidateRequests />
      <CandidateProcesses />
      <CandidateNotifications />
    </div>
  </div>
);

export default CandidateDashboardOverview;
