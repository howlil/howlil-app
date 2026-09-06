import {withBase} from '../../../lib/paths';

interface Props {
  href: string;
}

export function XPreview({href}: Props) {
  return (
    <div className="relative overflow-hidden bg-[#1c1b1a] text-white">
      <div
        className="h-16"
        aria-hidden="true"
        style={{background: 'linear-gradient(125deg, #34302e 0%, #262321 52%, #4a403b 100%)'}}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-55 blur-2xl"
        aria-hidden="true"
        style={{background: 'radial-gradient(circle at 80% 15%, rgba(194,164,148,.34), transparent 52%)'}}
      />
      <div
        className="relative px-4 pb-4 pt-8"
        style={{background: 'linear-gradient(180deg, rgba(42,39,37,.86) 0%, rgba(28,27,26,1) 58%)'}}
      >
        <img
          src={withBase('/profile.webp')}
          alt=""
          className="absolute left-4 top-0 h-14 w-14 -translate-y-1/2 rounded-full border-[3px] border-[#23211f] object-cover object-[center_18%] shadow-[0_5px_18px_rgba(0,0,0,.24)]"
        />
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-4 top-2.5 inline-flex min-h-8 items-center justify-center rounded-full bg-[#f7f7f5] px-3.5 text-[11px] font-semibold text-[#111] no-underline shadow-[0_4px_14px_rgba(0,0,0,.18)] transition-transform hover:-translate-y-px"
        >
          Follow
        </a>
        <div className="pr-[4.75rem]">
          <strong className="block text-[15px] font-semibold tracking-[-0.02em] text-white">@howlildev</strong>
          <p className="mt-1 max-w-[27ch] text-[11px] leading-[1.5] text-[#bbb4ad]">
            Backend systems, infrastructure, open source, and what I’m learning while building software.
          </p>
        </div>
      </div>
    </div>
  );
}
