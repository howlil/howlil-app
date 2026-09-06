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

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      showCopiedState();
    } catch {
      window.location.href = `mailto:${email}`;
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
