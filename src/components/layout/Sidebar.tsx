import { motion } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  Target, 
  MessageSquare, 
  LayoutDashboard,
  ChevronRight,
  Zap
} from 'lucide-react';
import type { ApplicationStep } from '@/types/gemini-hire';

interface SidebarProps {
  currentStep: ApplicationStep;
  onStepClick: (step: ApplicationStep) => void;
  isAnalyzed: boolean;
}

const steps = [
  { id: 'upload' as ApplicationStep, label: 'Upload Resume', icon: FileText, description: 'PDF or Image' },
  { id: 'analyze' as ApplicationStep, label: 'Analyze', icon: Target, description: 'Skills & Gaps' },
  { id: 'generate' as ApplicationStep, label: 'Generate', icon: Sparkles, description: 'Cover Letter' },
  { id: 'refine' as ApplicationStep, label: 'Interview Prep', icon: MessageSquare, description: 'Practice Q&A' },
];

export function Sidebar({ currentStep, onStepClick, isAnalyzed }: SidebarProps) {
  const getStepStatus = (stepId: ApplicationStep) => {
    const stepOrder = ['upload', 'analyze', 'generate', 'refine'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);
    
    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const canNavigate = (stepId: ApplicationStep) => {
    if (stepId === 'upload') return true;
    if (!isAnalyzed) return false;
    return true;
  };

  return (
    <aside className="w-72 h-screen glass-dark border-r border-border/50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/30">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center glow-primary">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">GeminiHire</h1>
            <p className="text-xs text-muted-foreground">AI Application Assistant</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-6">
          <div className="sidebar-item sidebar-item-active">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </div>
        </div>

        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 mb-3">
          Workflow
        </p>

        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isClickable = canNavigate(step.id);
          
          return (
            <motion.button
              key={step.id}
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={`w-full text-left transition-all duration-300 ${
                isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${status === 'active' 
                  ? 'bg-primary/10 border border-primary/20 glow-primary' 
                  : status === 'complete'
                    ? 'bg-success/10 border border-success/20'
                    : 'hover:bg-muted/50'
                }
              `}>
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                  ${status === 'active' 
                    ? 'bg-primary text-primary-foreground' 
                    : status === 'complete'
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted text-muted-foreground'
                  }
                `}>
                  <step.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    status === 'active' ? 'text-primary' : 
                    status === 'complete' ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {status === 'active' && (
                  <ChevronRight className="w-4 h-4 text-primary" />
                )}
              </div>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/30">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-foreground">Powered by Gemini</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Advanced AI for smarter applications
          </p>
        </div>
      </div>
    </aside>
  );
}
