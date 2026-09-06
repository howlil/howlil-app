export type ProfileId = 'github' | 'linkedin' | 'x' | 'resume';

export type GithubStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface GithubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  public_repos: number;
  html_url: string;
}

export interface GithubContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GithubContributionResponse {
  total: Record<string, number>;
  contributions: GithubContribution[];
}

export interface GithubActivity {
  profile: GithubProfile | null;
  contributions: GithubContributionResponse | null;
  status: GithubStatus;
  total: number | null;
  visibleContributions: GithubContribution[];
}

export interface ProfileActionsProps {
  email: string;
  githubHref: string;
  linkedInHref?: string;
  xHref?: string;
  resumeHref: string;
}
