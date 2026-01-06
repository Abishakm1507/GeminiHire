import { motion } from 'framer-motion';
import { FileText, Copy, Download, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScoreCircle } from '@/components/ui/ScoreCircle';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { useToast } from '@/hooks/use-toast';
import type { CoverLetter } from '@/types/gemini-hire';

interface GenerateStepProps {
  coverLetter: CoverLetter | null;
  onPrepareInterview: () => void;
  onRegenerate: () => void;
  isProcessing: boolean;
}

export function GenerateStep({ 
  coverLetter, 
  onPrepareInterview, 
  onRegenerate,
  isProcessing 
}: GenerateStepProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    if (coverLetter?.content) {
      await navigator.clipboard.writeText(coverLetter.content);
      toast({
        title: "Copied!",
        description: "Cover letter copied to clipboard",
      });
    }
  };

  const handleDownload = () => {
    if (coverLetter?.content) {
      const blob = new Blob([coverLetter.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cover-letter.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (isProcessing && !coverLetter) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Crafting Your Cover Letter</h3>
              <p className="text-sm text-muted-foreground">AI is generating personalized content...</p>
            </div>
          </div>
          <SkeletonLoader lines={8} />
        </div>
      </div>
    );
  }

  if (!coverLetter) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No cover letter generated yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Quality Scores */}
      {coverLetter.qualityScore && (
        <motion.div 
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="font-semibold text-foreground mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Quality Assessment
          </h4>
          <div className="flex items-center justify-around flex-wrap gap-6">
            <ScoreCircle 
              score={coverLetter.qualityScore.relevance} 
              label="Relevance" 
              size="md"
            />
            <ScoreCircle 
              score={coverLetter.qualityScore.accuracy} 
              label="Accuracy" 
              size="md"
            />
            <ScoreCircle 
              score={coverLetter.qualityScore.effectiveness} 
              label="Effectiveness" 
              size="md"
            />
            <ScoreCircle 
              score={coverLetter.qualityScore.overall} 
              label="Overall" 
              size="lg"
            />
          </div>
          {coverLetter.qualityScore.feedback && (
            <p className="text-sm text-muted-foreground mt-6 text-center max-w-2xl mx-auto">
              {coverLetter.qualityScore.feedback}
            </p>
          )}
        </motion.div>
      )}

      {/* Cover Letter Content */}
      <motion.div 
        className="glass rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Your Cover Letter
          </h4>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRegenerate}
              disabled={isProcessing}
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDownload}
              className="text-muted-foreground hover:text-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="bg-background/50 rounded-xl p-6 border border-border/50">
          <pre className="whitespace-pre-wrap font-sans text-foreground text-sm leading-relaxed">
            {coverLetter.content}
          </pre>
        </div>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-end"
      >
        <Button
          size="lg"
          onClick={onPrepareInterview}
          disabled={isProcessing}
          className="group px-8 bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Preparing...
            </>
          ) : (
            <>
              Prepare for Interview
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
