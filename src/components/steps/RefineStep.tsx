import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Code, 
  Brain, 
  CheckCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import type { InterviewQuestion } from '@/types/gemini-hire';

interface RefineStepProps {
  interviewQuestions: InterviewQuestion[];
  onRegenerate: () => void;
  isProcessing: boolean;
}

export function RefineStep({ 
  interviewQuestions, 
  onRegenerate,
  isProcessing 
}: RefineStepProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set());

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const markComplete = (index: number) => {
    setCompletedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (isProcessing && interviewQuestions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-2xl p-8 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Generating Interview Questions</h3>
              <p className="text-sm text-muted-foreground">Tailoring questions to the role...</p>
            </div>
          </div>
        </div>
        <SkeletonLoader variant="list" lines={5} />
      </div>
    );
  }

  if (interviewQuestions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No interview questions generated yet.</p>
      </div>
    );
  }

  const technicalQuestions = interviewQuestions.filter(q => q.type === 'technical');
  const behavioralQuestions = interviewQuestions.filter(q => q.type === 'behavioral');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        className="glass rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Interview Practice</h3>
              <p className="text-sm text-muted-foreground">
                {completedQuestions.size}/{interviewQuestions.length} questions reviewed
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRegenerate}
            disabled={isProcessing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
            New Questions
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(completedQuestions.size / interviewQuestions.length) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Technical Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-primary" />
          Technical Questions ({technicalQuestions.length})
        </h4>
        <div className="space-y-3">
          {technicalQuestions.map((question, index) => {
            const globalIndex = interviewQuestions.indexOf(question);
            const isExpanded = expandedIndex === globalIndex;
            const isCompleted = completedQuestions.has(globalIndex);

            return (
              <motion.div
                key={globalIndex}
                className={`glass rounded-xl overflow-hidden transition-all duration-300 ${
                  isCompleted ? 'border-success/30 bg-success/5' : ''
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <button
                  onClick={() => toggleExpand(globalIndex)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium
                      ${isCompleted ? 'bg-success text-success-foreground' : 'bg-primary/10 text-primary'}
                    `}>
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className={`font-medium ${isCompleted ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {question.question}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-border/50">
                        <p className="text-sm text-muted-foreground mb-4">
                          <span className="font-medium text-foreground">Focus Area:</span> {question.focus}
                        </p>
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <p className="text-sm text-muted-foreground">
                            Tip: Practice answering this question out loud, focusing on specific examples from your experience.
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant={isCompleted ? "outline" : "default"}
                          onClick={() => markComplete(globalIndex)}
                          className="mt-4"
                        >
                          {isCompleted ? 'Mark Incomplete' : 'Mark as Practiced'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Behavioral Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-accent" />
          Behavioral Questions ({behavioralQuestions.length})
        </h4>
        <div className="space-y-3">
          {behavioralQuestions.map((question, index) => {
            const globalIndex = interviewQuestions.indexOf(question);
            const isExpanded = expandedIndex === globalIndex;
            const isCompleted = completedQuestions.has(globalIndex);

            return (
              <motion.div
                key={globalIndex}
                className={`glass rounded-xl overflow-hidden transition-all duration-300 ${
                  isCompleted ? 'border-success/30 bg-success/5' : ''
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <button
                  onClick={() => toggleExpand(globalIndex)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium
                      ${isCompleted ? 'bg-success text-success-foreground' : 'bg-accent/10 text-accent'}
                    `}>
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className={`font-medium ${isCompleted ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {question.question}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-border/50">
                        <p className="text-sm text-muted-foreground mb-4">
                          <span className="font-medium text-foreground">Focus Area:</span> {question.focus}
                        </p>
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <Sparkles className="w-5 h-5 text-accent" />
                          <p className="text-sm text-muted-foreground">
                            Tip: Use the STAR method (Situation, Task, Action, Result) to structure your answer.
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant={isCompleted ? "outline" : "default"}
                          onClick={() => markComplete(globalIndex)}
                          className="mt-4"
                        >
                          {isCompleted ? 'Mark Incomplete' : 'Mark as Practiced'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Completion Message */}
      {completedQuestions.size === interviewQuestions.length && (
        <motion.div 
          className="glass rounded-2xl p-6 text-center glow-success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-foreground mb-2">
            Interview Prep Complete! 🎉
          </h4>
          <p className="text-sm text-muted-foreground">
            You've practiced all the questions. You're ready for your interview!
          </p>
        </motion.div>
      )}
    </div>
  );
}
