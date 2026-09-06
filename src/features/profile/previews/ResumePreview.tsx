import {motion} from 'motion/react';
import {ArrowUpRight, FileText} from 'lucide-react';

interface Props {
  href: string;
  reduceMotion: boolean | null;
}

export function ResumePreview({href, reduceMotion}: Props) {
  return (
    <div
      className="relative overflow-hidden p-3.5"
      style={{
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-surface-muted) 90%, #e9ecef) 0%, var(--color-surface) 76%)',
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[var(--color-surface)] shadow-sm ring-1 ring-[var(--color-border)]">
            <FileText size={14} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <strong className="block truncate text-[11px] font-semibold">Resume</strong>
            <span className="block text-[9px] text-[var(--color-text-muted)]">PDF document</span>
          </div>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[9px] font-medium text-[var(--color-text-heading)] no-underline shadow-sm"
        >
          Open <ArrowUpRight size={10} strokeWidth={1.9} aria-hidden="true" />
        </a>
      </div>

      <div
        className="relative h-[13.5rem] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface-muted)_88%,transparent)] shadow-inner"
        aria-label="Stacked resume document preview"
      >
        <div
          className="pointer-events-none absolute inset-x-8 top-5 h-[17rem] rounded-[7px] border border-black/[0.04] bg-gradient-to-b from-[#efefec] to-[#e4e4e0] shadow-[0_14px_34px_rgba(0,0,0,.08)]"
          style={{transform: 'rotate(-4deg) translateY(4px) scale(.93)', transformOrigin: 'top center'}}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-7 top-4 h-[17.5rem] rounded-[7px] border border-black/[0.05] bg-gradient-to-b from-[#f7f7f4] to-[#ecece8] shadow-[0_16px_38px_rgba(0,0,0,.1)]"
          style={{transform: 'rotate(3deg) translateY(2px) scale(.965)', transformOrigin: 'top center'}}
          aria-hidden="true"
        />

        <motion.div
          className="absolute left-1/2 top-4 h-[18.5rem] w-[14.25rem] -translate-x-1/2 rounded-[7px] border border-black/[0.05] bg-gradient-to-b from-[#fff] to-[#f8f8f6] px-4 pb-6 pt-4 text-[#252623] shadow-[0_20px_46px_rgba(0,0,0,.18)]"
          aria-hidden="true"
          animate={reduceMotion ? undefined : {y: [0, -3, 0]}}
          transition={reduceMotion ? undefined : {duration: 4.2, repeat: Infinity, ease: 'easeInOut'}}
        >
          <div className="border-b border-[#e5e6e2] pb-3">
            <div className="text-[9px] font-bold leading-none tracking-[-0.02em]">Mhd Ulil Abshar</div>
            <div className="mt-1.5 text-[5.5px] leading-none text-[#74776f]">Software Engineer · Backend & Infrastructure</div>
          </div>

          <div className="mt-3 text-[5px] font-semibold uppercase tracking-[0.15em] text-[#666a62]">Experience</div>
          <div className="mt-2 space-y-1.5">
            <span className="block h-[4px] w-[92%] rounded-full bg-[#d4d7d1]" />
            <span className="block h-[4px] w-full rounded-full bg-[#e7e8e4]" />
            <span className="block h-[4px] w-[78%] rounded-full bg-[#e7e8e4]" />
          </div>

          <div className="mt-4 text-[5px] font-semibold uppercase tracking-[0.15em] text-[#666a62]">Projects</div>
          <div className="mt-2 space-y-1.5">
            <span className="block h-[4px] w-[94%] rounded-full bg-[#d4d7d1]" />
            <span className="block h-[4px] w-[84%] rounded-full bg-[#e7e8e4]" />
          </div>
        </motion.div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-surface-muted) 96%, transparent) 84%)',
          }}
        />
      </div>
    </div>
  );
}
