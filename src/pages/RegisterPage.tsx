import { useRegistrationStore } from '@/stores/registrationStore';
import StepProgress from '@/components/registration/StepProgress';
import Step1Hero from '@/components/registration/Step1Hero';
import Step2Identity from '@/components/registration/Step2Identity';
import Step3Activity from '@/components/registration/Step3Activity';
import Step4Project from '@/components/registration/Step4Project';
import Step5Status from '@/components/registration/Step5Status';
import Step6Review from '@/components/registration/Step6Review';
import Step7Confirm from '@/components/registration/Step7Confirm';
import { useEffect } from 'react';

const RegisterPage = () => {
  const currentStep = useRegistrationStore(s => s.currentStep);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Hero />;
      case 2: return <Step2Identity />;
      case 3: return <Step3Activity />;
      case 4: return <Step4Project />;
      case 5: return <Step5Status />;
      case 6: return <Step6Review />;
      case 7: return <Step7Confirm />;
      default: return <Step1Hero />;
    }
  };

  const showProgress = currentStep >= 2 && currentStep <= 6;
  const isDarkStep = currentStep === 1 || currentStep === 7;

  return (
    <div className={isDarkStep ? '' : 'bg-background min-h-screen'}>
      {showProgress && (
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <StepProgress currentStep={currentStep} />
        </div>
      )}
      {renderStep()}
    </div>
  );
};

export default RegisterPage;
