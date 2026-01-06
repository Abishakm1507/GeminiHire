import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ApplicationStep } from '@/types/gemini-hire';

interface ProgressStepsProps {
  currentStep: ApplicationStep;
}

const steps: { id: ApplicationStep; label: string }[] = [
  { id: 'upload', label: 'Upload' },
  { id: 'analyze', label: 'Analyze' },
  { id: 'generate', label: 'Generate' },
  { id: 'refine', label: 'Refine' },
];

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const stepOrder = ['upload', 'analyze', 'generate', 'refine'];
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isActive = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={step.id} className="flex items-center">
            <motion.div
              className={`
                flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm
                transition-all duration-300
                ${isComplete ? 'step-complete' : ''}
                ${isActive ? 'step-active' : ''}
                ${isPending ? 'step-pending' : ''}
              `}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {isComplete ? (
                <Check className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </motion.div>
            
            {index < steps.length - 1 && (
              <div className={`
                w-12 h-0.5 mx-2 rounded-full transition-all duration-500
                ${index < currentIndex ? 'bg-primary' : 'bg-muted'}
              `} />
            )}
          </div>
        );
      })}
    </div>
  );
}
