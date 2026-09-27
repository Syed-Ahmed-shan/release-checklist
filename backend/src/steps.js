// The 7 steps every release goes through. These are fixed and
// shared across all releases, so we define them once here instead
// of storing them per-release in the database.
const STEPS = [
  { key: "prs_merged", label: "All relevant GitHub pull requests have been merged" },
  { key: "changelog_updated", label: "CHANGELOG.md files have been updated" },
  { key: "tests_passing", label: "All tests are passing" },
  { key: "github_release_created", label: "Releases in Github created" },
  { key: "deployed_demo", label: "Deployed in demo" },
  { key: "tested_in_demo", label: "Tested thoroughly in demo" },
  { key: "deployed_production", label: "Deployed in production" },
];

// Used when a new release is created: every step starts unchecked.
function getDefaultStepsState() {
  return STEPS.reduce((state, step) => {
    state[step.key] = false;
    return state;
  }, {});
}

// The core business rule from the spec:
// - no steps completed -> planned
// - all steps completed -> done
// - anything in between -> ongoing
function computeStatus(stepsState) {
  const values = Object.values(stepsState);
  const completedCount = values.filter(Boolean).length;

  if (completedCount === 0) return "PLANNED";
  if (completedCount === values.length) return "DONE";
  return "ONGOING";
}

module.exports = { STEPS, getDefaultStepsState, computeStatus };