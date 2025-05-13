# Blue_Eye

<p align="center">
A modern social networking application built with Node.js, Express, and React with Vite.
</p>

<p align="center">
  <img src="https://img.freepik.com/free-psd/iris-eye-isolated_23-2151866152.jpg" width="300" alt="Blue_Eye Logo">
</p>

**Repositories:**
- [Frontend (This repo)](https://github.com/Giolii/Blue_Eye)
- [Backend](https://github.com/Giolii/Blue_Eye_Backend) 

## 📋 Overview

Blue Eye is a full-stack social networking platform designed to connect people through a clean, intuitive interface. Built with performance and user experience in mind, it leverages modern web technologies to deliver a seamless social experience.

## ✨ Features

- **User Authentication** - Secure signup/login system
- **Profile Management** - Create and customize your profile
- **Social Feed** - View and interact with posts from your network
- **Posts & Comments** - Share thoughts and engage with others
- **Friend System** - Connect with other users
- **Real-time Notifications** - Stay updated with activities
- **Responsive Design** - Seamless experience across all devices

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Next generation frontend tooling
- **React Router** - Navigation and routing
- **Axios** - API requests
- **CSS Modules/Tailwind** - Styling

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **PostGreSQL/Prisma** - Database
- **JWT** - Authentication
- **Socket.io** - Real-time communication

## 📦 Installation

### Prerequisites
- Node.js (v14.x or higher)
- npm or yarn
- PostgreSQL

### Setup

1. Clone the repository
```bash
git clone https://github.com/Giolii/Blue_Eye.git
cd Blue_Eye
```

2. Install dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
npm install
```

3. Create environment variables
```bash
# In the server directory, create a .env file
touch .env
```

Add the following variables to the .env file:
```
DATABASE_URL
JWT_SECRET
NODE_ENV
FRONTEND_URL

AWS_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
S3_BUCKET_NAME

```

4. Start the development servers
```bash
# Start the backend server
npm run dev

# In a new terminal, start the frontend
npm run dev
```

5. Open your browser and visit `http://localhost:5173`

## 🚀 Deployment

### Backend
1. Build the server
```bash
cd server
npm run build
```

2. Start the production server
```bash
npm start
```

### Frontend
1. Build the client
```bash
cd client
npm run build
```

2. The build files will be in the `dist` directory ready to be deployed to your hosting service

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

- [Giolii](https://github.com/Giolii) 
