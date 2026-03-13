import { useCabinetStore } from '@/stores/cabinetStore';
import Footer from '@/components/layout/Footer';
import LogoBanner from '@/components/layout/LogoBanner';
import CabinetStepProgress from '@/components/cabinet/CabinetStepProgress';
import CabinetStep1Hero from '@/components/cabinet/CabinetStep1Hero';
import CabinetStep2Identity from '@/components/cabinet/CabinetStep2Identity';
import CabinetStep4Subscription from '@/components/cabinet/CabinetStep4Subscription';
import CabinetStep5Validation from '@/components/cabinet/CabinetStep5Validation';
import CabinetStep6Confirm from '@/components/cabinet/CabinetStep6Confirm';
import CabinetDashboard from '@/components/cabinet/CabinetDashboard';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const CabinetPage = () => {
  const step = useCabinetStore((s) => s.step);
  const setStep = useCabinetStore((s) => s.setStep);
  const setField = useCabinetStore((s) => s.setField);
  const [searchParams] = useSearchParams();

  // Auto-detect existing session and go to dashboard
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await (supabase.auth as any).getSession();
      if (session?.user) {
        const name = session.user.user_metadata?.full_name || '';
        if (name) setField('cabinetName', name);
        setStep(6);
      }
    };
    if (step === 1) checkSession();
  }, []);

  // Listen for auth state changes (login/signup)
  useEffect(() => {
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const name = session.user.user_metadata?.full_name || '';
        if (name) setField('cabinetName', name);
        setStep(6);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const startStep = searchParams.get('start');
    if (startStep === '2' && step === 1) {
      setStep(2);
    }
  }, [searchParams, setStep, step]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LogoBanner subtitle="Espace Cabinet" />

      {step >= 2 && step <= 4 && <CabinetStepProgress />}

      <main className={step === 1 ? '' : 'flex-1 py-11 px-6 md:px-12'}>
        {step === 1 && <CabinetStep1Hero />}
        {step === 2 && <CabinetStep2Identity />}
        {step === 3 && <CabinetStep4Subscription />}
        {step === 4 && <CabinetStep5Validation />}
        {step === 5 && <CabinetStep6Confirm />}
        {step === 6 && <CabinetDashboard />}
      </main>

      <Footer />
    </div>
  );
};

export default CabinetPage;
