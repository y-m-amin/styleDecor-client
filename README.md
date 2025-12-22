## 📝 Description

**StyleDecor** is a complete appointment and service management platform for a local decoration company offering both **in-studio consultations** and **on-site decoration services** for homes, weddings, offices, and events.

Instead of relying on walk-ins, phone calls, and manual coordination, StyleDecor introduces a **smart, role-based workflow** where users can book services, admins can manage operations, and decorators can track and update project progress in real time.

The system ensures:
- Reduced waiting times  
- Transparent service tracking  
- Better decorator assignment  
- Smooth online payments  
- Data-driven business decisions  

---

## ⚙️ Core Features

- 🔐 Secure authentication with Firebase & JWT  
- 🧭 Role-based routing (Admin, Decorator, User)  
- 🎨 Browse & filter decoration services  
- 📅 Smart booking with date, time & location  
- 👷 Decorator availability & specialty management  
- 📊 Real-time project status tracking  
- 💳 Secure Stripe payment integration  
- 📈 Admin analytics & revenue insights  
- 🌍 Service coverage map using React Leaflet  
- 📱 Fully responsive & mobile-friendly UI  

---

## 🔄 How the System Works

### 👤 User Flow
1. Browse decoration services & packages  
2. Filter services by category, budget, or name  
3. View detailed service information  
4. Select date, time, and service location  
5. Complete payment securely  
6. Track service progress from dashboard  

### 🏗️ On-Site Service Status Flow
- Assigned  
- Planning Phase  
- Materials Prepared  
- On the Way to Venue  
- Setup in Progress  
- Completed  

Each status update is handled by decorators and reflected instantly for users.

---

## 🧱 Layout & Page Structure

### 🧭 Navbar
- Logo & Brand Name  
- Home, Services, About, Contact  
- Dashboard button (for logged-in users)  
- Login / Profile dropdown  

### 🦶 Footer
- Contact information  
- Social media links  
- Business working hours  
- Copyright  

---

## 📄 Main Pages

- 🏠 Home Page  
- 🎨 Services Page  
- 📋 Service Details & Booking Page  
- 💳 Payment Page  
- 🗺️ Service Coverage Map Page  
- 🔐 Login / Register Page  
- ❌ Global Error Page  
- ⏳ Loading Spinner & Skeletons  

---

## 🏠 Home Page Highlights

- 🎯 Animated Hero Section (Framer Motion)  
  - CTA: **“Book Decoration Service”**  
- 🎨 Dynamic Services Grid (loaded from server)  
- 🌟 Top Decorators Section  
  - Ratings & specialties  
- 🗺️ Service Coverage Map  
  - Powered by React Leaflet  

---

## 🔐 Authentication & Authorization

### Registration
- Email & password signup  
- Profile image upload (ImageBB / Cloudinary)  
- Decorator role assigned by admin  

### Login
- Email/password login  
- Social login support  
- JWT token for secured routes  

### Role-Based Access
- **Admin**: Full system control  
- **Decorator**: Project & status management  
- **User**: Booking & payment access  

---

## 🌎 Open Routes

### Services Page
- Card grid view of all services  
- Search by service name  
- Filter by:
  - Service category  
  - Budget range (min ~ max)  

### Service Details Page
- Full service description  
- Pricing, category, unit, and details  
- “Book Now” button (login required)  
- Pre-filled booking form for logged-in users  

---

## 📊 Dashboard System

### 👤 User Dashboard
- My Profile  
- My Bookings  
- Booking cancellation  
- Payment history  

Users can:
- Book services  
- Update or cancel bookings  
- Track service progress  
- View payment receipts  

---

### 🛠️ Admin Dashboard
- Manage Decorators (CRUD)  
- Manage Services & Packages (CRUD)  
- Manage Bookings  
- Assign decorators for on-site services  
- Approve / disable decorator accounts  
- Revenue monitoring  
- Analytics & charts  
  - Service demand histogram  
  - Booking trends  

---

### 👷 Decorator Dashboard
- Assigned projects  
- Today’s schedule  
- Step-by-step status updates  
- Earnings summary  
- Payment history review  

---

## 💳 Payment System

- Integrated **Stripe Checkout**  
- Secure payment handling  
- Transaction records stored on server  
- Downloadable payment receipts in user dashboard  

---

## ⚙️ Technologies Used

| Technology | Description | Link |
|-------------|-------------|------|
| **@tailwindcss/vite** | Official Tailwind CSS plugin for seamless Vite integration | [Tailwind + Vite](https://tailwindcss.com/docs/installation/using-vite) |
| **Axios** | Promise-based HTTP client for making API requests | [Axios Docs](https://axios-http.com/docs/intro) |
| **Firebase** | Backend-as-a-Service for authentication, database, storage, and hosting | [Firebase Docs](https://firebase.google.com/docs) |
| **Leaflet** | Open-source JavaScript library for interactive maps | [Leaflet Docs](https://leafletjs.com/) |
| **Motion** | Animation library for smooth and performant UI animations | [Motion Docs](https://motion.dev/) |
| **React** | Core library for building the user interface | [React Docs](https://react.dev/) |
| **React DOM** | Entry point for rendering React components to the DOM | [React DOM Docs](https://react.dev/reference/react-dom) |
| **React Hook Form** | Performant and flexible form handling with minimal re-renders | [React Hook Form](https://react-hook-form.com/) |
| **React Icons** | Popular icon libraries as React components | [React Icons](https://react-icons.github.io/react-icons/) |
| **React Leaflet** | React components for building Leaflet maps | [React Leaflet Docs](https://react-leaflet.js.org/) |
| **React Loading Skeleton** | Create animated skeleton loaders for better UX | [React Loading Skeleton](https://github.com/dvtng/react-loading-skeleton) |
| **React Router** | Declarative client-side routing for React applications | [React Router](https://reactrouter.com/home) |
| **React Spinners** | Collection of loading spinner components for React | [React Spinners](https://www.davidhu.io/react-spinners/) |
| **React To Print** | Easily print React components | [React To Print](https://www.npmjs.com/package/react-to-print) |
| **React Toastify** | Toast notifications for success, warning, and error messages | [React Toastify](https://fkhadra.github.io/react-toastify/introduction) |
| **Recharts** | Composable charting library built on React components | [Recharts Docs](https://recharts.org/en-US/) |
| **TailwindCSS** | Utility-first CSS framework for rapid UI development | [TailwindCSS Docs](https://tailwindcss.com/docs) |
| **Sweet Alert** | A beautiful replacement for JavaScript's "alert"| [Sweet Alert Docs](https://sweetalert.js.org/) |


---

## 🧩 Prerequisites

Make sure you have the following installed before running the project:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)  
- [Git](https://git-scm.com/)  
- A package manager such as **npm**, **yarn**, or **pnpm**

---

## 🧠 Running the Client Locally

Follow these steps to run the KrishiLink client on your local machine:

```bash
# 1️⃣ Clone the repository
git clone https://github.com/y-m-amin/styleDecor-client.git

# 2️⃣ Navigate into the project directory
cd krishilink-client

# 3️⃣ Install dependencies
npm install
# or
yarn install

# 4️⃣ Create a .env file in the root folder
# Add your API base URL and Firebase config variables
VITE_API_BASE_URL=http://localhost:3000 or your server url
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
# (Add other Firebase config keys as needed)

# 5️⃣ Start the development server
npm run dev
# or
yarn dev
```

## 🌐 Live Demo Link

You can visit the live deployed version of Style Decor here:

👉 [Style Decor](https://style-decor-ceb45.web.app/)


