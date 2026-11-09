# MemoryMate – AI-Powered Personal Memory Assistant for Alzheimer's Patients

MemoryMate is a full-stack, compassionate web application designed to support people living with Alzheimer's disease, dementia, and other forms of memory impairment. It empowers seniors to recognize familiar family relationships through saved photographs, follow their daily routines, maintain medication and hydration habits, celebrate cherished personal memories, and stay safely connected with caregivers.

---

## 🌟 Key Capabilities & Features

### 1. "Who Is This?" – People Memory Assistant
* **Face & Relationship Recognition**: Large, friendly photo flashcards designed specifically for elderly recognition.
* **Relationship Clarity**: Clear prompts such as *"This is Rahul. He is your son."*
* **Interactive Recall Mode**: "Reveal Who This Is" mode allowing patients to look at photos first, followed by clear name badges and comforting descriptions.
* **Dual-Language Voice Readout**: Uses the Web Speech API with English and Malayalam audio options.
* **1-Tap Direct Call**: Direct dial buttons to call family members instantly.

### 2. My Memories Timeline
* **Story & Photo Gallery**: Visual timeline organized into categories: *Family, Special Events, Childhood, Education, and Friends*.
* **Rich Context**: Includes dates, locations (e.g. Alappuzha, Kochi), and tagged family members.
* **Audio Storytelling**: Patients can tap "Listen to this Story" to hear life narratives read aloud at an elderly-friendly, soothing pace.

### 3. Daily Reminder System
* **Core Routine Tracks**: Prescribed medication, hydration (water intervals), healthy meals, doctor appointments, and daily strolls.
* **Elderly-Friendly UI**: High-contrast, tactile cards with oversized checkboxes and celebratory confetti upon task completion.
* **Missed Reminder Alerts**: Overdue reminders are highlighted in red for caregivers so they can intervene promptly.
* **Medical Compliance Disclaimer**: Strictly enforced compliance where only caregivers or authorized healthcare providers enter medication schedules with certification.

### 4. Daily Routine Assistant
* **Step-by-Step Schedule**: Visual schedule (e.g., 7:00 AM Wake up, 8:00 AM Breakfast, 9:30 AM Memory photo time, 1:00 PM Lunch, 5:30 PM Garden walk, 10:00 PM Sleep).
* **Live Current Activity Highlighter**: Automatically detects current time of day and pulses the active activity.
* **Audio Voice Support**: Read aloud schedule for visually impaired seniors.

### 5. Instant Emergency Contact & SOS Lifeline
* **Prominent Red SOS**: Highly visible, pulsing emergency assistance button accessible from any page.
* **Real-Time Caregiver Broadcast**: Uses **Socket.io** to sound an instant alarm and toast on active caregiver screens with timestamps.
* **Direct Emergency Hotlines**: Pre-configured priority dial list including primary family caregiver, elder son, neurologist clinic, and Emergency Ambulance (108).
* **Delivery Confirmation**: Reassures disoriented patients that their alert was received and help is on the way.

### 6. Interactive Voice Assistant
* **Web Speech API**: Speech-to-Text and Text-to-Speech synthesis with slower speech rate (0.88x) and gentle chime intro.
* **Bilingual Support**: English and Malayalam (`ml-IN`) speech options.
* **Question Quick-Pills**: "Who is Rahul?", "What is my medicine today?", "What is my daily routine?", "Call Emergency Help".

### 7. Caregiver Hub & Settings
* **Patient Overview**: Stage tracking (Early, Moderate, Advanced), age, and care notes.
* **Adherence Metrics**: Visual percentage tracker for completed vs. missed daily tasks.
* **Data Ownership & Export**: One-click download of the complete patient record (memories, routines, emergency contacts, reminders) as a structured JSON archive.
* **Privacy & Consent Toggle**: Caregiver-certified consent management for storing personal family photographs and memories.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Tailwind CSS 3, Lucide React, Canvas Confetti |
| **Backend** | Node.js, Express.js, Socket.io (WebSocket), Multer |
| **Database** | MongoDB & Mongoose (with automated In-Memory Fallback store if MongoDB daemon is offline) |
| **APIs & Web Standards** | Web Speech API (TTS & SpeechRecognition), Web Audio API (Synthesizer Chimes), Axios |
| **Authentication** | JWT Authentication with role-based routing (Patient vs Caregiver) |

---

## 📂 Project Architecture

