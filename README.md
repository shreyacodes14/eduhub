# Online Learning Platform

A full-stack educational platform built with Express, MongoDB, React, and Vite.

## Features

- **User Authentication**: Register and login with JWT tokens
- **Course Management**: Browse, create, and enroll in courses
- **Protected Routes**: Secure endpoints requiring authentication
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Password Security**: Bcrypt password hashing
- **Axios Interceptors**: Automatic token attachment to requests

## Project Structure

```
Learn/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Courses.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── api.js         # Axios API client
│   │   ├── App.jsx        # Main app with routing
│   │   ├── App.css        # Styling
│   │   └── main.jsx       # Entry point
│   └── package.json
│
└── server/                 # Express backend
    ├── models/            # Mongoose schemas
    │   ├── User.js
    │   ├── Course.js
    │   └── Lesson.js
    ├── routes/            # API endpoints
    │   ├── auth.js
    │   └── courses.js
    ├── middleware/        # Custom middleware
    │   ├── auth.js
    │   └── errorHandler.js
    ├── index.js           # Server entry point
    ├── .env               # Environment variables
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (already created):
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/learn
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_xyz789
```

4. Start the server:
```bash
npm run dev
```

The server will run at `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will typically run at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (protected)
- `POST /api/courses/:id/enroll` - Enroll in course (protected)
- `PUT /api/courses/:id` - Update course (protected)
- `DELETE /api/courses/:id` - Delete course (protected)

## Usage

1. **Register**: Go to `/register` and create a new account
2. **Login**: Use your credentials to login at `/login`
3. **Browse**: View available courses at `/courses`
4. **Enroll**: Click "Enroll Now" to join a course
5. **Dashboard**: View your enrolled courses at `/dashboard`

## Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ORM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **CSS3** - Styling

## Security

- Passwords are hashed with bcryptjs
- JWT tokens for authentication
- Protected routes require valid tokens
- Environment variables for sensitive data
- CORS enabled for API requests

## Future Enhancements

- Video streaming for lessons
- Progress tracking
- Comments and ratings
- Payment integration
- Certificate generation
- Email notifications
- Admin dashboard
- Search and filtering

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in .env file
- Verify database name matches

### CORS Error
- Ensure server is running on port 5000
- Check API base URL in `client/src/api.js`
- Verify CORS middleware is enabled

### Port Already in Use
- Server: Change PORT in .env
- Client: Vite will suggest alternative port

## License

MIT

## Support

For issues or questions, please check the project structure and ensure all dependencies are installed correctly.
