/** @format */

import {useCallback} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {FileText} from 'lucide-react';
import {FaGithub, FaLinkedinIn, FaXTwitter} from 'react-icons/fa6';
import {ProfilePreview} from './ProfilePreview';
import {useGithubActivity} from './useGithubActivity';
import {useProfileActionsController} from './useProfileActionsController';
import type {ProfileActionsProps, ProfileId} from './types';

export default function ProfileActions({
  email,
  githubHref,
  linkedInHref,
  xHref,
  resumeHref,
}: ProfileActionsProps) {
  const reduceMotion = useReducedMotion();
  const githubActivity = useGithubActivity();
  const handleOpen = useCallback((id: ProfileId) => {
    if (id === 'github') void githubActivity.load();
  }, [githubActivity.load]);
  const {
    activeProfile,
    copied,
    openProfile,
    scheduleClose,
    copyEmail,
  } = useProfileActionsController({email, onOpen: handleOpen});

  const items = [
    {id: 'github' as const, href: githubHref, label: 'GitHub', Icon: FaGithub},
    ...(linkedInHref ? [{id: 'linkedin' as const, href: linkedInHref, label: 'LinkedIn', Icon: FaLinkedinIn}] : []),
    ...(xHref ? [{id: 'x' as const, href: xHref, label: 'X', Icon: FaXTwitter}] : []),
    {id: 'resume' as const, href: resumeHref, label: 'Resume', Icon: FileText},
  ];
  const activeItem = items.find((item) => item.id === activeProfile);
  const previewWidth = activeProfile === 'github'
    ? 'w-[26.5rem]'
    : activeProfile === 'linkedin' || activeProfile === 'x' || activeProfile === 'resume'
      ? 'w-[21.5rem]'
      : 'w-[27rem]';
  const previewCardClass = [
    'absolute bottom-[calc(100%+0.75rem)] left-0 z-20 max-w-[calc(100vw-2rem)] overflow-hidden',
    'rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-heading)]',
    'shadow-[0_24px_64px_rgba(0,0,0,0.22)]',
    previewWidth,
  ].join(' ');

  return (
    <div className="profile-actions-root">
      <AnimatePresence>
        {activeItem && (
          <motion.div
            key={activeItem.id}
            id="social-profile-preview"
            data-social-preview={activeItem.id}
            className={previewCardClass}
            role="group"
            aria-label={`${activeItem.label} profile preview`}
            onMouseEnter={() => openProfile(activeItem.id)}
            onMouseLeave={scheduleClose}
            initial={reduceMotion ? false : {opacity: 0, y: 10, scale: 0.97}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={reduceMotion ? {opacity: 0} : {opacity: 0, y: 6, scale: 0.98}}
            transition={{duration: reduceMotion ? 0.01 : 0.18, ease: [0.22, 1, 0.36, 1]}}
          >
            <ProfilePreview
              id={activeItem.id}
              githubActivity={githubActivity}
              githubHref={githubHref}
              linkedInHref={linkedInHref}
              xHref={xHref}
              resumeHref={resumeHref}
              reduceMotion={reduceMotion}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="portfolio-actions" aria-label="Profile actions">
        <motion.button
          type="button"
          className="copy-contact-button"
          aria-label={copied ? 'Email copied' : 'Copy my email'}
          data-copied={copied ? 'true' : undefined}
          onClick={copyEmail}
          whileHover={reduceMotion ? undefined : {y: -1}}
          whileTap={reduceMotion ? undefined : {scale: 0.97}}
        >
          <span data-default>Copy my email</span>
          <span data-success aria-live="polite">Email copied!</span>
        </motion.button>

        {items.map(({id, href, label, Icon}) => (
          <motion.a
            key={id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-social-link"
            aria-label={label}
            aria-describedby={activeProfile === id ? 'social-profile-preview' : undefined}
            onMouseEnter={() => openProfile(id)}
            onMouseLeave={scheduleClose}
            onFocus={() => openProfile(id)}
            onBlur={scheduleClose}
            whileHover={reduceMotion ? undefined : {y: -2, scale: 1.06}}
            whileTap={reduceMotion ? undefined : {scale: 0.92}}
            transition={{type: 'spring', stiffness: 430, damping: 28}}
          >
            {id === 'resume'
              ? <FileText size={23} strokeWidth={1.8} aria-hidden="true" />
              : <Icon size={22} aria-hidden="true" />}
          </motion.a>
        ))}
      </div>
    </div>
  );
}
