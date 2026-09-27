const { computeStatus, getDefaultStepsState, STEPS } = require("../src/steps");

describe("computeStatus", () => {
  test("returns PLANNED when no steps are completed", () => {
    const steps = getDefaultStepsState();
    expect(computeStatus(steps)).toBe("PLANNED");
  });

  test("returns ONGOING when some but not all steps are completed", () => {
    const steps = getDefaultStepsState();
    steps[STEPS[0].key] = true;
    expect(computeStatus(steps)).toBe("ONGOING");
  });

  test("returns DONE when every step is completed", () => {
    const steps = {};
    STEPS.forEach((step) => {
      steps[step.key] = true;
    });
    expect(computeStatus(steps)).toBe("DONE");
  });
});