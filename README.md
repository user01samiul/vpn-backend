# VPN Backend API

This backend is a secure and scalable server-side application that provides authentication, user management, and VPN-related functionalities. It is built using **Node.js**, **Express**, and **MySQL**, with **JWT authentication** for security.

## Features

- **User Authentication**: Secure login and registration using JWT.
- **Subscription Management**: Handle user plans and payments.
- **VPN Server Integration**: Connect and manage VPN servers.
- **Logging & Monitoring**: Track API requests and errors.
- **Admin Panel API**: Manage users and subscriptions.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JSON Web Tokens (JWT)
- **Deployment**: Docker, PM2 (Optional)

## Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/user01samiul/vpn-backend.git
   cd backend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables** (Create a `.env` file and configure the following variables)
   ```env
   PORT=3000
   HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_mysql_database
   JWT_SECRET=your_secret_key
   ```

4. **Run the application in development server**
   ```sh
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### User Management
- `GET /api/users/profile` - Get user profile (Requires Auth)
- `PUT /api/users/update` - Update user details (Requires Auth)

### Subscription
- `POST /api/subscription` - Subscribe to a VPN plan
- `GET /api/subscription/status` - Check subscription status

## Deployment

For production deployment, you can use **Docker**:
```sh
docker build -t backend .
docker run -p 5000:5000 backend
```

Or use **PM2** to run it as a background process:
```sh
npm install -g pm2
pm2 start server.js --name backend
```

## Contributing

Feel free to submit a pull request or open an issue if you find any bugs or have feature suggestions.

## License

This project is licensed under the MIT License.

---

🚀 Built with passion by [Md. Samiul Islam](https://github.com/samiul-primary)

