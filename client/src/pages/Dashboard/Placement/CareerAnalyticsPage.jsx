import { useCareerAnalytics } from '@/hooks/usePlacement';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart } from '@/components/dashboard/charts/BarChart';

export function CareerAnalyticsPage() {
  const { data, isLoading } = useCareerAnalytics();

  if (isLoading || !data) return <p className="text-mist">Loading career analytics...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Career analytics</h1>
        <p className="text-mist">Trends across your students and the platform.</p>
      </div>

      <Card>
        <CardTitle>Top career interests</CardTitle>
        {data.topCareerInterests.length === 0 ? (
          <CardDescription className="mt-2">No career interests recorded yet.</CardDescription>
        ) : (
          <div className="mt-4">
            <BarChart
              labels={data.topCareerInterests.map((i) => i.interest)}
              data={data.topCareerInterests.map((i) => i.count)}
              color="#17B897"
              horizontal
            />
          </div>
        )}
      </Card>

      <Card>
        <CardTitle>Most in-demand skills (open listings)</CardTitle>
        {data.topDemandSkills.length === 0 ? (
          <CardDescription className="mt-2">
            No open listings with required skills yet.
          </CardDescription>
        ) : (
          <div className="mt-4">
            <BarChart
              labels={data.topDemandSkills.map((s) => s.skill)}
              data={data.topDemandSkills.map((s) => s.count)}
              horizontal
            />
          </div>
        )}
      </Card>

      <Card>
        <CardTitle>AI feature usage (platform-wide)</CardTitle>
        {data.aiFeatureUsage.length === 0 ? (
          <CardDescription className="mt-2">No AI feature usage recorded yet.</CardDescription>
        ) : (
          <div className="mt-4">
            <BarChart
              labels={data.aiFeatureUsage.map((a) => a.feature.replace(/_/g, ' '))}
              data={data.aiFeatureUsage.map((a) => a.count)}
              color="#FF7A45"
              horizontal
            />
          </div>
        )}
      </Card>
    </div>
  );
}
