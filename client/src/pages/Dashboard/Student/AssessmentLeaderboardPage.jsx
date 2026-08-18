import { useParams } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useAssessment';
import { Card, CardDescription } from '@/components/ui/card';
import { cn } from '@/utils/cn';

export function AssessmentLeaderboardPage() {
  const { id } = useParams();
  const { data: leaderboard, isLoading } = useLeaderboard(id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Leaderboard</h1>
        <p className="text-mist">See how you stack up against other attempts.</p>
      </div>

      <Card>
        {isLoading && <p className="text-mist">Loading leaderboard...</p>}
        {!isLoading && leaderboard?.length === 0 && (
          <CardDescription>No submitted attempts yet.</CardDescription>
        )}
        <ul className="space-y-2">
          {leaderboard?.map((entry) => (
            <li
              key={entry.rank}
              className={cn(
                'flex items-center justify-between rounded-xl p-3 text-sm',
                entry.rank <= 3 ? 'bg-signal-light dark:bg-signal/10' : 'bg-mist/5'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-ink dark:bg-white/10 dark:text-white">
                  {entry.rank <= 3 ? <Trophy className="h-3.5 w-3.5 text-ember" /> : entry.rank}
                </span>
                <span className="font-medium">{entry.studentName}</span>
              </div>
              <span className="font-mono text-sm">
                {entry.totalScore}/{entry.maxScore} · {entry.percentage}%
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
