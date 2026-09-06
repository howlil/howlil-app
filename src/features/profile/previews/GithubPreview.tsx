import {ArrowUpRight} from 'lucide-react';
import {withBase} from '../../../lib/paths';
import type {GithubActivity} from '../types';

const contributionColors = [
  'var(--color-surface-muted)',
  '#0e4429',
  '#006d32',
  '#26a641',
  '#39d353',
] as const;

interface Props {
  activity: GithubActivity;
  githubHref: string;
}

export function GithubPreview({activity, githubHref}: Props) {
  const {profile, contributions, status, total, visibleContributions} = activity;

  return (
    <div className="p-4">
      <div className="flex items-center gap-2.5">
        <img
          src={profile?.avatar_url ?? withBase('/profile.webp')}
          alt=""
          className="h-10 w-10 shrink-0 rounded-full object-cover object-[center_18%]"
        />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-baseline gap-1.5">
            <strong className="truncate text-[13px] font-semibold">
              {profile?.name ?? profile?.login ?? 'howlil'}
            </strong>
            <span className="truncate text-[10px] text-[var(--color-text-muted)]">
              @{profile?.login ?? 'howlil'}
            </span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-[10px] leading-4 text-[var(--color-text-secondary)]">
            {profile?.bio ?? 'Backend systems, infrastructure, and open-source engineering.'}
          </p>
        </div>
        <a
          href={profile?.html_url ?? githubHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-[var(--color-border-strong)] px-2.5 text-[10px] font-medium text-[var(--color-text-heading)] no-underline"
        >
          Open <ArrowUpRight size={11} strokeWidth={1.8} aria-hidden="true" />
        </a>
      </div>

      {status === 'loading' && (
        <p className="mt-3 text-[10px] text-[var(--color-text-muted)]">Loading live GitHub activity…</p>
      )}

      {status === 'error' && (
        <p className="mt-3 text-[10px] leading-4 text-[var(--color-text-muted)]">
          Live activity is temporarily unavailable.
        </p>
      )}

      {status === 'ready' && profile && contributions && (
        <>
          <div className="mt-3 flex items-center gap-3 border-t border-[var(--color-border)] pt-3 text-[9px] text-[var(--color-text-secondary)]">
            <span><strong className="text-[var(--color-text-heading)]">{profile.followers}</strong> followers</span>
            <span><strong className="text-[var(--color-text-heading)]">{profile.public_repos}</strong> repos</span>
            <span><strong className="text-[var(--color-text-heading)]">{total ?? 0}</strong> contributions</span>
          </div>

          <div
            className="mt-3 overflow-x-auto pb-0.5"
            aria-label={`${total ?? 0} GitHub contributions in the last year`}
          >
            <div
              style={{
                display: 'grid',
                gridAutoFlow: 'column',
                gridTemplateRows: 'repeat(7, 0.34rem)',
                gridAutoColumns: '0.34rem',
                gap: '0.12rem',
                width: 'max-content',
              }}
            >
              {visibleContributions.map((day) => (
                <span
                  key={day.date}
                  title={`${day.count} contributions on ${day.date}`}
                  aria-hidden="true"
                  className="rounded-[2px]"
                  style={{backgroundColor: contributionColors[day.level] ?? contributionColors[0]}}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
