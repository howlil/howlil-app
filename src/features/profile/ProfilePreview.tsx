import type {GithubActivity, ProfileId} from './types';
import {GithubPreview} from './previews/GithubPreview';
import {LinkedInPreview} from './previews/LinkedInPreview';
import {ResumePreview} from './previews/ResumePreview';
import {XPreview} from './previews/XPreview';

interface Props {
  id: ProfileId;
  githubActivity: GithubActivity;
  githubHref: string;
  linkedInHref?: string;
  xHref?: string;
  resumeHref: string;
  reduceMotion: boolean | null;
}

export function ProfilePreview({
  id,
  githubActivity,
  githubHref,
  linkedInHref,
  xHref,
  resumeHref,
  reduceMotion,
}: Props) {
  switch (id) {
    case 'github':
      return <GithubPreview activity={githubActivity} githubHref={githubHref} />;
    case 'linkedin':
      return linkedInHref ? <LinkedInPreview href={linkedInHref} /> : null;
    case 'x':
      return xHref ? <XPreview href={xHref} /> : null;
    case 'resume':
      return <ResumePreview href={resumeHref} reduceMotion={reduceMotion} />;
  }
}
