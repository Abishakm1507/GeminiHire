import { motion } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  AlertTriangle, 
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScoreCircle } from '@/components/ui/ScoreCircle';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import type { ResumeData, SkillGap } from '@/types/gemini-hire';

interface AnalyzeStepProps {
  resumeData: ResumeData | null;
  skillGap: SkillGap | null;
  onGenerateCoverLetter: () => void;
  isProcessing: boolean;
}

export function AnalyzeStep({ 
  resumeData, 
  skillGap, 
  onGenerateCoverLetter, 
  isProcessing 
}: AnalyzeStepProps) {
  if (isProcessing && !resumeData) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader variant="card" />
          <SkeletonLoader variant="card" />
          <SkeletonLoader variant="card" />
          <SkeletonLoader variant="card" />
        </div>
      </div>
    );
  }

  if (!resumeData || !skillGap) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No analysis data available. Please upload a resume first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile Overview */}
      <motion.div 
        className="glass rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">{resumeData.name}</h3>
              {resumeData.email && (
                <p className="text-sm text-muted-foreground">{resumeData.email}</p>
              )}
              {resumeData.summary && (
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">{resumeData.summary}</p>
              )}
            </div>
          </div>
          <ScoreCircle 
            score={skillGap.matchPercentage} 
            maxScore={100} 
            size="lg" 
            showPercentage 
          />
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills */}
        <motion.div 
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Your Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => {
              const isMatched = skillGap.matchedSkills.includes(skill);
              return (
                <Badge 
                  key={index} 
                  variant={isMatched ? "default" : "secondary"}
                  className={isMatched ? "bg-success/20 text-success border-success/30" : ""}
                >
                  {isMatched && <CheckCircle className="w-3 h-3 mr-1" />}
                  {skill}
                </Badge>
              );
            })}
          </div>
        </motion.div>

        {/* Skill Gaps */}
        <motion.div 
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-warning" />
            Skills to Develop
          </h4>
          {skillGap.missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skillGap.missingSkills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-warning/10 text-warning border-warning/30"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-success text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Great! You have all the required skills.
            </p>
          )}
        </motion.div>

        {/* Experience */}
        <motion.div 
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Experience
          </h4>
          <div className="space-y-4">
            {resumeData.experience.slice(0, 3).map((exp, index) => (
              <div key={index} className="border-l-2 border-primary/30 pl-4">
                <p className="font-medium text-foreground text-sm">{exp.title}</p>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
                <p className="text-xs text-muted-foreground">{exp.duration}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div 
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Education
          </h4>
          <div className="space-y-4">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-primary/30 pl-4">
                <p className="font-medium text-foreground text-sm">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                <p className="text-xs text-muted-foreground">{edu.year}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Learning Paths */}
      {skillGap.learningPaths.length > 0 && (
        <motion.div 
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h4 className="font-semibold text-foreground mb-4">📚 Recommended Learning Paths</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillGap.learningPaths.map((path, index) => (
              <div key={index} className="bg-muted/30 rounded-xl p-4">
                <p className="font-medium text-foreground text-sm mb-2">{path.skill}</p>
                <p className="text-xs text-muted-foreground mb-3">⏱️ {path.estimatedTime}</p>
                <div className="space-y-1">
                  {path.resources.slice(0, 2).map((resource, i) => (
                    <a 
                      key={i} 
                      href="#" 
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {resource}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-end"
      >
        <Button
          size="lg"
          onClick={onGenerateCoverLetter}
          disabled={isProcessing}
          className="group px-8 bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              Generate Cover Letter
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
