import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { withBase } from "../../lib/paths";

interface SkillsMotionProps {
  skills: {
    name: string;
    projectCount: number;
  }[];
}

export default function SkillsMotion({ skills }: SkillsMotionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div className="skill-cloud">
      {skills.map(({ name, projectCount }) => {
        const displayName = name.trim();
        const tagParam = encodeURIComponent(displayName);

        return (
          <motion.a
            key={displayName}
            href={withBase(`/projects?tag=${tagParam}`)}
            className="skill-badge"
            data-has-projects={projectCount > 0}
            title={projectCount > 0 ? `${projectCount} project(s)` : "No projects yet"}
            whileHover={prefersReducedMotion ? {} : { y: -2, scale: 1.02 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
          >
            <span className="skill-badge-label">{displayName}</span>
            <span className="skill-badge-count">{projectCount}</span>
          </motion.a>
        );
      })}
    </motion.div>
  );
}
