# Deployment Guide to Google Cloud Platform (GCP)

Since you don't have the Google Cloud CLI (`gcloud`) installed on your machine, the easiest way to deploy is using **Google Cloud Shell** (a command line built into the browser).

## Prerequisites
1.  A **Google Cloud Account** with billing enabled (Google offers a free trial $300 credit).
2.  A project created in the Google Cloud Console.

## Step 1: Upload Code to Cloud Shell
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Click the "Activate Cloud Shell" icon (terminal icon) in the top right toolbar.
3.  Click "Open Editor" to open the code editor.
4.  Drag and drop your `backend` folder into the editor.

## Step 2: Set up the Database
You cannot use your local MySQL database on the cloud. You have two options:
*   **Option A (Recommended for Production)**: Create a **Cloud SQL** instance (MySQL) in Google Cloud. This costs money after the free trial.
*   **Option B (Free/Demo)**: Use SQLite (file-based db). Note: Data will be reset if the server restarts. To do this, change `settings.py` `DATABASES` back to sqlite3.

## Step 3: Deploy Backend to Cloud Run
In the Cloud Shell terminal, run:

```bash
cd backend
gcloud run deploy exam-backend --source . --region us-central1 --allow-unauthenticated
```
*   It will ask to enable APIs (say 'y').
*   Once finished, it will give you a **Service URL** (e.g., `https://exam-backend-xyz.run.app`).

## Step 4: Update Frontend
1.  Open `frontend/.env` in your local project.
2.  Change `VITE_API_URL` to your new Backend URL.
    ```
    VITE_API_URL=https://exam-backend-xyz.run.app/api
    ```
3.  Re-deploy your frontend.
