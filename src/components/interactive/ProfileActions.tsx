/** @format */

import {useState} from "react";
import {AnimatePresence, motion, useReducedMotion} from "motion/react";
import {FileText} from "lucide-react";
import {FaGithub, FaLinkedinIn, FaXTwitter} from "react-icons/fa6";
import {withBase} from "../../lib/paths";

type ProfileId = "github" | "linkedin" | "x" | "resume";

interface Props {
  email: string;
  githubHref: string;
  linkedInHref?: string;
  xHref?: string;
  resumeHref: string;
}

const profileCards: Record<ProfileId, {title: string; subtitle: string; action: string}> = {
  github: {title: "howlil", subtitle: "Contribution calendar · open GitHub for live activity", action: "Open GitHub"},
  linkedin: {title: "Mhd Ulil Abshar", subtitle: "Software Engineer · Backend & Infrastructure", action: "View LinkedIn"},
  x: {title: "@howlildev", subtitle: "Backend systems, infrastructure, and what I’m learning.", action: "Open X"},
  resume: {title: "Resume", subtitle: "Experience, education, and selected engineering work.", action: "Open resume"},
};

export default function ProfileActions({email, githubHref, linkedInHref, xHref, resumeHref}: Props) {
  const [activeProfile, setActiveProfile] = useState<ProfileId | null>(null);
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  const items = [
    {id: "github" as const, href: githubHref, label: "GitHub", Icon: FaGithub},
    ...(linkedInHref ? [{id: "linkedin" as const, href: linkedInHref, label: "LinkedIn", Icon: FaLinkedinIn}] : []),
    ...(xHref ? [{id: "x" as const, href: xHref, label: "X", Icon: FaXTwitter}] : []),
    {id: "resume" as const, href: resumeHref, label: "Resume", Icon: FileText},
  ];

  const activeItem = items.find((item) => item.id === activeProfile);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="profile-actions-root">
      <AnimatePresence>
        {activeItem && (
          <motion.div
            key={activeItem.id}
            id="social-profile-preview"
            className="social-hover-card"
            role="group"
            aria-label={`${activeItem.label} profile preview`}
            initial={reduceMotion ? false : {opacity: 0, y: 10, scale: 0.97}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={reduceMotion ? {opacity: 0} : {opacity: 0, y: 6, scale: 0.98}}
            transition={{duration: reduceMotion ? 0.01 : 0.18, ease: [0.22, 1, 0.36, 1]}}
          >
            <div className="social-card-profile">
              <img src={withBase("/profile.webp")} alt="" />
              <span>
                <strong>{profileCards[activeItem.id].title}</strong>
                <small>{profileCards[activeItem.id].subtitle}</small>
              </span>
              <em>{profileCards[activeItem.id].action} ↗</em>
            </div>

            {activeItem.id === "github" && (
              <div className="contribution-preview" aria-label="GitHub contribution calendar preview">
                {Array.from({length: 364}, (_, index) => <span key={index} aria-hidden="true" />)}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="portfolio-actions" aria-label="Profile actions">
        <motion.button
          type="button"
          className="copy-contact-button"
          aria-label={copied ? "Email copied" : "Copy my email"}
          data-copied={copied ? "true" : undefined}
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
            aria-describedby={activeProfile === id ? "social-profile-preview" : undefined}
            onHoverStart={() => setActiveProfile(id)}
            onHoverEnd={() => setActiveProfile(null)}
            onFocus={() => setActiveProfile(id)}
            onBlur={() => setActiveProfile(null)}
            whileHover={reduceMotion ? undefined : {y: -2, scale: 1.06}}
            whileTap={reduceMotion ? undefined : {scale: 0.92}}
            transition={{type: "spring", stiffness: 430, damping: 28}}
          >
            {id === "resume"
              ? <FileText size={23} strokeWidth={1.8} aria-hidden="true" />
              : <Icon size={22} aria-hidden="true" />}
          </motion.a>
        ))}
      </div>
    </div>
  );
}
