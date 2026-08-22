import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, Award } from 'lucide-react';
import { useAssessments } from '@/hooks/useAssessment';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Select } from '@/components/ui/textarea';
import { ASSESSMENT_TYPE_LABELS, typeLabel } from '@/utils/assessmentLabels';

export function AssessmentListPage() {
  const [type, setType] = useState('');
  const { data, isLoading } = useAssessments({ type: type || undefined });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Assessments</h1>
          <p className="text-mist">Take a test to sharpen your skills and earn a certificate.</p>
        </div>
        <Select value={type} onChange={(e) => setType(e.target.value)} className="w-48">
          <option value="">All types</option>
          {Object.entries(ASSESSMENT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {isLoading && <p className="text-mist">Loading assessments...</p>}

      {!isLoading && data?.assessments.length === 0 && (
        <Card>
          <CardDescription>No assessments available right now. Check back soon.</CardDescription>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.assessments.map((assessment) => (
          <Link key={assessment._id} to={`/dashboard/assessments/${assessment._id}`}>
            <Card className="h-full transition-transform hover:-translate-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-light px-2.5 py-1 text-xs font-medium text-signal-dark dark:bg-signal/15 dark:text-signal">
                <ClipboardList className="h-3.5 w-3.5" />
                {typeLabel(assessment.type)}
              </span>
              <CardTitle className="mt-3">{assessment.title}</CardTitle>
              {assessment.description && (
                <CardDescription>{assessment.description}</CardDescription>
              )}
              <div className="mt-4 flex items-center gap-4 text-xs text-mist">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {assessment.durationMinutes} min
                </span>
                <span className="flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" />
                  {assessment.totalMarks} marks
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
