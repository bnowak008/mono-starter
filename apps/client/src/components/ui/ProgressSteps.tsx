import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Step {
  label: string;
  icon: React.ReactNode;
  status: 'completed' | 'pending' | 'upcoming';
}

interface ProgressStepsProps {
  steps: Step[];
  className?: string;
}

const statusIcons = {
  completed: <CheckCircle className="w-5 h-5 text-green-600" />,
  pending: <Clock className="w-5 h-5 text-yellow-600" />,
  upcoming: <AlertCircle className="w-5 h-5 text-gray-400" />
};

export function ProgressSteps({ steps, className }: ProgressStepsProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {steps.map((step, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-50"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              {step.icon}
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900">{step.label}</span>
              {step.status === 'pending' && (
                <p className="text-xs text-gray-500 mt-0.5">In progress</p>
              )}
            </div>
          </div>
          {statusIcons[step.status]}
        </div>
      ))}
    </div>
  );
} 