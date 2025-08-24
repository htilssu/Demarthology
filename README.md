# Demarthology - MVC Architecture Demo

A comprehensive TypeScript React application demonstrating the **Model-View-Controller (MVC)** pattern with **Axios** integration and modern architecture.

## 🚀 Features

### MVC Architecture Implementation
- **📋 Models** - Data structures with business logic and validation
- **🎨 Views** - React components for UI presentation
- **🎮 Controllers** - Custom hooks and service classes for state management

### Modern Tech Stack
- ⚛️ **React 19** - Latest React with hooks and modern patterns
- 📝 **TypeScript** - Fully typed for better development experience
- 🌐 **Axios** - Modern HTTP client with interceptors and error handling
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🏗️ **Clean Architecture** - Separation of concerns with MVC pattern

### API Integration
- ✅ **Axios-powered HTTP client** - Modern, feature-rich
- ✅ **Environment configuration** - Reads from `REACT_APP_API_URL`
- ✅ **Complete HTTP methods** - GET, POST, PUT, DELETE, PATCH
- ✅ **Authentication support** - Token management
- ✅ **Error handling** - Comprehensive with interceptors
- ✅ **TypeScript support** - Fully typed responses

## 📁 Project Structure

```
src/
├── models/           # Data models and business logic
│   ├── User.ts      # User model with validation
│   ├── Product.ts   # Product model with business logic
│   └── index.ts     # Model exports and utilities
├── services/         # API service classes (Controllers)
│   ├── UserService.ts    # User API operations
│   ├── ProductService.ts # Product API operations
│   └── index.ts     # Service exports
├── hooks/           # Custom React hooks (Controllers)
│   ├── useUsers.ts  # User state management
│   ├── useProducts.ts # Product state management
│   └── index.ts     # Hook exports and utilities
├── components/      # React components (Views)
│   ├── UserList.tsx     # User management demo
│   ├── ProductList.tsx  # Product management demo
│   ├── MVCDemo.tsx      # Comprehensive MVC demo
│   ├── ApiDemo.tsx      # API integration demo
│   └── Button.tsx       # Reusable UI components
├── utils/           # Utilities and configurations
│   └── api.ts       # Axios client configuration
└── types/           # TypeScript type definitions
    └── index.ts     # Common types and interfaces
```

## 🏗️ MVC Architecture

### Model Layer (`src/models/`)
Data structures, validation, and business logic:

```typescript
// User model with business logic
class UserModel {
  get fullName(): string {
    return `${this.user.firstName} ${this.user.lastName}`;
  }

  get isAdmin(): boolean {
    return this.user.role === UserRole.ADMIN;
  }

  static validateCreateRequest(request: CreateUserRequest): string[] {
    // Validation logic
  }
}
```

### View Layer (`src/components/`)
React components for UI presentation:

```typescript
// React component using MVC pattern
const UserList: React.FC = () => {
  const { users, loading, error, createUser } = useUsers();
  // Component UI logic
};
```

### Controller Layer (`src/hooks/` + `src/services/`)
State management and API operations:

```typescript
// Custom hook for user management
export function useUsers() {
  const [users, setUsers] = useState([]);
  
  const createUser = useCallback(async (userData) => {
    const newUser = await userService.createUser(userData);
    // Update local state
  }, []);

  return { users, createUser, ... };
}

// Service class for API operations
class UserService {
  async createUser(userData: CreateUserRequest): Promise<UserModel> {
    const response = await apiClient.post('/users', userData);
    return new UserModel(response.data);
  }
}
```

## 🌐 API Integration with Axios

### Base API Client

```typescript
import { apiClient } from './utils/api';

// GET request
const users = await apiClient.get('/users');

// POST request with data
const newUser = await apiClient.post('/users', { 
  name: 'John', 
  email: 'john@example.com' 
});

// Authentication support
apiClient.setAuthToken('your-jwt-token');
```

### Environment Configuration

Create a `.env` file:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api

# Environment
REACT_APP_ENV=development
```

### Service Layer Pattern

```typescript
// Example API call through service
import { userService } from './services';

// Get users with filtering
const users = await userService.getUsers({
  page: 1,
  limit: 10,
  role: 'user'
});

// Create new user with validation
const newUser = await userService.createUser({
  username: 'john_doe',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'secure123'
});
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/htilssu/Demarthology.git
   cd Demarthology
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your API URL:
   ```bash
   REACT_APP_API_URL=http://localhost:3001/api
   ```

5. Start the development server:
   ```bash
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
```

The build folder will contain the optimized production files.

## 📚 Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🎯 Demo Features

### User Management Demo
- ✅ Create, read, update, delete users
- ✅ User search and filtering
- ✅ Role management (Admin, Moderator, User)
- ✅ Form validation with business logic
- ✅ Real-time state updates

### Product Management Demo
- ✅ Product CRUD operations
- ✅ Stock management
- ✅ Category filtering
- ✅ Price updates
- ✅ Search functionality

### API Integration Demo
- ✅ Live API connection testing
- ✅ Environment configuration display
- ✅ Error handling demonstration
- ✅ HTTP methods showcase

## 🏆 Best Practices Implemented

- **Separation of Concerns** - Clear separation between Models, Views, and Controllers
- **TypeScript** - Full type safety throughout the application
- **Error Handling** - Comprehensive error handling with user feedback
- **State Management** - Centralized state management with custom hooks
- **Code Reusability** - Reusable components and services
- **Validation** - Client-side validation with business logic
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and Axios**
