export const PROJECT_TYPE_LABELS: Record<string, string> = {
  work: 'Work',
  academic: 'Academic',
  hackathon: 'Hackathon',
  'study-independent': 'Studi Independen',
  'side-project': 'Side Project',
  contribution: 'Contribution',
  production: 'Production',
};

export function getProjectTypeLabel(type: string): string {
  return PROJECT_TYPE_LABELS[type] ?? type;
}
