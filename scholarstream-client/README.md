# ScholarStream - Scholarship Management Platform

A full-stack MERN application designed to connect students with scholarship opportunities. Universities or organizations can post scholarships and students can search, apply, and track their applications.

## 🌐 Live Site

[Live Site URL](https://your-live-site-url.web.app)

## 🎯 Purpose

To simplify the complex process of finding financial aid for education. A centralized platform helps students discover opportunities they might miss and streamlines the application review process for administrators.

## ✨ Key Features

### For Students
- Browse and search scholarships by name, university, degree, country
- Filter scholarships by category and sort by fees/date
- Apply for scholarships with secure Stripe payment
- Track application status in personal dashboard
- Write and manage reviews for completed applications
- Add scholarships to wishlist

### For Moderators
- Review and manage all student applications
- Provide feedback on applications
- Update application status (Pending → Processing → Completed)
- Moderate user reviews

### For Admins
- Full CRUD operations on scholarships
- Manage all users and their roles
- View analytics dashboard with charts
- Visualize platform statistics

### General Features
- Responsive design for all devices
- Secure authentication with Firebase
- Role-based access control
- JWT token verification
- Beautiful animations with Framer Motion
- Toast notifications and alerts

## 🛠️ Technologies Used

### Frontend
- React 18
- React Router DOM
- TanStack Query (React Query)
- Tailwind CSS + DaisyUI
- Framer Motion
- React Hook Form
- Recharts
- Stripe Integration
- Firebase Authentication

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Stripe API

## 📦 NPM Packages Used

```json
{
  "@stripe/react-stripe-js": "^2.8.0",
  "@stripe/stripe-js": "^4.7.0",
  "@tanstack/react-query": "^5.59.0",
  "axios": "^1.7.7",
  "canvas-confetti": "^1.9.3",
  "date-fns": "^4.1.0",
  "firebase": "^10.14.0",
  "framer-motion": "^11.11.1",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-helmet-async": "^2.0.5",
  "react-hook-form": "^7.53.0",
  "react-hot-toast": "^2.4.1",
  "react-icons": "^5.3.0",
  "react-router-dom": "^6.26.2",
  "recharts": "^2.12.7",
  "sweetalert2": "^11.14.1"
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- Firebase project
- Stripe account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/scholarstream-client.git
cd scholarstream-client
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file from `.env.example`
```bash
cp .env.example .env
```

4. Add your environment variables
```env
VITE_APIKEY=your_firebase_api_key
VITE_AUTHDOMAIN=your_firebase_auth_domain
VITE_PROJECTID=your_firebase_project_id
VITE_STORAGEBUCKET=your_firebase_storage_bucket
VITE_MESSAGINGSENDERID=your_firebase_messaging_sender_id
VITE_APPID=your_firebase_app_id
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PK=your_stripe_publishable_key
```

5. Run the development server
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/
│   ├── shared/      # Navbar, Footer, LoadingSpinner
│   ├── home/        # Banner, Stats, TopScholarships, etc.
│   └── scholarship/ # ScholarshipCard
├── pages/
│   ├── auth/        # Login, Register
│   ├── dashboard/
│   │   ├── admin/      # AddScholarship, ManageScholarships, etc.
│   │   ├── moderator/  # ManageApplications, AllReviews
│   │   └── student/    # MyApplications, MyReviews
│   └── ...
├── layouts/         # MainLayout, DashboardLayout
├── providers/       # AuthProvider
├── hooks/           # useAuth, useAxiosSecure, useRole
├── routes/          # router, PrivateRoute, AdminRoute
└── firebase/        # firebase.config.js
```

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| Student | Browse scholarships, apply, write reviews, manage own applications |
| Moderator | All student permissions + manage applications, moderate reviews |
| Admin | All permissions + manage scholarships, manage users, view analytics |

## 📝 Admin Credentials

- **Email:** admin@scholarstream.com
- **Password:** Admin@123

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
