import { useMemo, useState } from 'react';

type PlaygroundKind = 'payment-state' | 'survey-branch' | 'failure-boundary';

interface CaseStudyPlaygroundProps {
  kind: PlaygroundKind;
}

const buttonClass =
  'site-ui min-h-10 border border-gray-300 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

function Panel({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className='border-t border-gray-200 pt-3'>
      <p className='site-ui text-xs font-medium uppercase tracking-[0.12em] text-gray-500'>{label}</p>
      <p className='site-ui mt-1 text-sm font-semibold text-gray-900'>{value}</p>
      {detail && <p className='site-ui mt-1 text-sm leading-6 text-gray-600'>{detail}</p>}
    </div>
  );
}

function PaymentStateSimulator() {
  const [payment, setPayment] = useState<'PENDING' | 'PAID' | 'EXPIRED'>('PENDING');
  const [order, setOrder] = useState<'PENDING' | 'CONFIRMED'>('PENDING');
  const [message, setMessage] = useState('Create an event to inspect how the persisted state responds.');

  const reset = () => {
    setPayment('PENDING');
    setOrder('PENDING');
    setMessage('State reset. The next provider callback starts from PENDING.');
  };

  const paid = () => {
    if (payment === 'PAID') {
      setMessage('Duplicate callback: payment is already PAID, so the handler performs no second fulfillment.');
      return;
    }
    if (payment === 'EXPIRED') {
      setMessage('Late paid callback rejected: this simplified model does not regress an already-final EXPIRED state.');
      return;
    }
    setPayment('PAID');
    setOrder('CONFIRMED');
    setMessage('Valid transition persisted first; confirmation can run after the durable state reflects PAID.');
  };

  const expire = () => {
    if (payment !== 'PENDING') {
      setMessage(`Late expiry callback ignored because ${payment} is already a final payment state.`);
      return;
    }
    setPayment('EXPIRED');
    setMessage('Payment moved to EXPIRED while the business order remains present instead of disappearing.');
  };

  return (
    <InteractiveShell eyebrow='State simulator' title='Payment callbacks are deliveries, not a continuation of checkout'>
      <div className='grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.7fr)]'>
        <div>
          <div className='grid grid-cols-2 gap-3'>
            <Panel label='Order' value={order} />
            <Panel label='Payment' value={payment} />
          </div>
          <p className='site-ui mt-5 min-h-16 border-l-2 border-gray-300 pl-4 text-sm leading-6 text-gray-700' aria-live='polite'>
            {message}
          </p>
        </div>
        <div className='grid content-start gap-2' aria-label='Payment callback events'>
          <button className={buttonClass} type='button' onClick={paid}>PAYMENT_PAID</button>
          <button className={buttonClass} type='button' onClick={paid}>DUPLICATE_CALLBACK</button>
          <button className={buttonClass} type='button' onClick={expire}>PAYMENT_EXPIRED</button>
          <button className={buttonClass} type='button' onClick={reset}>RESET</button>
        </div>
      </div>
    </InteractiveShell>
  );
}

