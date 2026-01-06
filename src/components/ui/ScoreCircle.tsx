import { motion } from 'framer-motion';

interface ScoreCircleProps {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showPercentage?: boolean;
}

const sizeConfig = {
  sm: { width: 60, stroke: 4, fontSize: 'text-sm' },
  md: { width: 80, stroke: 5, fontSize: 'text-lg' },
  lg: { width: 120, stroke: 6, fontSize: 'text-2xl' },
};

export function ScoreCircle({ 
  score, 
  maxScore = 10, 
  size = 'md', 
  label,
  showPercentage = false 
}: ScoreCircleProps) {
  const config = sizeConfig[size];
  const radius = (config.width - config.stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (score / maxScore) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  const getScoreColor = () => {
    if (percentage >= 80) return 'stroke-success';
    if (percentage >= 60) return 'stroke-primary';
    if (percentage >= 40) return 'stroke-warning';
    return 'stroke-destructive';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="score-circle" style={{ width: config.width, height: config.width }}>
        <svg width={config.width} height={config.width} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            strokeWidth={config.stroke}
            className="score-circle-track"
          />
          {/* Animated fill */}
          <motion.circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`score-circle-fill ${getScoreColor()}`}
          />
        </svg>
        {/* Score display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className={`font-bold text-foreground ${config.fontSize}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {showPercentage ? `${Math.round(percentage)}%` : score.toFixed(1)}
          </motion.span>
        </div>
      </div>
      {label && (
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      )}
    </div>
  );
}
