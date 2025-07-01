# Mwenezi High Fees Management PWA

Welcome to the Mwenezi High Fees Management Progressive Web App. This is a comprehensive, multi-role application designed to provide a secure, intuitive, and trustworthy platform for managing school fees.

## Project Vision: "Relevant Education for Livelihood"

The application's core purpose is to provide a modern and reliable system for school administration, bursars, and students to manage all financial aspects of tuition and fees.

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [Netlify](https://www.netlify.com/) account for deployment.
- A [Firebase](https://firebase.google.com/) project (with Realtime Database enabled) for the database.
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (optional but recommended for local testing of functions).

### 2. Installation & Setup

1.  **Download and Unzip:**
    Download the project folder and unzip it.

2.  **Navigate to Project Directory:**
    Open your terminal and navigate into the project's root directory.
    ```bash
    cd path/to/your/project
    ```

3.  **Install Dependencies:**
    This command installs both frontend dependencies and backend function dependencies.
    ```bash
    npm install
    ```

### 3. Firebase Admin Configuration

The backend Netlify Functions require a Firebase Service Account to securely interact with your database.

1.  **Generate Service Account Key:**
    - In your Firebase project, go to `Project Settings` > `Service accounts`.
    - Click `Generate new private key`. A JSON file will be downloaded. **Treat this file like a password and do not commit it to your repository.**

2.  **Encode the Service Account Key:**
    The JSON key cannot be stored directly in a Netlify environment variable. You must encode it.
    - Open the downloaded JSON file in a text editor.
    - Copy the entire content of the file.
    - Go to a site like [base64encode.org](https://www.base64encode.org/).
    - Paste the JSON content and encode it. Copy the resulting long string.

### 4. Environment Configuration

This project uses Netlify Functions for its backend, which rely on environment variables.

#### For Local Development (`.env` file)

Create a file named `.env` in the root of your project.

```
# .env file

# Firebase Admin Config (replace with your values)
VITE_FIREBASE_DATABASE_URL="https://your-project-default-rtdb.firebaseio.com"
FIREBASE_SERVICE_ACCOUNT_BASE64="PASTE_YOUR_BASE64_ENCODED_KEY_HERE"

# ZbPay API Credentials (Sandbox)
ZB_API_KEY="3f36fd4b-3b23-4249-b65d-f39dc9df42d4"
ZB_API_SECRET="2f2c32d7-7a32-4523-bcde-1913bf7c171d"
```

#### For Production (Netlify UI)

When you deploy to Netlify, you MUST set these variables in the Netlify UI:
1.  Go to your site's dashboard on Netlify.
2.  Navigate to `Site settings` > `Build & deploy` > `Environment`.
3.  Add the same variables (`VITE_FIREBASE_DATABASE_URL`, `FIREBASE_SERVICE_ACCOUNT_BASE64`, `ZB_API_KEY`, `ZB_API_SECRET`) with their respective values.

### 5. Running the Development Server

To run the frontend and the backend functions locally, use the Netlify CLI.

```bash
netlify dev
```

This command starts your Vite frontend and the serverless functions, allowing them to communicate. Open the URL provided by the CLI (usually `http://localhost:8888`) to view the full application.

---

## 🏗️ Building for Production

To create a production-ready build of the application, run:

```bash
npm run build
```

This command bundles the frontend into the `dist` folder and prepares the functions in the `netlify/functions` folder for deployment.

---

## ☁️ Deployment to Netlify

1.  **Connect Your Git Repository:**
    For the best experience, connect your GitHub/GitLab/Bitbucket repository to a new site on Netlify.

2.  **Configure Build Settings:**
    -   **Build command:** `npm run build`
    -   **Publish directory:** `dist`
    -   **Functions directory:** `netlify/functions`

3.  **Set Environment Variables:**
    As mentioned in Step 4, ensure your environment variables are set in the Netlify UI.

4.  **Deploy:**
    Trigger a new deployment. Netlify will build your site and deploy your functions automatically.

---

## ⚙️ Backend Architecture (Netlify Functions)

This project's backend is built with serverless functions located in the `/netlify/functions` directory. This is where all secure logic resides.

-   **`firebase-admin.js`**: A helper module to initialize the Firebase Admin SDK using the service account.
-   **`initiateZbPayTransaction.js`**: Handles creating a pending transaction in Firebase and making the API call to the real ZbPay sandbox to get a payment URL.
-   **`checkZbPaymentStatus.js`**: Verifies a payment's status with ZbPay and updates the student's balance and transaction record in Firebase upon success.
-   **Other functions**: Handle student creation, cash payments, authentication, and data fetching securely.

All frontend API calls in `src/services/api.ts` are directed to these functions.

### Test Credentials (for initial mock data)

-   **Admin:** `admin` / `admin123`
-   **Bursar:** `bursor` / `bursor123`
-   **Student 1:** `MHS-001` / `student123`

Good luck with your project!