function SurveyBranchExplorer() {
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);
  const path = answer === 'yes' ? ['Q1', 'Q2', 'Q4'] : answer === 'no' ? ['Q1', 'Q5', 'Q8'] : ['Q1'];
  const next = answer === 'yes'
    ? 'Q2 — Which company do you work for?'
    : answer === 'no'
      ? 'Q5 — Why are you currently not employed?'
      : 'Choose an answer to traverse the persisted survey graph.';

  return (
    <InteractiveShell eyebrow='Flow explorer' title='Branching rules behave like a graph stored as data'>
      <div className='grid gap-6 md:grid-cols-[minmax(0,1fr)_14rem]'>
        <div>
          <p className='site-ui text-sm font-semibold text-gray-900'>Q1 — Are you currently employed?</p>
          <div className='mt-3 grid gap-2 sm:grid-cols-2'>
            <button type='button' onClick={() => setAnswer('yes')} aria-pressed={answer === 'yes'} className={`${buttonClass} ${answer === 'yes' ? 'border-gray-900 text-gray-900' : ''}`}>Yes</button>
            <button type='button' onClick={() => setAnswer('no')} aria-pressed={answer === 'no'} className={`${buttonClass} ${answer === 'no' ? 'border-gray-900 text-gray-900' : ''}`}>No</button>
          </div>
          <div className='mt-5 border-t border-gray-200 pt-4' aria-live='polite'>
            <p className='site-ui text-xs font-medium uppercase tracking-[0.12em] text-gray-500'>Server-approved next node</p>
            <p className='site-ui mt-2 text-sm leading-6 text-gray-800'>{next}</p>
          </div>
        </div>
        <div className='border-l border-gray-200 pl-5'>
          <p className='site-ui text-xs font-medium uppercase tracking-[0.12em] text-gray-500'>Current path</p>
          <ol className='site-ui mt-3 space-y-2 text-sm text-gray-700'>
            {path.map((node, index) => (
              <li key={node} className='flex items-center gap-2'>
                <span className='font-mono text-xs text-gray-400'>{String(index + 1).padStart(2, '0')}</span>
                <span>{node}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </InteractiveShell>
  );
}

type Boundary = 'healthy' | 'compute' | 'database' | 'storage' | 'analysis';

const boundaryCopy: Record<Boundary, { title: string; impact: string; preserved: string }> = {
  healthy: {
    title: 'All boundaries healthy',
    impact: 'HTTP compute, relational state, object storage, and analysis are all available.',
    preserved: 'The useful property is ownership: each kind of state already has a clear durable home.',
  },
  compute: {
    title: 'Cloud Run unavailable',
    impact: 'New HTTP requests cannot be served until compute recovers or another instance becomes available.',
    preserved: 'PostgreSQL records and GCS objects remain durable because the container does not own them.',
  },
  database: {
    title: 'PostgreSQL unavailable',
    impact: 'State-changing and relational reads fail; the API should surface dependency failure rather than inventing state.',
    preserved: 'Uploaded objects remain in GCS and replaceable compute can restart without data migration from local disk.',
  },
  storage: {
    title: 'GCS unavailable',
    impact: 'Upload/download operations fail while relational records can still describe existing domain state.',
    preserved: 'Application compute and PostgreSQL are separate failure domains.',
  },
  analysis: {
    title: 'Analysis service unavailable',
    impact: 'New derived analysis cannot complete through that boundary.',
    preserved: 'Accounts, existing records, and uploaded assets remain owned by the API, PostgreSQL, and GCS.',
  },
};

function FailureBoundaryExplorer() {
  const [failed, setFailed] = useState<Boundary>('healthy');
  const selected = useMemo(() => boundaryCopy[failed], [failed]);

  return (
    <InteractiveShell eyebrow='Failure explorer' title='Replaceable compute should not own durable state'>
      <div className='grid gap-6 md:grid-cols-[15rem_minmax(0,1fr)]'>
        <div className='grid content-start gap-2'>
          {([
            ['healthy', 'All healthy'],
            ['compute', 'Fail Cloud Run'],
            ['database', 'Fail PostgreSQL'],
            ['storage', 'Fail GCS'],
            ['analysis', 'Fail analysis'],
          ] as Array<[Boundary, string]>).map(([value, label]) => (
            <button
              key={value}
              type='button'
              onClick={() => setFailed(value)}
              aria-pressed={failed === value}
              className={`${buttonClass} ${failed === value ? 'border-gray-900 text-gray-900' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div aria-live='polite'>
          <p className='site-ui text-base font-semibold text-gray-900'>{selected.title}</p>
          <div className='mt-4 grid gap-4 sm:grid-cols-2'>
            <Panel label='Impact' value='Unavailable behavior' detail={selected.impact} />
            <Panel label='Preserved' value='Isolation boundary' detail={selected.preserved} />
          </div>
        </div>
      </div>
    </InteractiveShell>
  );
}

function InteractiveShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className='not-prose my-10 border-y border-gray-200 py-6' aria-label={title}>
      <div className='mb-6'>
        <p className='site-ui text-xs font-medium uppercase tracking-[0.14em] text-gray-500'>{eyebrow}</p>
        <h2 className='mt-1 max-w-2xl text-lg font-semibold tracking-tight text-gray-900'>{title}</h2>
        <p className='site-ui mt-2 max-w-2xl text-sm leading-6 text-gray-500'>
          Simplified, deterministic model of the engineering boundary described in this case study—not a live production system.
        </p>
      </div>
      {children}
    </section>
  );
}

export default function CaseStudyPlayground({ kind }: CaseStudyPlaygroundProps) {
  if (kind === 'payment-state') return <PaymentStateSimulator />;
  if (kind === 'survey-branch') return <SurveyBranchExplorer />;
  return <FailureBoundaryExplorer />;
}
