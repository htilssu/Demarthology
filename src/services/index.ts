// Export all services
export * from './UserService';
export * from './ProductService';

// Base service class for common functionality
export abstract class BaseService {
  protected handleError(error: any, operation: string): never {
    console.error(`${operation} failed:`, error);
    throw error;
  }
}

// Service factory for dependency injection
export class ServiceFactory {
  private static services: Map<string, any> = new Map();

  static register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  static get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service;
  }

  static clear(): void {
    this.services.clear();
  }
}