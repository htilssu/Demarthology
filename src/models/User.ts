// User Model - Represents user data structure and business logic
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

export interface CreateUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
  isActive?: boolean;
}

// User Model Class with business logic
export class UserModel {
  constructor(private user: User) {}

  // Business logic methods
  get fullName(): string {
    return `${this.user.firstName} ${this.user.lastName}`;
  }

  get displayName(): string {
    return this.user.username || this.fullName;
  }

  get isAdmin(): boolean {
    return this.user.role === UserRole.ADMIN;
  }

  get isModerator(): boolean {
    return this.user.role === UserRole.MODERATOR;
  }

  get canModerate(): boolean {
    return this.isAdmin || this.isModerator;
  }

  get avatarUrl(): string {
    return this.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.fullName)}&background=random`;
  }

  // Validation methods
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  static validateCreateRequest(request: CreateUserRequest): string[] {
    const errors: string[] = [];

    if (!request.username || !this.validateUsername(request.username)) {
      errors.push('Username must be 3-20 characters and contain only letters, numbers, and underscores');
    }

    if (!request.email || !this.validateEmail(request.email)) {
      errors.push('Please provide a valid email address');
    }

    if (!request.firstName?.trim()) {
      errors.push('First name is required');
    }

    if (!request.lastName?.trim()) {
      errors.push('Last name is required');
    }

    if (!request.password || request.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return errors;
  }

  // Data access methods
  getData(): User {
    return { ...this.user };
  }

  updateData(updates: Partial<User>): UserModel {
    return new UserModel({ ...this.user, ...updates });
  }
}