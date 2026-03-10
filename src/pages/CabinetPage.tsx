import { useCabinetStore } from '@/stores/cabinetStore';
import Footer from '@/components/layout/Footer';
import LogoBanner from '@/components/layout/LogoBanner';
import CabinetStepProgress from '@/components/cabinet/CabinetStepProgress';
import CabinetStep1Hero from '@/components/cabinet/CabinetStep1Hero';
import CabinetStep2Identity from '@/components/cabinet/CabinetStep2Identity';
import CabinetStep3Search from '@/components/cabinet/CabinetStep3Search';
import CabinetStep4Subscription from '@/components/cabinet/CabinetStep4Subscription';
import CabinetStep5Validation from '@/components/cabinet/CabinetStep5Validation';
import CabinetStep6Confirm from '@/components/cabinet/CabinetStep6Confirm';
import CabinetStep7Espace from '@/components/cabinet/CabinetStep7Espace';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const CabinetPage = () => {
  const step = useCabinetStore((s) => s.step);
  const setStep = useCabinetStore((s) => s.setStep);
  const [searchParams] = useSearchParams();

  // If coming from Step1Hero with ?start=2, skip the hero and go to step 2
  useEffect(() => {
    const startStep = searchParams.get('start');
    if (startStep === '2' && step === 1) {
      setStep(2);
    }
  }, [searchParams, setStep, step]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const isDarkStep = step === 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LogoBanner subtitle="Espace Cabinet" />

      {step >= 2 && step <= 5 && <CabinetStepProgress />}

      <main className={step === 1 ? '' : 'flex-1 py-11 px-6 md:px-12'}>
        {step === 1 && <CabinetStep1Hero />}
        {step === 2 && <CabinetStep2Identity />}
        {step === 3 && <CabinetStep3Search />}
        {step === 4 && <CabinetStep4Subscription />}
        {step === 5 && <CabinetStep5Validation />}
        {step === 6 && <CabinetStep6Confirm />}
        {step === 7 && <CabinetStep7Espace />}
      </main>

      <Footer />
    </div>
  );
};

export default CabinetPage;
