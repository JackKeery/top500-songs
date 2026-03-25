# 🎵 Top 500 Songs Website 🎵

This project displays a ranked list of the **Top 500 Songs** based on data stored in **Google Sheets**. It consists of a **Kotlin/http4k backend** that serves the song data, and a **Next.js/React frontend** that renders it.

---

## 🚀 **Technology Stack**

| Technology            | Purpose                              |
|-----------------------|--------------------------------------|
| **Kotlin**            | Backend language                     |
| **http4k**            | HTTP server framework                |
| **Gradle**            | Backend build tool                   |
| **Google Sheets API** | Data source for song data            |
| **Next.js**           | Frontend framework                   |
| **React**             | UI components                        |
| **TypeScript**        | Frontend language                    |
| **Vercel**            | Hosts the frontend                   |

---

## ⚙️ **Environment Variables**

Both the backend and frontend require environment variables.

### Backend (set in your shell or a `.env` file)

| Variable                          | Description                                      |
|-----------------------------------|--------------------------------------------------|
| `GOOGLE_APPLICATION_CREDENTIALS`  | Path to your Google service account JSON key file |
| `GOOGLE_SHEET_ID`                 | The ID of the Google Sheet containing song data  |

### Frontend

| Variable               | Description                                              |
|------------------------|----------------------------------------------------------|
| `NEXT_PUBLIC_API_URL`  | Base URL of the Kotlin backend (default: `http://localhost:8080`) |

---

## 🛠 **Useful Commands**

### **Run the Kotlin Backend**

```sh
cd backend
./gradlew run
```

📌 The API will be available at **http://localhost:8080/api/songs**.

### **Run the Frontend Development Server**

```sh
npm run dev
```

📌 The site will be available at **http://localhost:3000**.

### **Build the Backend (fat jar)**

```sh
cd backend
./gradlew build
```

### **Build the Frontend for Production**

```sh
npm run build
npm run start
```

### **Deploy Frontend to Vercel**

```sh
vercel --prod
```

📌 Set `NEXT_PUBLIC_API_URL` in your Vercel project environment variables to point at your deployed backend.

---

## 👨‍💻 **Author & Contributions**

- Built by **Jack Keery**
- Ratings by:
    - Jack Keery
    - George Burke
    - Morgan Tupper
