.PHONY: dev frontend backend test build deploy

-include .env
export

GCR_IMAGE = gcr.io/$(GCR_PROJECT)/top500-songs

# Run frontend (Next.js dev server) and backend concurrently for local development
dev:
	make -j2 frontend backend

# Run the Next.js dev server on port 3000
frontend:
	npm run dev

# Run the Kotlin backend on port 8080
backend:
	cd backend && ./gradlew run

# Run backend unit tests
test:
	cd backend && ./gradlew test

# Build a single deployable fat JAR (frontend embedded inside)
build:
	npm run build
	rm -rf backend/src/main/resources/public
	cp -r out/ backend/src/main/resources/public
	cd backend && ./gradlew build

# Build Docker image and deploy to Google Cloud Run
deploy:
	gcloud builds submit --tag $(GCR_IMAGE) --suppress-logs
	gcloud run deploy top500-songs \
		--image $(GCR_IMAGE) \
		--platform managed \
		--region $(GCR_REGION) \
		--allow-unauthenticated \
		--max-instances 2 \
		--set-env-vars GOOGLE_SHEET_ID=$(GOOGLE_SHEET_ID)
