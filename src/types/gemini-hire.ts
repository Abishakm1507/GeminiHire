export interface ResumeData {
  name: string;
  email?: string;
  phone?: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  summary?: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

export interface SkillGap {
  missingSkills: string[];
  matchedSkills: string[];
  learningPaths: LearningPath[];
  matchPercentage: number;
}

export interface LearningPath {
  skill: string;
  resources: string[];
  estimatedTime: string;
}

export interface InterviewQuestion {
  question: string;
  type: 'technical' | 'behavioral';
  focus: string;
}

export interface QualityScore {
  relevance: number;
  accuracy: number;
  effectiveness: number;
  overall: number;
  feedback: string;
}

export interface CoverLetter {
  content: string;
  qualityScore?: QualityScore;
}

export type ApplicationStep = 'upload' | 'analyze' | 'generate' | 'refine';

export interface ApplicationState {
  currentStep: ApplicationStep;
  resumeFile: File | null;
  resumeData: ResumeData | null;
  jobDescription: string;
  skillGap: SkillGap | null;
  coverLetter: CoverLetter | null;
  interviewQuestions: InterviewQuestion[];
  isProcessing: boolean;
  error: string | null;
}
