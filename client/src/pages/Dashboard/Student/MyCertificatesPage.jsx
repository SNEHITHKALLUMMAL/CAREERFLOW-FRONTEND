import { Award, Download } from 'lucide-react';
import { useMyCertificates } from '@/hooks/useCertificates';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

export function MyCertificatesPage() {
  const { data: certificates, isLoading } = useMyCertificates();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">My certificates</h1>
        <p className="text-mist">Earned by passing assessments.</p>
      </div>

      {isLoading && <p className="text-mist">Loading certificates...</p>}

      {!isLoading && certificates?.length === 0 && (
        <Card>
          <CardDescription>
            No certificates yet — pass an assessment to earn your first one.
          </CardDescription>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {certificates?.map((certificate) => (
          <Card key={certificate._id}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-momentum-light text-momentum dark:bg-momentum/15">
              <Award className="h-5 w-5" />
            </span>
            <CardTitle className="mt-3">{certificate.title}</CardTitle>
            <CardDescription>
              Issued {new Date(certificate.issuedAt).toLocaleDateString()}
            </CardDescription>
            <a
              href={certificate.certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center gap-1.5 text-sm font-medium text-signal hover:underline"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
