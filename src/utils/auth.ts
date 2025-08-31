/**
 * Authentication utility functions for managing user profile in localStorage
 * Simplified to work without tokens - just stores user profile data
 */

import { UserProfile } from '../types/api';

export class AuthUtils {
  private static readonly USER_KEY = 'user_profile';

  /**
   * Get user profile from localStorage
   */
  static getUserProfile(): UserProfile | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Failed to parse user profile from localStorage:', error);
      return null;
    }
  }

  /**
   * Set user profile in localStorage
   */
  static setUserProfile(userProfile: UserProfile): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(userProfile));
    } catch (error) {
      console.error('Failed to save user profile to localStorage:', error);
    }
  }

  /**
   * Remove user profile from localStorage
   */
  static clearUserProfile(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Check if user is authenticated (has user profile in localStorage)
   */
  static isAuthenticated(): boolean {
    return !!this.getUserProfile();
  }

  /**
   * Get user information (legacy method for backward compatibility)
   */
  static getUser(): any | null {
    return this.getUserProfile();
  }

  /**
   * Set user information (legacy method for backward compatibility)
   */
  static setUser(user: any): void {
    this.setUserProfile(user);
  }

  /**
   * Clear tokens (legacy method for backward compatibility)
   */
  static clearTokens(): void {
    this.clearUserProfile();
  }

  // Legacy token methods (kept for compatibility but not used)
  static getAuthToken(): string | null {
    return null;
  }

  static getRefreshToken(): string | null {
    return null;
  }

  static setAuthToken(token: string): void {
    // No-op - tokens not used anymore
  }

  static setRefreshToken(token: string): void {
    // No-op - tokens not used anymore
  }

  static verifyTokenStorage(expectedToken: string): boolean {
    return true; // Always return true since we don't use tokens
  }

  static getAuthorizationHeader(): string | null {
    return null; // No authorization header needed
  }
}