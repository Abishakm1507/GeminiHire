import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { ProgressSteps } from './ui/ProgressSteps';
import { UploadStep } from './steps/UploadStep';
import { AnalyzeStep } from './steps/AnalyzeStep';
import { GenerateStep } from './steps/GenerateStep';
import { RefineStep } from './steps/RefineStep';
import { useApplicationState } from '@/hooks/useApplicationState';
import { useToast } from '@/hooks/use-toast';
import type { ApplicationStep } from '@/types/gemini-hire';

export function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toast } = useToast();
  const {
    state,
    setStep,
    setResumeFile,
    setResumeData,
    setJobDescription,
    setSkillGap,
    setCoverLetter,
    setInterviewQuestions,
    setProcessing,
    setError,
  } = useApplicationState();

  // Apply dark mode
  useState(() => {
    document.documentElement.classList.add('dark');
  });

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = useCallback(async () => {
    if (!state.resumeFile || !state.jobDescription) return;

    setProcessing(true);
    setError(null);
    setStep('analyze');

    try {
      const base64File = await fileToBase64(state.resumeFile);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            resumeBase64: base64File,
            jobDescription: state.jobDescription,
            fileName: state.resumeFile.name,
            mimeType: state.resumeFile.type,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      setResumeData(data.resumeData);
      setSkillGap(data.skillGap);

      toast({
        title: "Analysis Complete",
        description: `Match score: ${data.skillGap.matchPercentage}%`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'Please try again',
        variant: "destructive",
      });
      setStep('upload');
    } finally {
      setProcessing(false);
    }
  }, [state.resumeFile, state.jobDescription, setProcessing, setError, setStep, setResumeData, setSkillGap, toast]);

  const handleGenerateCoverLetter = useCallback(async () => {
    if (!state.resumeData || !state.jobDescription) return;

    setProcessing(true);
    setStep('generate');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            resumeData: state.resumeData,
            jobDescription: state.jobDescription,
            type: 'cover-letter',
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();
      setCoverLetter(data.coverLetter);

      toast({
        title: "Cover Letter Generated",
        description: `Quality score: ${data.coverLetter.qualityScore.overall.toFixed(1)}/10`,
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'Please try again',
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  }, [state.resumeData, state.jobDescription, setProcessing, setStep, setCoverLetter, toast]);

  const handlePrepareInterview = useCallback(async () => {
    if (!state.resumeData || !state.jobDescription) return;

    setProcessing(true);
    setStep('refine');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            resumeData: state.resumeData,
            jobDescription: state.jobDescription,
            type: 'interview-questions',
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();
      setInterviewQuestions(data.interviewQuestions);

      toast({
        title: "Interview Questions Ready",
        description: `${data.interviewQuestions.length} custom questions generated`,
      });
    } catch (error) {
      console.error('Interview prep error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'Please try again',
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  }, [state.resumeData, state.jobDescription, setProcessing, setStep, setInterviewQuestions, toast]);

  const handleStepClick = (step: ApplicationStep) => {
    if (step === 'upload' || state.resumeData) {
      setStep(step);
    }
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 'upload':
        return (
          <UploadStep
            resumeFile={state.resumeFile}
            jobDescription={state.jobDescription}
            onFileSelect={setResumeFile}
            onJobDescriptionChange={setJobDescription}
            onAnalyze={handleAnalyze}
            isProcessing={state.isProcessing}
          />
        );
      case 'analyze':
        return (
          <AnalyzeStep
            resumeData={state.resumeData}
            skillGap={state.skillGap}
            onGenerateCoverLetter={handleGenerateCoverLetter}
            isProcessing={state.isProcessing}
          />
        );
      case 'generate':
        return (
          <GenerateStep
            coverLetter={state.coverLetter}
            onPrepareInterview={handlePrepareInterview}
            onRegenerate={handleGenerateCoverLetter}
            isProcessing={state.isProcessing}
          />
        );
      case 'refine':
        return (
          <RefineStep
            interviewQuestions={state.interviewQuestions}
            onRegenerate={handlePrepareInterview}
            isProcessing={state.isProcessing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gradient-hero">
      <Sidebar 
        currentStep={state.currentStep} 
        onStepClick={handleStepClick}
        isAnalyzed={!!state.resumeData}
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          currentStep={state.currentStep}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
        />
        
        <main className="flex-1 p-8 overflow-auto scrollbar-thin">
          <ProgressSteps currentStep={state.currentStep} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
