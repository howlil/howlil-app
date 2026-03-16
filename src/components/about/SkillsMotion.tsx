import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface SkillsMotionProps {
  skills: string[];
  countProjectsForSkill: (skill: string) => number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

export default function SkillsMotion({
  skills,
  countProjectsForSkill,
}: SkillsMotionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-wrap gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={prefersReducedMotion ? { duration: 0 } : undefined}
    >
      {skills.map((skill) => {
        const count = countProjectsForSkill(skill);
        const displayName = skill.replace(/\s+/g, "");
        const tagParam = encodeURIComponent(skill.trim());

        return (
          <motion.a
            key={skill}
            href={`/projects?tag=${tagParam}`}
            className="skill-tag skill-tag-link"
            title={count > 0 ? `${count} project(s)` : "No projects yet"}
            variants={itemVariants}
            whileHover={prefersReducedMotion ? {} : { y: -2, scale: 1.02 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
          >
            {displayName}
            <span className="skill-tag-count">{count}</span>
          </motion.a>
        );
      })}
    </motion.div>
  );
}
