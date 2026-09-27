const { PrismaClient } = require("@prisma/client");
const { STEPS, getDefaultStepsState, computeStatus } = require("./steps");

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    releases: () => prisma.release.findMany({ orderBy: { date: "asc" } }),
    release: (_parent, { id }) => prisma.release.findUnique({ where: { id } }),
  },

  Mutation: {
    createRelease: (_parent, { name, date, additionalInfo }) => {
      return prisma.release.create({
        data: {
          name,
          date: new Date(date),
          additionalInfo: additionalInfo || null,
          steps: getDefaultStepsState(),
        },
      });
    },

    updateRelease: (_parent, { id, name, date, additionalInfo }) => {
      const data = {};
      if (name !== undefined) data.name = name;
      if (date !== undefined) data.date = new Date(date);
      if (additionalInfo !== undefined) data.additionalInfo = additionalInfo;

      return prisma.release.update({ where: { id }, data });
    },

    toggleStep: async (_parent, { id, stepKey, completed }) => {
      // jsonb_set reads and writes the "steps" column in a single
      // atomic database statement. Unlike our old read-then-write
      // approach in JavaScript, Postgres serializes concurrent
      // updates to the same row, so two checkboxes clicked almost
      // simultaneously can never overwrite one another anymore.
      await prisma.$executeRaw`
        UPDATE "Release"
        SET steps = jsonb_set(steps, ARRAY[${stepKey}]::text[], to_jsonb(${completed}), true)
        WHERE id = ${id}
      `;

      const release = await prisma.release.findUnique({ where: { id } });
      if (!release) throw new Error("Release not found");
      return release;
    },

    deleteRelease: async (_parent, { id }) => {
      await prisma.release.delete({ where: { id } });
      return true;
    },
  },

  Release: {
    date: (release) => release.date.toISOString(),
    createdAt: (release) => release.createdAt.toISOString(),
    status: (release) => computeStatus(release.steps),
    steps: (release) =>
      STEPS.map((step) => ({
        key: step.key,
        label: step.label,
        completed: !!release.steps[step.key],
      })),
  },
};

module.exports = resolvers;