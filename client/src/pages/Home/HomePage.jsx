import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, FileCheck2, BrainCircuit, Users2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

const readinessSteps = [
  { label: 'Profile completed', delay: 0 },
  { label: 'Resume scored — 84% ATS', delay: 0.15 },
  { label: 'Skills verified', delay: 0.3 },
  { label: 'Mock interview practiced', delay: 0.45 },
  { label: 'Placement ready', delay: 0.6, isFinal: true },
];

const features = [
  {
    icon: BrainCircuit,
    title: 'AI skill-gap analysis',
    description:
      'Compare your profile against real job requirements and get a personalized learning roadmap.',
  },
  {
    icon: FileCheck2,
    title: 'Resume built for ATS',
    description:
      'Upload or build your resume and get an ATS score with concrete keyword and grammar fixes.',
  },
  {
    icon: Users2,
    title: 'Mentors & mock interviews',
    description: 'Book sessions with mentors and practice interviews before the real thing.',
  },
];

function ReadinessCard() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Card className="w-full max-w-sm">
      <CardTitle>Your placement journey</CardTitle>
      <CardDescription>What CareerFlow tracks for you, end to end.</CardDescription>
      <ul className="mt-5 space-y-3">
        {readinessSteps.map((step) => (
          <motion.li
            key={step.label}
            initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.4 + step.delay, duration: 0.4 }}
            className="flex items-center gap-3 text-sm"
          >
            <span
              className={
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-mono ' +
                (step.isFinal
                  ? 'bg-momentum text-white'
                  : 'bg-momentum-light text-momentum-dark dark:bg-momentum/20 dark:text-momentum')
              }
            >
              ✓
            </span>
            <span
              className={step.isFinal ? 'font-medium text-momentum-dark dark:text-momentum' : ''}
            >
              {step.label}
            </span>
          </motion.li>
        ))}
      </ul>
    </Card>
  );
}

export function HomePage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden">
      <div className="mesh-backdrop pointer-events-none absolute inset-0" aria-hidden="true" />

      <section className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 pb-24 pt-16 lg:flex-row lg:items-center lg:pt-24">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-signal">
            For IT students, built different
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            Turn your skills into an offer letter.
          </h1>
          <p className="mt-5 text-lg text-mist">
            CareerFlow tracks your employability in real time, closes your skill gaps with AI, and
            gets your resume past the filters recruiters use.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg">
              Get started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              See how it works
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <ReadinessCard />
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="transition-transform hover:-translate-y-1">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-light text-signal dark:bg-signal/15 dark:text-signal">
                <Icon className="h-5 w-5" />
              </span>
              <CardTitle className="mt-4">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
