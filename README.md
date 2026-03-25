# Top 500 Songs

Displays a ranked list of the Top 500 Songs sourced from Google Sheets. Built with a Kotlin/http4k backend that serves both the API and the static frontend, deployed to Google Cloud Run.

## Stack

| | |
|---|---|
| **Kotlin + http4k** | Backend + static file serving |
| **Next.js + React** | Frontend (exported as static files) |
| **Google Sheets API** | Data source |
| **Google Cloud Run** | Hosting |
| **GitHub Actions** | CI/CD |

## Local Development

Copy `.env.example` to `.env` and fill in your values, then:

```sh
make dev        # frontend on :3000, backend on :8080
make test       # run backend tests
make deploy     # build and deploy to Cloud Run
```

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable | Where |
|---|---|
| `GOOGLE_SHEET_ID` | `.env` locally, GitHub secret in CI, set on Cloud Run at deploy |
| `GOOGLE_APPLICATION_CREDENTIALS` | `.env` locally only (Cloud Run uses GCP identity) |
| `GCP_PROJECT` | `.env` locally, GitHub secret in CI |
| `GCR_REGION` | `.env` locally (default: `europe-west2`) |

## GitHub Actions Secrets

Required secrets for CI/CD (`Settings → Secrets → Actions`):

| Secret | Description |
|---|---|
| `GCP_CREDENTIALS` | Service account JSON with Cloud Run + Cloud Build permissions |
| `GCP_PROJECT` | GCP project ID |
| `GOOGLE_SHEET_ID` | Google Sheet ID |

## Contributors

Built by Jack Keery — ratings by Jack Keery, George Burke, and Morgan Tupper.
