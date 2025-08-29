/**
 * Authentication utility functions for managing tokens
 * Supports reading from both localStorage and cookies
 * 
 * IMPORTANT: TOKEN_KEY must match the key used by axios instance
 * to ensure seamless token storage and retrieval for API calls
 */

export class AuthUtils {
  // This key is used by both storage (after login) and retrieval (by axios interceptor)
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

  /**
   * Get authentication token from localStorage or cookies
   * Priority: localStorage > cookies
   */
  static getAuthToken(): string | null {
    // Try localStorage first
    const localStorageToken = localStorage.getItem(this.TOKEN_KEY);
    if (localStorageToken) {
      return localStorageToken;
    }

    // Fallback to cookies
    return this.getCookieValue(this.TOKEN_KEY);
  }

  /**
   * Get refresh token from localStorage or cookies
   */
  static getRefreshToken(): string | null {
    const localStorageToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (localStorageToken) {
      return localStorageToken;
    }

    return this.getCookieValue(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Set authentication token in localStorage
   */
  static setAuthToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Verify that the token was stored correctly and is immediately available
   * This can be used after login to ensure axios can access the token
   */
  static verifyTokenStorage(expectedToken: string): boolean {
    const storedToken = this.getAuthToken();
    return storedToken === expectedToken;
  }

  /**
   * Set refresh token in localStorage
   */
  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  /**
   * Remove authentication tokens from localStorage
   */
  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  /**
   * Get Authorization header value
   */
  static getAuthorizationHeader(): string | null {
    const token = this.getAuthToken();
    return token ? `Bearer ${token}` : null;
  }

  /**
   * Parse cookie string and get specific cookie value
   */
  private static getCookieValue(name: string): string | null {
    if (typeof document === 'undefined') {
      return null; // SSR safety
    }

    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  /**
   * Set cookie with token
   */
  static setCookie(name: string, value: string, days: number = 7): void {
    if (typeof document === 'undefined') {
      return; // SSR safety
    }

    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  /**
   * Remove specific cookie
   */
  static removeCookie(name: string): void {
    if (typeof document === 'undefined') {
      return; // SSR safety
    }

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  }
}