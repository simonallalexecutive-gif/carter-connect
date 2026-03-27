import { useRegistrationStore } from '@/stores/registrationStore';
import StepProgress from '@/components/registration/StepProgress';
import Step1Hero from '@/components/registration/Step1Hero';
import ConfidentialityIntro from '@/components/registration/ConfidentialityIntro';
import CabinetConfidentialityIntro from '@/components/registration/CabinetConfidentialityIntro';
import Step2Identity from '@/components/registration/Step2Identity';
import Step3Activity from '@/components/registration/Step3Activity';
import Step4Project from '@/components/registration/Step4Project';
import Step5Status from '@/components/registration/Step5Status';
import Step6Review from '@/components/registration/Step6Review';
import Step7Confirm from '@/components/registration/Step7Confirm';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LogoBanner from '@/components/layout/LogoBanner';

const RegisterPage = () => {
  const currentStep = useRegistrationStore(s => s.currentStep);
  const goToStep = useRegistrationStore(s => s.goToStep);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const espaceParam = searchParams.get('espace');
  const isDarkStep = currentStep === 7;

  // For candidat: show confidentiality intro first (skip Step1Hero)
  const [showConfIntro, setShowConfIntro] = useState(espaceParam === 'candidat');
  // For cabinet: show cabinet confidentiality intro
  const [showCabinetIntro, setShowCabinetIntro] = useState(espaceParam === 'cabinet');

  useEffect(() => {
    const startStep = searchParams.get('start');
    if (startStep === '2' && currentStep === 1) {
      goToStep(2);
    }
  }, [searchParams, goToStep, currentStep]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, showConfIntro, showCabinetIntro]);

  // Apply theme-light to <body> so Radix portals (Select, Popover, etc.) inherit light tokens
  useEffect(() => {
    if (!isDarkStep && !showConfIntro && !showCabinetIntro) {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
    return () => document.body.classList.remove('theme-light');
  }, [isDarkStep, showConfIntro, showCabinetIntro]);

  const handleConfIntroComplete = () => {
    setShowConfIntro(false);
    goToStep(2);
  };

  const handleCabinetIntroComplete = () => {
    setShowCabinetIntro(false);
    navigate('/cabinet?start=2');
  };

  const renderStep = () => {
    if (showCabinetIntro) {
      return <CabinetConfidentialityIntro onContinue={handleCabinetIntroComplete} />;
    }
    if (showConfIntro) {
      return <ConfidentialityIntro onContinue={handleConfIntroComplete} />;
    }
    switch (currentStep) {
      case 1: return <Step1Hero onBeforeRegister={() => setShowConfIntro(true)} />;
      case 2: return <Step2Identity />;
      case 3: return <Step3Activity />;
      case 4: return <Step4Project />;
      case 5: return <Step5Status />;
      case 6: return <Step6Review />;
      case 7: return <Step7Confirm />;
      default: return <Step1Hero onBeforeRegister={() => setShowConfIntro(true)} />;
    }
  };

  const showProgress = !showConfIntro && !showCabinetIntro && currentStep >= 2 && currentStep <= 6;

  return (
    <div className={(isDarkStep || showConfIntro || showCabinetIntro) ? '' : 'theme-light bg-background min-h-screen'}>
      {showProgress && (
        <>
          <LogoBanner subtitle="Espace Candidat" />
          <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
            <StepProgress currentStep={currentStep} />
          </div>
        </>
      )}
      {renderStep()}
    </div>
  );
};

export default RegisterPage;
