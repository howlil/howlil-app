import {describe, expect, it, vi} from 'vitest';
import {
  countGithubContributions,
  fetchGithubActivity,
} from '../../src/features/profile/githubClient';

function jsonResponse(body: unknown, ok = true): Response {
  return {
    ok,
    json: async () => body,
  } as Response;
}

describe('GitHub activity client', () => {
  it('loads profile and contribution data through one boundary', async () => {
    const fetchImpl = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({
        login: 'howlil',
        name: 'Mhd Ulil Abshar',
        avatar_url: 'avatar',
        bio: 'bio',
        followers: 10,
        public_repos: 20,
        html_url: 'https://github.com/howlil',
      }))
      .mockResolvedValueOnce(jsonResponse({
        total: {lastYear: 42},
        contributions: [],
      }));

    const result = await fetchGithubActivity({fetchImpl, username: 'howlil'});

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(result.profile.login).toBe('howlil');
    expect(countGithubContributions(result.contributions)).toBe(42);
  });

  it('fails the combined activity request when either upstream fails', async () => {
    const fetchImpl = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({}, false))
      .mockResolvedValueOnce(jsonResponse({total: {}, contributions: []}));

    await expect(fetchGithubActivity({fetchImpl})).rejects.toThrow('GitHub activity request failed');
  });
});
