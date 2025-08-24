// Product Model - Represents product data structure and business logic
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  imageUrl?: string;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  tags?: string[];
  imageUrl?: string;
  stockQuantity: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  inStock?: boolean;
  stockQuantity?: number;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

// Product Model Class with business logic
export class ProductModel {
  constructor(private product: Product) {}

  // Business logic methods
  get isAvailable(): boolean {
    return this.product.inStock && this.product.stockQuantity > 0;
  }

  get isLowStock(): boolean {
    return this.product.stockQuantity <= 5;
  }

  get formattedPrice(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.product.price);
  }

  get ratingStars(): string {
    const fullStars = Math.floor(this.product.rating);
    const hasHalfStar = this.product.rating % 1 >= 0.5;
    return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
  }

  get stockStatus(): 'in-stock' | 'low-stock' | 'out-of-stock' {
    if (!this.product.inStock || this.product.stockQuantity === 0) {
      return 'out-of-stock';
    }
    if (this.isLowStock) {
      return 'low-stock';
    }
    return 'in-stock';
  }

  get displayImage(): string {
    return this.product.imageUrl || `https://via.placeholder.com/300x200/e2e8f0/64748b?text=${encodeURIComponent(this.product.name)}`;
  }

  // Validation methods
  static validatePrice(price: number): boolean {
    return price > 0 && price <= 999999;
  }

  static validateStockQuantity(quantity: number): boolean {
    return Number.isInteger(quantity) && quantity >= 0;
  }

  static validateCreateRequest(request: CreateProductRequest): string[] {
    const errors: string[] = [];

    if (!request.name?.trim()) {
      errors.push('Product name is required');
    } else if (request.name.length > 100) {
      errors.push('Product name must be less than 100 characters');
    }

    if (!request.description?.trim()) {
      errors.push('Product description is required');
    } else if (request.description.length > 1000) {
      errors.push('Product description must be less than 1000 characters');
    }

    if (!this.validatePrice(request.price)) {
      errors.push('Price must be a positive number less than $999,999');
    }

    if (!request.category?.trim()) {
      errors.push('Product category is required');
    }

    if (!this.validateStockQuantity(request.stockQuantity)) {
      errors.push('Stock quantity must be a non-negative integer');
    }

    return errors;
  }

  // Business operations
  applyDiscount(percentage: number): ProductModel {
    const discountedPrice = this.product.price * (1 - percentage / 100);
    return new ProductModel({
      ...this.product,
      price: Math.round(discountedPrice * 100) / 100
    });
  }

  updateStock(quantity: number): ProductModel {
    const newQuantity = Math.max(0, this.product.stockQuantity + quantity);
    return new ProductModel({
      ...this.product,
      stockQuantity: newQuantity,
      inStock: newQuantity > 0
    });
  }

  addReview(rating: number): ProductModel {
    const totalRating = (this.product.rating * this.product.reviewCount) + rating;
    const newReviewCount = this.product.reviewCount + 1;
    const newRating = totalRating / newReviewCount;

    return new ProductModel({
      ...this.product,
      rating: Math.round(newRating * 10) / 10,
      reviewCount: newReviewCount
    });
  }

  // Data access methods
  getData(): Product {
    return { ...this.product };
  }

  updateData(updates: Partial<Product>): ProductModel {
    return new ProductModel({ ...this.product, ...updates });
  }
}