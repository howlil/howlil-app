import type {
  GithubContributionResponse,
  GithubProfile,
} from './types';

export interface GithubActivityResult {
  profile: GithubProfile;
  contributions: GithubContributionResponse;
}

interface Options {
  username?: string;
  fetchImpl?: typeof fetch;
}

export async function fetchGithubActivity({
  username = 'howlil',
  fetchImpl = fetch,
}: Options = {}): Promise<GithubActivityResult> {
  const [profileResponse, contributionResponse] = await Promise.all([
    fetchImpl(`https://api.github.com/users/${username}`, {
      headers: {Accept: 'application/vnd.github+json'},
    }),
    fetchImpl(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`),
  ]);

  if (!profileResponse.ok || !contributionResponse.ok) {
    throw new Error('GitHub activity request failed');
  }

  const [profile, contributions] = await Promise.all([
    profileResponse.json() as Promise<GithubProfile>,
    contributionResponse.json() as Promise<GithubContributionResponse>,
  ]);

  return {profile, contributions};
}

export function countGithubContributions(
  contributions: GithubContributionResponse | null,
): number | null {
  if (!contributions) return null;
  return Object.values(contributions.total).reduce((sum, value) => sum + value, 0);
}
