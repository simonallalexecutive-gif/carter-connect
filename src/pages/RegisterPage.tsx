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
  const isStepContent = currentStep >= 2 && currentStep <= 6;

  const [showConfIntro, setShowConfIntro] = useState(espaceParam === 'candidat');
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

  // White theme for registration steps 2-6, dark for step 7
  useEffect(() => {
    if (isStepContent && !showConfIntro && !showCabinetIntro) {
      document.body.classList.add('theme-light-registration');
      document.body.classList.remove('theme-dark-registration', 'theme-light');
    } else if (isDarkStep) {
      document.body.classList.remove('theme-light-registration', 'theme-light', 'theme-dark-registration');
    } else {
      document.body.classList.remove('theme-light-registration', 'theme-dark-registration', 'theme-light');
    }
    return () => {
      document.body.classList.remove('theme-light-registration', 'theme-dark-registration', 'theme-light');
    };
  }, [isDarkStep, isStepContent, currentStep, showConfIntro, showCabinetIntro]);

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
    <div className={(isDarkStep || showConfIntro || showCabinetIntro) ? '' : 'min-h-screen'}>
      {showProgress && (
        <>
          <LogoBanner subtitle="Espace Candidat" variant="default" />
          <div className="sticky top-0 z-40 bg-black border-b border-white/10 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]">
            <StepProgress currentStep={currentStep} dark />
          </div>
        </>
      )}
      <div className={isStepContent && !showConfIntro && !showCabinetIntro ? 'bg-white min-h-[calc(100vh-140px)]' : ''}>
        {renderStep()}
      </div>
    </div>
  );
};

export default RegisterPage;
