# Employee Management System (HRMS)

A modern, production-ready Employee Management System built with React.js, Node.js, and PostgreSQL.

## 🚀 Features

- **Authentication**: JWT-based login, register, and forgot password
- **Employee Management**: Complete CRUD operations with search, sort, and pagination
- **Department Management**: Manage organizational departments
- **Role Management**: Define and assign user roles
- **Leave Management**: Submit and approve/reject leave requests
- **Dashboard Analytics**: Real-time statistics and insights
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- React.js 18
- Vite (Build tool)
- Tailwind CSS (Styling)
- React Router (Navigation)
- Axios (API calls)
- React Context (State management)

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcryptjs (Password hashing)

## 📁 Project Structure

```
Employee-Management-System/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Static assets
│   ├── public/
│   └── package.json
├── backend/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   └── package.json
├── docker-compose.yml      # Docker configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Employee-Management-System
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure your database credentials in .env
npm run migrate
npm run seed
npm start
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Using Docker**
```bash
docker-compose up --build
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Forgot password

### Employees
- `GET /api/employees` - Get all employees (with pagination, search, sort)
- `POST /api/employees` - Create new employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Roles
- `GET /api/roles` - Get all roles
- `POST /api/roles` - Create role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

### Leaves
- `GET /api/leaves` - Get all leaves
- `POST /api/leaves` - Submit leave request
- `PUT /api/leaves/:id` - Update leave status

## 🔧 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_management
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🎨 Design System

The application follows a professional HRMS design with:
- **Primary Colors**: Blue (#3B82F6), White (#FFFFFF)
- **Secondary Colors**: Gray (#6B7280), Green (#10B981), Red (#EF4444)
- **Typography**: Inter font family
- **Layout**: Sidebar + Main content area
- **Components**: Cards, Tables, Forms, Modals

## 📱 Screenshots

[Screenshots will be added here]

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Sample Users

- **Admin**: admin@hrms.com / password123
- **HR**: hr@hrms.com / password123
- **Employee**: employee@hrms.com / password123