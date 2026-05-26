# MediQueue – Tutor Booking System (Client)

### **Programming Hero | Batch-13 | Assignment-9 | CAT_02**
* **Project Name:** MediQueue – Tutor Booking System
* **Client Live Site:** [https://mediqueue-client-nine.vercel.app/](https://mediqueue-client-nine.vercel.app/)
* **Client GitHub Repository:** [https://github.com/rahad404/mediqueue-client](https://github.com/rahad404/mediqueue-client)
* **Server Live API:** [https://mediqueue-server-two.vercel.app/](https://mediqueue-server-two.vercel.app/)

---

## 📄 Project Description
**MediQueue** is a premium, beautiful, and highly responsive tutor booking web application. It is designed to bridge the gap between talented educators and students looking for quality learning sessions. Users can browse comprehensive tutor listings, search with advanced multi-parameter filtering, securely book sessions with automated seat-slot limits, manage bookings via their personal dashboard, and create/manage their own tutor profiles.

---

## 🚀 Key Features

1. **Dynamic Tutor Discovery & Search:**
   Instant search interface filtering by tutor name, subject, or location, coupled with comprehensive date-range selectors for start dates.
2. **Atomic Session Booking Flow:**
   A seamless checkout modal letting students book slots instantly. The app atomically decrements tutor seats to prevent overbooking.
3. **Interactive Booking Dashboard:**
   A dedicated "My Booked Sessions" tab letting students view, track, and safely cancel booking requests, releasing slots back to the tutor instantly.
4. **Comprehensive Tutor Management Hub:**
   A "My Tutors" panel allowing educators to add new profiles, update any detail with live-validated forms, and delete their listed tutors safely.
5. **Secure Authentication & Identity State:**
   Powered by **Better Auth** with JWT plugins, featuring Google social login, traditional credentials sign-up with strict password regulations, and automatic session persistence.

---

## 🛠️ Tech Stack

* **Frontend Framework:** Next.js 16 (App Router)
* **Styling & Components:** TailwindCSS 4, Shadcn UI Components
* **Authentication:** Better Auth, Google OAuth, Email/Password Provider
* **Icons & Animation:** Lucide React, React Icons, Framer Motion
* **Notifications & Feedback:** Sonner (Toast notifications)

---

## 🗺️ Frontend Routes

### Public Routes:
* `/` — Beautiful landing page with hero banners, stats, testimonials, and features.
* `/login` — Secure social and credential-based login portal.
* `/signup` — Account registration with advanced validation rules.
* `/tutors` — Fully filterable and searchable tutor listings catalog.

### Private Routes (Requires Login):
* `/tutors/[id]` — Detailed tutor workspace featuring description, rates, slots, and session booking trigger.
* `/my-booked-sessions` — Logged-in user's booked courses and cancellation actions.
* `/my-tutor` — Management panel displaying all tutor profiles created by the user.
* `/add-tutor` — Interactive form to publish new tutoring profiles.
* `/profile` — Personalized workspace to update display name and avatar instantly.

---

## ⚙️ Getting Started (Local Setup)

Follow these simple steps to run the client application locally:

### 1. Clone the repository
```bash
git clone https://github.com/rahad404/mediqueue-client.git
cd mediqueue-client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root folder and add the following keys:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=your_mongodb_connection_uri
BETTER_AUTH_SECRET=your_better_auth_session_secret
```

### 4. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
