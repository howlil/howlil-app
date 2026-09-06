import {useCallback, useRef, useState} from 'react';
import {countGithubContributions, fetchGithubActivity} from './githubClient';
import type {
  GithubContributionResponse,
  GithubProfile,
  GithubStatus,
} from './types';

export function useGithubActivity() {
  const [profile, setProfile] = useState<GithubProfile | null>(null);
  const [contributions, setContributions] = useState<GithubContributionResponse | null>(null);
  const [status, setStatus] = useState<GithubStatus>('idle');
  const requested = useRef(false);

  const load = useCallback(async () => {
    if (requested.current) return;
    requested.current = true;
    setStatus('loading');

    try {
      const activity = await fetchGithubActivity();
      setProfile(activity.profile);
      setContributions(activity.contributions);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  return {
    profile,
    contributions,
    status,
    total: countGithubContributions(contributions),
    visibleContributions: contributions?.contributions.slice(-364) ?? [],
    load,
  };
}
