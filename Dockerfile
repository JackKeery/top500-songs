# Stage 1: Build the Next.js frontend
FROM node:20-slim AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY pages/ pages/
COPY tsconfig.json next.config.js next-env.d.ts ./
RUN npm run build

# Stage 2: Build the Kotlin fat JAR (with frontend embedded)
FROM gradle:8.8-jdk21 AS backend
WORKDIR /app
COPY backend/ .
COPY --from=frontend /app/out/ src/main/resources/public/
RUN gradle shadowJar --no-daemon

# Stage 3: Minimal runtime image
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend /app/build/libs/*-all.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
