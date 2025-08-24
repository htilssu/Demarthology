# React + Tailwind CSS + TypeScript Project

Dự án React với TypeScript và Tailwind CSS được setup sẵn với cấu trúc chuẩn.

## 🚀 Công nghệ sử dụng

- **React 19** - Thư viện JavaScript cho UI
- **TypeScript** - Typed JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing tool
- **Autoprefixer** - CSS vendor prefixing

## 📁 Cấu trúc thư mục

```
src/
├── components/     # Reusable components
│   ├── Button.tsx  # Button component
│   └── ApiDemo.tsx # API demo component
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
│   ├── helpers.ts # General utility functions
│   ├── api.ts     # Base API client
│   └── apiExample.ts # API usage examples
├── types/         # TypeScript type definitions
├── assets/        # Static assets (images, icons, etc.)
├── App.tsx        # Main App component
└── index.js       # Entry point
```

## 🛠️ Cài đặt và chạy

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm start
```

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000)

### Build production
```bash
npm run build
```

### Chạy tests
```bash
npm test
```

## 🎨 Sử dụng Tailwind CSS

Dự án đã được cấu hình sẵn Tailwind CSS. Bạn có thể sử dụng các utility classes trực tiếp trong JSX:

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
  Hello Tailwind!
</div>
```

## 📝 TypeScript

Dự án sử dụng TypeScript để type safety. Các file có đuôi `.tsx` cho React components và `.ts` cho utility functions.

### Ví dụ component với TypeScript:

```tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};
```

## 🔧 Cấu hình

### Environment Variables
Dự án sử dụng các biến môi trường để cấu hình:

1. Copy `.env.example` thành `.env`:
```bash
cp .env.example .env
```

2. Cấu hình các biến môi trường trong file `.env`:
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api

# Environment
REACT_APP_ENV=development
```

### API Client
Dự án có sẵn API client để giao tiếp với backend:

```typescript
import { apiClient } from './utils/api';

// GET request
const users = await apiClient.get('/users');

// POST request
const newUser = await apiClient.post('/users', userData);

// PUT request
const updatedUser = await apiClient.put('/users/1', userData);

// DELETE request
await apiClient.delete('/users/1');

// Set auth token
apiClient.setAuthToken('your-jwt-token');
```

### Tailwind CSS
File cấu hình: `tailwind.config.js`
- Content paths đã được setup cho React
- Có thể extend theme và plugins

### TypeScript
File cấu hình: `tsconfig.json`
- Strict mode enabled
- JSX support
- Module resolution cho Node.js

### PostCSS
File cấu hình: `postcss.config.js`
- Tailwind CSS plugin
- Autoprefixer plugin

## 📦 Components có sẵn

### Button Component
Component Button với nhiều variants và sizes:

```tsx
import Button from './components/Button';

<Button variant="primary" size="lg">
  Click me
</Button>
```

## 🎯 Custom Hooks

### useLocalStorage
Hook để quản lý localStorage với TypeScript:

```tsx
import useLocalStorage from './hooks/useLocalStorage';

const [user, setUser] = useLocalStorage('user', null);
```

## 🛠️ Development

### Linting
Dự án sử dụng ESLint với cấu hình React và TypeScript.

### Formatting
Sử dụng Prettier để format code (nếu cài đặt).

## 📚 Tài liệu tham khảo

- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