```
memorymate/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection + resilient in-memory fallback
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT authentication & role-based access
│   │   │   └── upload.js           # Multer image upload handling
│   │   ├── models/
│   │   │   ├── User.js             # Caregivers & Patients
│   │   │   ├── Patient.js          # Patient clinical & personal profile
│   │   │   ├── FamilyMember.js     # Family photographs & voice prompts
│   │   │   ├── Memory.js           # Life stories, categories & dates
│   │   │   ├── Reminder.js         # Medication, water, meals & missed flags
│   │   │   ├── DailyRoutine.js     # Routine timeline steps & visual icons
│   │   │   ├── EmergencyContact.js # Priority emergency contacts
│   │   │   └── Notification.js     # Real-time alert logs
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── patientRoutes.js
│   │   │   ├── familyRoutes.js
│   │   │   ├── memoryRoutes.js
│   │   │   ├── reminderRoutes.js
│   │   │   ├── routineRoutes.js
│   │   │   ├── emergencyRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   └── settingsRoutes.js
│   │   └── utils/
│   │       ├── dataStore.js        # Unified Mongoose / in-memory data repository
│   │       └── seedData.js         # Compassionate seed data (Thomas Kurian, Kerala)
│   ├── server.js                   # Express + Socket.io HTTP server
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Accessible navigation with font size / contrast controls
│   │   │   ├── Footer.jsx
│   │   │   ├── VoiceButton.jsx     # Audio speech button with ripple indicator
│   │   │   ├── EmergencySOSButton.jsx # High-visibility SOS trigger
│   │   │   ├── PersonCard.jsx      # Family face card with voice readout
│   │   │   ├── MemoryTimelineCard.jsx
│   │   │   ├── ReminderCard.jsx    # Large tactile toggle with confetti
│   │   │   ├── RoutineTimeline.jsx # Active schedule indicator
│   │   │   ├── Modal.jsx           # Accessible dialog
│   │   │   └── VoiceAssistantModal.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── AccessibilityContext.jsx # Font scaling (Normal, A+, A++) & High-Contrast
│   │   │   ├── VoiceContext.jsx    # Web Speech API TTS & Voice Commands
│   │   │   └── SocketContext.jsx   # Live emergency broadcast listener
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── CaregiverDashboard.jsx
│   │   │   ├── MyFamilyPage.jsx
│   │   │   ├── WhoIsThisPage.jsx
│   │   │   ├── MyMemoriesPage.jsx
│   │   │   ├── DailyRemindersPage.jsx
│   │   │   ├── DailyRoutinePage.jsx
│   │   │   ├── EmergencyContactsPage.jsx
│   │   │   ├── PatientProfilePage.jsx
│   │   │   └── CaregiverSettingsPage.jsx
│   │   ├── services/
│   │   │   └── api.js              # Axios REST client
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── run-dev.bat                     # Windows 1-click startup batch script
├── run-dev.ps1                     # PowerShell 1-click startup script
└── README.md
```

---

## 🚀 Step-by-Step Instructions to Run Locally

### Prerequisites
* **Node.js**: v18.0.0 or higher (v22 tested)
* **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` (Optional: if MongoDB is not running, the application automatically launches in resilient in-memory fallback mode so you can test immediately without any database installation!)

### Option A: 1-Click Launch (Windows)
Double-click `run-dev.bat` or run:
```powershell
.\run-dev.ps1
```

### Option B: Manual Terminal Execution

#### 1. Start the Backend API Server
```bash
cd backend
npm install
node server.js
```
The backend will run on **`http://localhost:5000`**.

#### 2. Start the Frontend React Client
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
The React frontend will be accessible at **`http://localhost:5173`**.

---

## 👥 Demo Logins & Testing Credentials

MemoryMate includes 1-click quick login buttons on the Landing and Login pages for instant role evaluation:

* **Caregiver Role**:
  * **Email**: `priya@example.com`
  * **Password**: `password123`
  * *(Or click "Caregiver View" on the login page)*
* **Patient Role**:
  * **Patient**: Thomas Kurian (76 years old, Early Stage Alzheimer's)
  * *(Or click "Patient View" on the login page)*
* **Top Navigation Switch**: Use the **"Role: Patient View / Caregiver View"** switch in the top toolbar to instantly toggle between views at any time.

---

## ♿ Elderly Accessibility Highlights

1. **Font Scaler**: Instant toggle between `A` (100%), `A+` (115%), and `A++` (130%) text scale.
2. **High-Contrast Mode**: Built-in high-contrast black/yellow/white scheme for seniors with cataracts or macular degeneration.
3. **Big Tactile Targets**: All buttons and cards have a minimum touch height of `54px` to `64px` for easy clicking.
4. **Calming Color Palette**: Soft sky blues, pastel sage greens, warm creams, and minimal visual noise.
5. **No Medical Guesswork**: Disclaimers and caregiver confirmations strictly safeguard prescription handling.

---

## ⚖️ Medical & Privacy Disclaimer
*MemoryMate is designed as a supportive memory and daily living aid, not as a replacement for clinical diagnosis, neurological therapy, or prescribed medical treatment. Always consult licensed medical professionals for Alzheimer's and dementia care.*
