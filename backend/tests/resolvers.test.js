jest.mock("@prisma/client", () => {
  const mockRelease = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      release: mockRelease,
      $executeRaw: jest.fn(),
    })),
  };
});

const { PrismaClient } = require("@prisma/client");
const resolvers = require("../src/resolvers");

const mockPrisma = new PrismaClient();

describe("Mutation.createRelease", () => {
  beforeEach(() => {
    mockPrisma.release.create.mockReset();
  });

  test("creates a release with all 7 steps unchecked by default", async () => {
    mockPrisma.release.create.mockResolvedValue({
      id: "abc123",
      name: "Version 1.0.1",
      date: new Date("2022-09-20"),
      additionalInfo: null,
      steps: {},
      createdAt: new Date(),
    });

    await resolvers.Mutation.createRelease(null, {
      name: "Version 1.0.1",
      date: "2022-09-20T00:00:00.000Z",
      additionalInfo: null,
    });

    expect(mockPrisma.release.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: "Version 1.0.1",
          steps: expect.objectContaining({ prs_merged: false }),
        }),
      })
    );
  });
});

describe("Release.status field resolver", () => {
  test("returns DONE only when every step is true", () => {
    const release = {
      steps: {
        prs_merged: true,
        changelog_updated: true,
        tests_passing: true,
        github_release_created: true,
        deployed_demo: true,
        tested_in_demo: true,
        deployed_production: true,
      },
    };

    expect(resolvers.Release.status(release)).toBe("DONE");
  });

  test("returns PLANNED when steps object is empty", () => {
    expect(resolvers.Release.status({ steps: {} })).toBe("PLANNED");
  });
});