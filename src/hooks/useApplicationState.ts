import { useState, useCallback } from 'react';
import type { 
  ApplicationState, 
  ApplicationStep, 
  ResumeData, 
  SkillGap, 
  CoverLetter, 
  InterviewQuestion 
} from '@/types/gemini-hire';

const initialState: ApplicationState = {
  currentStep: 'upload',
  resumeFile: null,
  resumeData: null,
  jobDescription: '',
  skillGap: null,
  coverLetter: null,
  interviewQuestions: [],
  isProcessing: false,
  error: null,
};

export function useApplicationState() {
  const [state, setState] = useState<ApplicationState>(initialState);

  const setStep = useCallback((step: ApplicationStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const setResumeFile = useCallback((file: File | null) => {
    setState(prev => ({ ...prev, resumeFile: file }));
  }, []);

  const setResumeData = useCallback((data: ResumeData | null) => {
    setState(prev => ({ ...prev, resumeData: data }));
  }, []);

  const setJobDescription = useCallback((jd: string) => {
    setState(prev => ({ ...prev, jobDescription: jd }));
  }, []);

  const setSkillGap = useCallback((gap: SkillGap | null) => {
    setState(prev => ({ ...prev, skillGap: gap }));
  }, []);

  const setCoverLetter = useCallback((letter: CoverLetter | null) => {
    setState(prev => ({ ...prev, coverLetter: letter }));
  }, []);

  const setInterviewQuestions = useCallback((questions: InterviewQuestion[]) => {
    setState(prev => ({ ...prev, interviewQuestions: questions }));
  }, []);

  const setProcessing = useCallback((processing: boolean) => {
    setState(prev => ({ ...prev, isProcessing: processing }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error: error }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
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
    reset,
  };
}
