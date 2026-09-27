# node:20-slim (Debian-based) rather than alpine — Prisma's query
# engine binaries need glibc/OpenSSL that alpine's musl libc doesn't
# provide out of the box, and chasing that down isn't worth it here.
FROM node:20-slim

WORKDIR /app

# Copy just the manifest files first so Docker can cache the
# npm install layer and skip re-running it when only source files
# change.
COPY package*.json ./
RUN npm install --omit=dev

# Now copy the rest of the source, including prisma/schema.prisma.
COPY . .

# Generates the Prisma Client inside the image, using the schema
# that was just copied in.
RUN npx prisma generate

EXPOSE 4000

CMD ["node", "src/index.js"]