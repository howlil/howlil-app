/** @format */

import {useRef, useState} from "react";
import {AnimatePresence, motion, useReducedMotion} from "motion/react";
import {ArrowUpRight, FileText} from "lucide-react";
import {FaGithub, FaLinkedinIn, FaXTwitter} from "react-icons/fa6";
import {withBase} from "../../lib/paths";

type ProfileId = "github" | "linkedin" | "x" | "resume";

type GithubProfile = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  public_repos: number;
  html_url: string;
};

type GithubContribution = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type GithubContributionResponse = {
  total: Record<string, number>;
  contributions: GithubContribution[];
};

interface Props {
  email: string;
  githubHref: string;
  linkedInHref?: string;
  xHref?: string;
  resumeHref: string;
}

const contributionColors = [
  "var(--color-surface-muted)",
  "#0e4429",
  "#006d32",
  "#26a641",
  "#39d353",
];

export default function ProfileActions({email, githubHref, linkedInHref, xHref, resumeHref}: Props) {
  const [activeProfile, setActiveProfile] = useState<ProfileId | null>(null);
  const [copied, setCopied] = useState(false);
  const [githubProfile, setGithubProfile] = useState<GithubProfile | null>(null);
  const [githubContributions, setGithubContributions] = useState<GithubContributionResponse | null>(null);
  const [githubStatus, setGithubStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const githubRequested = useRef(false);
  const closeTimer = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const items = [
    {id: "github" as const, href: githubHref, label: "GitHub", Icon: FaGithub},
    ...(linkedInHref ? [{id: "linkedin" as const, href: linkedInHref, label: "LinkedIn", Icon: FaLinkedinIn}] : []),
    ...(xHref ? [{id: "x" as const, href: xHref, label: "X", Icon: FaXTwitter}] : []),
    {id: "resume" as const, href: resumeHref, label: "Resume", Icon: FileText},
  ];

  const activeItem = items.find((item) => item.id === activeProfile);
  const githubTotal = githubContributions
    ? Object.values(githubContributions.total).reduce((sum, value) => sum + value, 0)
    : null;
  const visibleContributions = githubContributions?.contributions.slice(-364) ?? [];

  const loadGithub = async () => {
    if (githubRequested.current) return;
    githubRequested.current = true;
    setGithubStatus("loading");

    try {
      const [profileResponse, contributionResponse] = await Promise.all([
        fetch("https://api.github.com/users/howlil", {
          headers: {Accept: "application/vnd.github+json"},
        }),
        fetch("https://github-contributions-api.jogruber.de/v4/howlil?y=last"),
      ]);

      if (!profileResponse.ok || !contributionResponse.ok) throw new Error("GitHub profile request failed");

      const [profile, contributions] = await Promise.all([
        profileResponse.json() as Promise<GithubProfile>,
        contributionResponse.json() as Promise<GithubContributionResponse>,
      ]);

      setGithubProfile(profile);
      setGithubContributions(contributions);
      setGithubStatus("ready");
    } catch {
      setGithubStatus("error");
    }
  };

  const openProfile = (id: ProfileId) => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
    setActiveProfile(id);
    if (id === "github") void loadGithub();
  };

  const scheduleClose = () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActiveProfile(null), 120);
  };

  const showCopiedState = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const copyEmailFallback = () => {
    const field = document.createElement("textarea");
    field.value = email;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const didCopy = document.execCommand("copy");
    field.remove();

    if (didCopy) showCopiedState();
    else window.location.href = `mailto:${email}`;
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      showCopiedState();
    } catch {
      copyEmailFallback();
    }
  };

  const previewCardClass = [
    "absolute bottom-[calc(100%+0.75rem)] left-0 z-20 max-w-[calc(100vw-2rem)] overflow-hidden",
    "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-heading)]",
    "shadow-[0_24px_64px_rgba(0,0,0,0.22)]",
    activeProfile === "github" ? "w-[34rem]" : "w-[27rem]",
  ].join(" ");

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
            {activeItem.id === "github" && (
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <img
                    src={githubProfile?.avatar_url ?? withBase("/profile.webp")}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-full object-cover object-[center_18%]"
                  />
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-[15px] font-semibold">
                      {githubProfile?.name ?? githubProfile?.login ?? "howlil"}
                    </strong>
                    <p className="mt-0.5 line-clamp-2 text-[12px] leading-5 text-[var(--color-text-secondary)]">
                      {githubProfile?.bio ?? "Backend systems, infrastructure, and open-source engineering."}
                    </p>
                  </div>
                  <a
                    href={githubProfile?.html_url ?? githubHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--color-border-strong)] px-3 py-2 text-[11px] font-medium text-[var(--color-text-heading)] no-underline"
                  >
                    Open GitHub <ArrowUpRight size={13} strokeWidth={1.8} aria-hidden="true" />
                  </a>
                </div>

                {githubStatus === "loading" && (
                  <p className="mt-5 text-[12px] text-[var(--color-text-muted)]">Loading live GitHub activity…</p>
                )}

                {githubStatus === "error" && (
                  <p className="mt-5 text-[12px] text-[var(--color-text-muted)]">GitHub activity is temporarily unavailable. The profile link still opens live data.</p>
                )}

                {githubStatus === "ready" && githubProfile && githubContributions && (
                  <>
                    <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[var(--color-border)] pt-4 text-[11px] text-[var(--color-text-secondary)]">
                      <span><strong className="text-[var(--color-text-heading)]">{githubProfile.followers}</strong> followers</span>
                      <span><strong className="text-[var(--color-text-heading)]">{githubProfile.public_repos}</strong> repos</span>
                      <span><strong className="text-[var(--color-text-heading)]">{githubTotal ?? 0}</strong> contributions</span>
                    </div>

                    <div className="mt-4 overflow-x-auto pb-1" aria-label={`${githubTotal ?? 0} GitHub contributions in the last year`}>
                      <div
                        style={{
                          display: "grid",
                          gridAutoFlow: "column",
                          gridTemplateRows: "repeat(7, 0.42rem)",
                          gridAutoColumns: "0.42rem",
                          gap: "0.16rem",
                          width: "max-content",
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
            )}

            {activeItem.id === "linkedin" && linkedInHref && (
              <div>
                <div className="h-20 bg-[#0A66C2]" />
                <div className="relative px-5 pb-5">
                  <img
                    src={withBase("/profile.webp")}
                    alt=""
                    className="-mt-10 h-20 w-20 rounded-full border-4 border-[var(--color-surface)] object-cover object-[center_18%]"
                  />
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <strong className="block truncate text-[19px] font-semibold">Mhd Ulil Abshar</strong>
                      <p className="mt-1 text-[13px] leading-5 text-[var(--color-text-secondary)]">Software Engineer · Backend & Infrastructure</p>
                      <p className="text-[13px] leading-5 text-[var(--color-text-muted)]">Indonesia · Remote</p>
                    </div>
                    <a
                      href={linkedInHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#0A66C2] px-4 py-2 text-[13px] font-medium text-white no-underline"
                    >
                      Connect <ArrowUpRight size={13} strokeWidth={1.8} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeItem.id === "x" && xHref && (
              <div className="bg-[#1f1d1c] text-white">
                <div className="h-[8.5rem] bg-[#2b2826]" aria-hidden="true" />
                <div className="relative px-5 pb-5 pt-[3.65rem]">
                  <img
                    src={withBase("/profile.webp")}
                    alt=""
                    className="absolute left-5 top-0 h-20 w-20 -translate-y-1/2 rounded-full border-4 border-[#1f1d1c] object-cover object-[center_18%]"
                  />
                  <a
                    href={xHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-5 top-4 inline-flex min-h-10 items-center justify-center rounded-full bg-[#f5f5f4] px-5 text-[14px] font-semibold text-[#111] no-underline transition-opacity hover:opacity-90"
                  >
                    Follow
                  </a>
                  <strong className="block text-[18px] font-semibold tracking-[-0.02em] text-white">@howlildev</strong>
                  <p className="mt-1 max-w-[31ch] text-[14px] leading-6 text-[#b9b4ad]">
                    Backend systems, infrastructure, open source, and what I’m learning while building software.
                  </p>
                </div>
              </div>
            )}

            {activeItem.id === "resume" && (
              <div className="flex items-center gap-4 p-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--color-surface-muted)]">
                  <FileText size={23} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="block text-[15px] font-semibold">Resume</strong>
                  <p className="mt-1 text-[12px] leading-5 text-[var(--color-text-secondary)]">Experience, education, and selected engineering work.</p>
                </div>
                <a
                  href={resumeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--color-border-strong)] px-3 py-2 text-[11px] font-medium text-[var(--color-text-heading)] no-underline"
                >
                  Open <ArrowUpRight size={13} strokeWidth={1.8} aria-hidden="true" />
                </a>
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
            onMouseEnter={() => openProfile(id)}
            onMouseLeave={scheduleClose}
            onFocus={() => openProfile(id)}
            onBlur={scheduleClose}
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
