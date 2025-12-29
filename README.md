# 🎉 Events Platform

> A powerful, modern platform for creating and managing micro-events with real-time guest tracking, QR code check-ins, and beautiful photo galleries.

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-brightgreen.svg)](https://vuejs.org/)
[![Nuxt.js](https://img.shields.io/badge/Nuxt-4.2-00DC82.svg)](https://nuxt.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Features

- **Event Creation** - Create stunning events with detailed descriptions, custom settings, and metadata
- **QR Code Check-in** - Generate unique QR codes for automatic guest check-ins and real-time attendance tracking
- **Guest Management** - Easily manage guest lists, RSVP tracking, and send invitations
- **Live Countdown** - Display real-time countdown timers to build excitement
- **Photo Gallery** - Upload, organize, and share event photos with guests
- **Analytics & Insights** - Track attendee behavior, engagement metrics, and event performance
- **Responsive Design** - Beautiful, modern UI that works perfectly on all devices
- **Real-time Updates** - Live synchronization of guest check-ins and event data
- **Secure Authentication** - JWT-based auth with encrypted passwords
- **User Roles** - Support for admin and regular user accounts

---

## 📋 Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Nuxt 4** - Vue framework for production applications
- **TypeScript** - Static typing for JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management library
- **Lucide Vue** - Beautiful icon library

### Backend
- **Nuxt Server Routes** - API endpoints
- **MySQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Additional Tools
- **QRCode.js** - QR code generation
- **Vite** - Next generation frontend tooling

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)

---

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/vue-events-platform.git
cd vue-events-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment variables
Create a `.env` file in the root directory:
```env
JWT_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=mysql://user:password@localhost:3306/vue_events_db
```

### 4. Set up the database
```bash
mysql -u root -p < database.sql
```

### 5. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

---

## 🏃 Running the Project

### Development Mode
```bash
npm run dev
```
Hot module reloading enabled for seamless development.

### Production Build
```bash
npm run build
npm run preview
```

### Generate Static Site
```bash
npm run generate
```

---

## 📁 Project Structure

```
vue-events-platform/
├── app/
│   ├── app.vue                 # Root component with navigation
│   ├── pages/                  # Page components
│   │   ├── index.vue          # Home page
│   │   ├── login.vue          # Login page
│   │   ├── register.vue       # Registration page
│   │   └── events/
│   │       ├── [id].vue       # Event detail page
│   │       └── create.vue     # Event creation page
│   ├── layouts/               # Layout components
│   │   └── default.vue        # Default layout
│   └── middleware/            # Route middleware
│       └── protected.ts       # Protected routes
├── components/
│   ├── EventCard.vue          # Event card component
│   ├── Timer.vue              # Countdown timer
│   └── stores/
│       └── user.ts            # User Pinia store
├── server/
│   └── api/
│       ├── auth/              # Authentication endpoints
│       ├── events/            # Event endpoints
│       ├── guests/            # Guest endpoints
│       └── users/             # User endpoints
├── types/
│   └── index.ts              # TypeScript type definitions
├── utils/
│   ├── auth.ts               # Authentication utilities
│   └── database.ts           # Database utilities
├── assets/
│   └── css/
│       └── main.css          # Global styles
├── public/                    # Static assets
├── nuxt.config.ts            # Nuxt configuration
├── tailwind.config.js        # Tailwind CSS config
├── tsconfig.json             # TypeScript config
├── package.json              # Project dependencies
└── README.md                 # This file
```

---

## 🔐 Authentication

The platform uses JWT (JSON Web Tokens) for secure authentication:

1. **Register** - Create a new account with email and password
2. **Login** - Authenticate with credentials and receive JWT token
3. **Token Storage** - JWT stored in HTTP-only cookies
4. **Protected Routes** - Routes protected with middleware authentication

### API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/[id]` - Get event details
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

---

## 🎨 Features in Detail

### Event Creation
Create comprehensive events with:
- Title and detailed description
- Date, time, and location
- Maximum guest capacity
- Custom metadata

### QR Code System
- Automatic QR code generation
- Mobile scanning support
- Real-time check-in tracking
- Check-in history and analytics

### Guest Management
- Invite guests via email
- RSVP tracking
- Attendance monitoring
- Guest communication

### Photo Gallery
- Multi-image upload
- Image organization
- Guest sharing capabilities
- Auto-backup features

---

## 🧪 Development

### Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

### Code Structure

- **Components** - Reusable Vue components
- **Pages** - Route components (auto-routed by Nuxt)
- **Stores** - Pinia stores for state management
- **Server/API** - Backend API routes
- **Utils** - Utility functions and helpers
- **Types** - TypeScript type definitions

---

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ SQL injection prevention
- ✅ XSS protection with Vue's built-in sanitization

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3001
```

### Database Connection Error
- Verify MySQL is running
- Check DATABASE_URL in .env file
- Ensure database exists: `CREATE DATABASE vue_events_db;`

### Missing Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📄 Database Schema

The application uses the following main tables:

- **users** - User accounts and authentication
- **events** - Event information
- **guests** - Guest list and RSVP status
- **event_photos** - Event photo gallery
- **qr_codes** - QR code data and check-ins

Run `mysql -u root -p vue_events_db < database.sql` to initialize the schema.

---

## 🌐 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

---

## 📚 Documentation

- [Vue.js Documentation](https://vuejs.org/)
- [Nuxt 4 Documentation](https://nuxt.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

For support, email support@eventsplatform.com or create an issue in the repository.

---

## 🙏 Acknowledgments

- Vue.js community for the amazing framework
- Nuxt.js for the powerful meta-framework
- Tailwind CSS for the utility-first CSS approach
- All contributors and users

---

<div align="center">

**[⬆ back to top](#-events-platform)**

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>
