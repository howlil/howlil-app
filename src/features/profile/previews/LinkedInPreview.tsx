import {ArrowUpRight} from 'lucide-react';
import {withBase} from '../../../lib/paths';

interface Props {
  href: string;
}

export function LinkedInPreview({href}: Props) {
  return (
    <div className="relative overflow-hidden bg-[var(--color-surface)]">
      <div
        className="h-14"
        aria-hidden="true"
        style={{background: 'linear-gradient(118deg, #0A66C2 0%, #1b7bd3 48%, #89b9e8 100%)'}}
      />
      <div
        className="absolute inset-x-0 top-0 h-28 opacity-40 blur-2xl"
        aria-hidden="true"
        style={{background: 'radial-gradient(circle at 75% 20%, rgba(255,255,255,.7), transparent 54%)'}}
      />
      <div className="relative px-4 pb-4">
        <img
          src={withBase('/profile.webp')}
          alt=""
          className="-mt-7 h-14 w-14 rounded-full border-[3px] border-[var(--color-surface)] object-cover object-[center_18%]"
        />
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-4 top-3 inline-flex min-h-8 items-center gap-1 rounded-full bg-[#0A66C2] px-3 text-[11px] font-semibold text-white no-underline shadow-[0_4px_14px_rgba(10,102,194,.22)] transition-transform hover:-translate-y-px"
        >
          Connect <ArrowUpRight size={11} strokeWidth={1.9} aria-hidden="true" />
        </a>
        <div className="mt-2 min-w-0 pr-[5.5rem]">
          <strong className="block truncate text-[15px] font-semibold tracking-[-0.02em]">Mhd Ulil Abshar</strong>
          <p className="mt-0.5 text-[11px] leading-[1.45] text-[var(--color-text-secondary)]">
            Software Engineer · Backend & Infrastructure
          </p>
          <p className="mt-0.5 text-[10px] leading-4 text-[var(--color-text-muted)]">Indonesia · Remote</p>
        </div>
      </div>
    </div>
  );
}
