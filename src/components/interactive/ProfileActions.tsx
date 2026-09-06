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

  const previewWidth = activeProfile === "github"
    ? "w-[26.5rem]"
    : activeProfile === "linkedin" || activeProfile === "x" || activeProfile === "resume"
      ? "w-[21.5rem]"
      : "w-[27rem]";

  const previewCardClass = [
    "absolute bottom-[calc(100%+0.75rem)] left-0 z-20 max-w-[calc(100vw-2rem)] overflow-hidden",
    "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-heading)]",
    "shadow-[0_24px_64px_rgba(0,0,0,0.22)]",
    previewWidth,
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
              <div className="p-4">
                <div className="flex items-center gap-2.5">
                  <img
                    src={githubProfile?.avatar_url ?? withBase("/profile.webp")}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-full object-cover object-[center_18%]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-baseline gap-1.5">
                      <strong className="truncate text-[13px] font-semibold">
                        {githubProfile?.name ?? githubProfile?.login ?? "howlil"}
                      </strong>
                      <span className="truncate text-[10px] text-[var(--color-text-muted)]">@{githubProfile?.login ?? "howlil"}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[10px] leading-4 text-[var(--color-text-secondary)]">
                      {githubProfile?.bio ?? "Backend systems, infrastructure, and open-source engineering."}
                    </p>
                  </div>
                  <a
                    href={githubProfile?.html_url ?? githubHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-[var(--color-border-strong)] px-2.5 text-[10px] font-medium text-[var(--color-text-heading)] no-underline"
                  >
                    Open <ArrowUpRight size={11} strokeWidth={1.8} aria-hidden="true" />
                  </a>
                </div>

                {githubStatus === "loading" && (
                  <p className="mt-3 text-[10px] text-[var(--color-text-muted)]">Loading live GitHub activity…</p>
                )}

                {githubStatus === "error" && (
                  <p className="mt-3 text-[10px] leading-4 text-[var(--color-text-muted)]">Live activity is temporarily unavailable.</p>
                )}

                {githubStatus === "ready" && githubProfile && githubContributions && (
                  <>
                    <div className="mt-3 flex items-center gap-3 border-t border-[var(--color-border)] pt-3 text-[9px] text-[var(--color-text-secondary)]">
                      <span><strong className="text-[var(--color-text-heading)]">{githubProfile.followers}</strong> followers</span>
                      <span><strong className="text-[var(--color-text-heading)]">{githubProfile.public_repos}</strong> repos</span>
                      <span><strong className="text-[var(--color-text-heading)]">{githubTotal ?? 0}</strong> contributions</span>
                    </div>

                    <div className="mt-3 overflow-x-auto pb-0.5" aria-label={`${githubTotal ?? 0} GitHub contributions in the last year`}>
                      <div
                        style={{
                          display: "grid",
                          gridAutoFlow: "column",
                          gridTemplateRows: "repeat(7, 0.34rem)",
                          gridAutoColumns: "0.34rem",
                          gap: "0.12rem",
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
              <div className="relative overflow-hidden bg-[var(--color-surface)]">
                <div
                  className="h-14"
                  aria-hidden="true"
                  style={{
                    background: "linear-gradient(118deg, #0A66C2 0%, #1b7bd3 48%, #89b9e8 100%)",
                  }}
                />
                <div
                  className="absolute inset-x-0 top-0 h-28 opacity-40 blur-2xl"
                  aria-hidden="true"
                  style={{
                    background: "radial-gradient(circle at 75% 20%, rgba(255,255,255,.7), transparent 54%)",
                  }}
                />
                <div className="relative px-4 pb-4">
                  <img
                    src={withBase("/profile.webp")}
                    alt=""
                    className="-mt-7 h-14 w-14 rounded-full border-[3px] border-[var(--color-surface)] object-cover object-[center_18%]"
                  />
                  <a
                    href={linkedInHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-4 top-3 inline-flex min-h-8 items-center gap-1 rounded-full bg-[#0A66C2] px-3 text-[11px] font-semibold text-white no-underline shadow-[0_4px_14px_rgba(10,102,194,.22)] transition-transform hover:-translate-y-px"
                  >
                    Connect <ArrowUpRight size={11} strokeWidth={1.9} aria-hidden="true" />
                  </a>
                  <div className="mt-2 min-w-0 pr-[5.5rem]">
                    <strong className="block truncate text-[15px] font-semibold tracking-[-0.02em]">Mhd Ulil Abshar</strong>
                    <p className="mt-0.5 text-[11px] leading-[1.45] text-[var(--color-text-secondary)]">Software Engineer · Backend & Infrastructure</p>
                    <p className="mt-0.5 text-[10px] leading-4 text-[var(--color-text-muted)]">Indonesia · Remote</p>
                  </div>
                </div>
              </div>
            )}

            {activeItem.id === "x" && xHref && (
              <div className="relative overflow-hidden bg-[#1c1b1a] text-white">
                <div
                  className="h-16"
                  aria-hidden="true"
                  style={{
                    background: "linear-gradient(125deg, #34302e 0%, #262321 52%, #4a403b 100%)",
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-55 blur-2xl"
                  aria-hidden="true"
                  style={{
                    background: "radial-gradient(circle at 80% 15%, rgba(194,164,148,.34), transparent 52%)",
                  }}
                />
                <div
                  className="relative px-4 pb-4 pt-8"
                  style={{
                    background: "linear-gradient(180deg, rgba(42,39,37,.86) 0%, rgba(28,27,26,1) 58%)",
                  }}
                >
                  <img
                    src={withBase("/profile.webp")}
                    alt=""
                    className="absolute left-4 top-0 h-14 w-14 -translate-y-1/2 rounded-full border-[3px] border-[#23211f] object-cover object-[center_18%] shadow-[0_5px_18px_rgba(0,0,0,.24)]"
                  />
                  <a
                    href={xHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-4 top-2.5 inline-flex min-h-8 items-center justify-center rounded-full bg-[#f7f7f5] px-3.5 text-[11px] font-semibold text-[#111] no-underline shadow-[0_4px_14px_rgba(0,0,0,.18)] transition-transform hover:-translate-y-px"
                  >
                    Follow
                  </a>
                  <div className="pr-[4.75rem]">
                    <strong className="block text-[15px] font-semibold tracking-[-0.02em] text-white">@howlildev</strong>
                    <p className="mt-1 max-w-[27ch] text-[11px] leading-[1.5] text-[#bbb4ad]">
                      Backend systems, infrastructure, open source, and what I’m learning while building software.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeItem.id === "resume" && (
              <div
                className="relative overflow-hidden p-3.5"
                style={{
                  background: "linear-gradient(135deg, color-mix(in srgb, var(--color-surface-muted) 90%, #e9ecef) 0%, var(--color-surface) 76%)",
                }}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[var(--color-surface)] shadow-sm ring-1 ring-[var(--color-border)]">
                      <FileText size={14} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <strong className="block truncate text-[11px] font-semibold">Resume</strong>
                      <span className="block text-[9px] text-[var(--color-text-muted)]">PDF document</span>
                    </div>
                  </div>
                  <a
                    href={resumeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[9px] font-medium text-[var(--color-text-heading)] no-underline shadow-sm"
                  >
                    Open <ArrowUpRight size={10} strokeWidth={1.9} aria-hidden="true" />
                  </a>
                </div>

                <div
                  className="relative h-[13.5rem] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface-muted)_88%,transparent)] shadow-inner"
                  aria-label="Stacked resume document preview"
                >
                  <div
                    className="pointer-events-none absolute inset-x-8 top-5 h-[17rem] rounded-[7px] border border-black/[0.04] bg-gradient-to-b from-[#efefec] to-[#e4e4e0] shadow-[0_14px_34px_rgba(0,0,0,.08)]"
                    style={{transform: "rotate(-4deg) translateY(4px) scale(.93)", transformOrigin: "top center"}}
                    aria-hidden="true"
                  />
                  <div
                    className="pointer-events-none absolute inset-x-7 top-4 h-[17.5rem] rounded-[7px] border border-black/[0.05] bg-gradient-to-b from-[#f7f7f4] to-[#ecece8] shadow-[0_16px_38px_rgba(0,0,0,.1)]"
                    style={{transform: "rotate(3deg) translateY(2px) scale(.965)", transformOrigin: "top center"}}
                    aria-hidden="true"
                  />

                  <motion.div
                    className="absolute left-1/2 top-4 h-[18.5rem] w-[14.25rem] -translate-x-1/2 rounded-[7px] border border-black/[0.05] bg-gradient-to-b from-[#fff] to-[#f8f8f6] px-4 pb-6 pt-4 text-[#252623] shadow-[0_20px_46px_rgba(0,0,0,.18)]"
                    aria-hidden="true"
                    animate={reduceMotion ? undefined : {y: [0, -3, 0]}}
                    transition={reduceMotion ? undefined : {duration: 4.2, repeat: Infinity, ease: "easeInOut"}}
                  >
                    <div className="border-b border-[#e5e6e2] pb-3">
                      <div className="text-[9px] font-bold leading-none tracking-[-0.02em]">Mhd Ulil Abshar</div>
                      <div className="mt-1.5 text-[5.5px] leading-none text-[#74776f]">Software Engineer · Backend & Infrastructure</div>
                    </div>

                    <div className="mt-3 text-[5px] font-semibold uppercase tracking-[0.15em] text-[#666a62]">Experience</div>
                    <div className="mt-2 space-y-1.5">
                      <span className="block h-[4px] w-[92%] rounded-full bg-[#d4d7d1]" />
                      <span className="block h-[4px] w-full rounded-full bg-[#e7e8e4]" />
                      <span className="block h-[4px] w-[78%] rounded-full bg-[#e7e8e4]" />
                    </div>

                    <div className="mt-4 text-[5px] font-semibold uppercase tracking-[0.15em] text-[#666a62]">Projects</div>
                    <div className="mt-2 space-y-1.5">
                      <span className="block h-[4px] w-[94%] rounded-full bg-[#d4d7d1]" />
                      <span className="block h-[4px] w-[84%] rounded-full bg-[#e7e8e4]" />
                    </div>
                  </motion.div>

                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
                    aria-hidden="true"
                    style={{
                      background: "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-surface-muted) 96%, transparent) 84%)",
                    }}
                  />
                </div>
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
