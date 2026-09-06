import {useCallback, useRef, useState} from 'react';
import type {ProfileId} from './types';

interface Options {
  email: string;
  onOpen?: (id: ProfileId) => void;
}

export function useProfileActionsController({email, onOpen}: Options) {
  const [activeProfile, setActiveProfile] = useState<ProfileId | null>(null);
  const [copied, setCopied] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const openProfile = useCallback((id: ProfileId) => {
    clearCloseTimer();
    setActiveProfile(id);
    onOpen?.(id);
  }, [onOpen]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setActiveProfile(null), 120);
  }, []);

  const showCopiedState = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const copyEmailFallback = () => {
    const field = document.createElement('textarea');
    field.value = email;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    const didCopy = document.execCommand('copy');
    field.remove();

    if (didCopy) showCopiedState();
    else window.location.href = `mailto:${email}`;
  };

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      showCopiedState();
    } catch {
      copyEmailFallback();
    }
  }, [email]);

  return {
    activeProfile,
    copied,
    openProfile,
    scheduleClose,
    copyEmail,
  };
}
