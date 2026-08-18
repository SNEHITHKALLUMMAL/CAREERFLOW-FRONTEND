import { useState } from 'react';
import { cn } from '@/utils/cn';
import { SkillGapTool } from '@/components/dashboard/ai/SkillGapTool';
import { CareerRecommendationTool } from '@/components/dashboard/ai/CareerRecommendationTool';
import { LearningRoadmapTool } from '@/components/dashboard/ai/LearningRoadmapTool';
import { ResumeSuggestionsTool } from '@/components/dashboard/ai/ResumeSuggestionsTool';
import { TechnologyRecommendationTool } from '@/components/dashboard/ai/TechnologyRecommendationTool';
import { InterviewQuestionsTool } from '@/components/dashboard/ai/InterviewQuestionsTool';
import { SalaryEstimationTool } from '@/components/dashboard/ai/SalaryEstimationTool';
import { ChatbotTool } from '@/components/dashboard/ai/ChatbotTool';
import { MockInterviewTool } from '@/components/dashboard/ai/MockInterviewTool';

const TABS = [
  { key: 'skill-gap', label: 'Skill gap', Component: SkillGapTool },
  { key: 'career', label: 'Career fit', Component: CareerRecommendationTool },
  { key: 'roadmap', label: 'Roadmap', Component: LearningRoadmapTool },
  { key: 'resume', label: 'Resume tips', Component: ResumeSuggestionsTool },
  { key: 'tech', label: 'Tech to learn', Component: TechnologyRecommendationTool },
  { key: 'interview-qs', label: 'Interview Qs', Component: InterviewQuestionsTool },
  { key: 'salary', label: 'Salary', Component: SalaryEstimationTool },
  { key: 'chatbot', label: 'Chatbot', Component: ChatbotTool },
  { key: 'mock-interview', label: 'Mock interview', Component: MockInterviewTool },
];

export function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const Active = TABS.find((t) => t.key === activeTab).Component;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">AI career assistant</h1>
        <p className="text-mist">Tools to help you close skill gaps and get interview-ready.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'rounded-xl px-3.5 py-2 text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'bg-signal text-white'
                : 'bg-mist/10 text-mist hover:bg-mist/15 dark:bg-white/5 dark:hover:bg-white/10'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Active />
    </div>
  );
}
