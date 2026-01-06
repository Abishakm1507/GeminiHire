import { motion } from 'framer-motion';
import { Moon, Sun, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ApplicationStep } from '@/types/gemini-hire';

interface HeaderProps {
  currentStep: ApplicationStep;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const stepTitles: Record<ApplicationStep, { title: string; subtitle: string }> = {
  upload: { title: 'Upload Your Resume', subtitle: 'Start by uploading your resume in PDF or image format' },
  analyze: { title: 'Skill Analysis', subtitle: 'Discover skill gaps and get personalized recommendations' },
  generate: { title: 'Cover Letter Studio', subtitle: 'Generate a tailored cover letter for your dream job' },
  refine: { title: 'Interview Preparation', subtitle: 'Practice with AI-generated interview questions' },
};

export function Header({ currentStep, isDarkMode, onToggleTheme }: HeaderProps) {
  const { title, subtitle } = stepTitles[currentStep];

  return (
    <header className="h-20 glass-dark border-b border-border/50 px-8 flex items-center justify-between">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </motion.div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleTheme}
          className="rounded-full hover:bg-muted"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-muted relative"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </Button>

        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <User className="w-5 h-5 text-primary" />
        </div>
      </div>
    </header>
  );
}
