import { useRef, useState } from 'react';
import { FileUp, FileCheck2, Sparkles, Download } from 'lucide-react';
import { useUploadResume } from '@/hooks/useStudentProfile';
import {
  useResumeHistory,
  useResumeAtsScore,
  useBuildResume,
  useRebuildResume,
} from '@/hooks/useResume';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/textarea';

function AtsScorePanel({ resumeId }) {
  const { data, isLoading } = useResumeAtsScore(resumeId);
  if (isLoading || !data || data.atsScore === null) return null;

  return (
    <div className="mt-4 rounded-xl bg-mist/5 p-3 text-sm">
      <p className="font-medium">
        ATS score: <span className="text-momentum">{data.atsScore}/100</span>
      </p>
      {data.grammarSuggestions?.length > 0 && (
        <ul className="mt-2 list-disc space-y-0.5 pl-5 text-mist">
          {data.grammarSuggestions.slice(0, 4).map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}
      {data.keywordSuggestions?.length > 0 && (
        <p className="mt-2 text-mist">
          <span className="font-medium text-ink dark:text-white">Consider adding: </span>
          {data.keywordSuggestions.join(', ')}
        </p>
      )}
    </div>
  );
}

function ResumeHistoryList({ activeResumeId }) {
  const { data: history, isLoading } = useResumeHistory();
  const rebuildMutation = useRebuildResume();

  if (isLoading || !history?.length) return null;

  return (
    <div className="mt-4">
      <p className="text-sm font-medium">History</p>
      <ul className="mt-2 space-y-1.5 text-sm">
        {history.map((r) => (
          <li
            key={r._id}
            className="flex items-center justify-between gap-3 rounded-lg bg-mist/5 px-2.5 py-1.5"
          >
            <span className="text-mist">
              v{r.version}
              {r.templateUsed ? ` · ${r.templateUsed}` : ''} ·{' '}
              {new Date(r.createdAt).toLocaleDateString()}
              {r._id === activeResumeId ? ' · active' : ''}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={r.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-medium text-signal hover:underline"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </a>
              {r.templateUsed && (
                <button
                  type="button"
                  onClick={() => rebuildMutation.mutate({ resumeId: r._id })}
                  disabled={rebuildMutation.isPending}
                  className="text-xs font-medium text-mist hover:text-signal"
                >
                  Rebuild
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResumeCard({ profile }) {
  const inputRef = useRef(null);
  const uploadMutation = useUploadResume();
  const buildMutation = useBuildResume();
  const [template, setTemplate] = useState('classic');

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (file) uploadMutation.mutate(file);
    event.target.value = '';
  };

  return (
    <Card>
      <CardTitle>Resume</CardTitle>
      <CardDescription>
        {profile.resumeId
          ? 'Your resume is on file. Upload a new one, or build one from your profile.'
          : 'Upload a resume (PDF, DOC, or DOCX, up to 5MB), or build one from your profile below.'}
      </CardDescription>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {profile.resumeId && <FileCheck2 className="h-5 w-5 shrink-0 text-momentum" />}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => inputRef.current?.click()}
          disabled={uploadMutation.isPending}
        >
          <FileUp className="h-4 w-4" />
          {uploadMutation.isPending ? 'Uploading...' : 'Upload resume'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFile}
        />

        <div className="flex items-center gap-2">
          <Select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="h-9 w-32"
          >
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
          </Select>
          <Button
            size="sm"
            variant="outline"
            onClick={() => buildMutation.mutate({ template })}
            disabled={buildMutation.isPending}
          >
            <Sparkles className="h-4 w-4" />
            {buildMutation.isPending ? 'Building...' : 'Build from profile'}
          </Button>
        </div>
      </div>

      <AtsScorePanel resumeId={profile.resumeId} />
      <ResumeHistoryList activeResumeId={profile.resumeId} />
    </Card>
  );
}
