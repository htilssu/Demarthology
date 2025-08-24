// Product Service - Controller layer for product-related API operations
import { apiClient } from '../utils/api';
import { 
  Product, 
  ProductModel, 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductListParams, 
  ProductCategory,
  ListResponse 
} from '../models';

export class ProductService {
  private static instance: ProductService;
  private readonly baseEndpoint = '/products';

  // Singleton pattern
  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * Get all products with optional filtering and pagination
   */
  async getProducts(params: ProductListParams = {}): Promise<ListResponse<Product>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.category) queryParams.append('category', params.category);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.inStock !== undefined) queryParams.append('inStock', params.inStock.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `${this.baseEndpoint}?${queryString}` : this.baseEndpoint;
      
      const response = await apiClient.get<ListResponse<Product>>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }

  /**
   * Get a single product by ID
   */
  async getProductById(id: string): Promise<ProductModel> {
    try {
      const response = await apiClient.get<Product>(`${this.baseEndpoint}/${id}`);
      return new ProductModel(response.data);
    } catch (error) {
      console.error(`Failed to fetch product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new product
   */
  async createProduct(productData: CreateProductRequest): Promise<ProductModel> {
    try {
      // Validate request data
      const validationErrors = ProductModel.validateCreateRequest(productData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      const response = await apiClient.post<Product>(this.baseEndpoint, productData);
      return new ProductModel(response.data);
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(id: string, updates: UpdateProductRequest): Promise<ProductModel> {
    try {
      // Validate updates
      if (updates.price !== undefined && !ProductModel.validatePrice(updates.price)) {
        throw new Error('Invalid price value');
      }
      if (updates.stockQuantity !== undefined && !ProductModel.validateStockQuantity(updates.stockQuantity)) {
        throw new Error('Invalid stock quantity');
      }

      const response = await apiClient.put<Product>(`${this.baseEndpoint}/${id}`, updates);
      return new ProductModel(response.data);
    } catch (error) {
      console.error(`Failed to update product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      console.error(`Failed to delete product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update product stock
   */
  async updateStock(id: string, quantity: number): Promise<ProductModel> {
    try {
      if (!ProductModel.validateStockQuantity(quantity)) {
        throw new Error('Invalid stock quantity');
      }

      const response = await apiClient.patch<Product>(`${this.baseEndpoint}/${id}/stock`, { 
        stockQuantity: quantity 
      });
      return new ProductModel(response.data);
    } catch (error) {
      console.error(`Failed to update stock for product ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Add stock to product
   */
  async addStock(id: string, quantity: number): Promise<ProductModel> {
    try {
      const response = await apiClient.patch<Product>(`${this.baseEndpoint}/${id}/add-stock`, { 
        quantity 
      });
      return new ProductModel(response.data);
    } catch (error) {
      console.error(`Failed to add stock for product ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Remove stock from product
   */
  async removeStock(id: string, quantity: number): Promise<ProductModel> {
    try {
      const response = await apiClient.patch<Product>(`${this.baseEndpoint}/${id}/remove-stock`, { 
        quantity 
      });
      return new ProductModel(response.data);
    } catch (error) {
      console.error(`Failed to remove stock for product ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search products
   */
  async searchProducts(query: string, limit: number = 20): Promise<Product[]> {
    try {
      const response = await apiClient.get<ListResponse<Product>>(
        `${this.baseEndpoint}/search?q=${encodeURIComponent(query)}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to search products:', error);
      throw error;
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string, params: ProductListParams = {}): Promise<ListResponse<Product>> {
    try {
      return this.getProducts({ ...params, category });
    } catch (error) {
      console.error(`Failed to fetch products for category ${category}:`, error);
      throw error;
    }
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    try {
      const response = await apiClient.get<ListResponse<Product>>(
        `${this.baseEndpoint}/featured?limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      throw error;
    }
  }

  /**
   * Get popular products
   */
  async getPopularProducts(limit: number = 10): Promise<Product[]> {
    try {
      const response = await apiClient.get<ListResponse<Product>>(
        `${this.baseEndpoint}/popular?limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch popular products:', error);
      throw error;
    }
  }

  /**
   * Get product categories
   */
  async getCategories(): Promise<ProductCategory[]> {
    try {
      const response = await apiClient.get<ProductCategory[]>('/categories');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }

  /**
   * Upload product image
   */
  async uploadImage(id: string, file: File): Promise<ProductModel> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiClient.post<Product>(
        `${this.baseEndpoint}/${id}/image`,
        formData,
        { 'Content-Type': 'multipart/form-data' }
      );
      return new ProductModel(response.data);
    } catch (error) {
      console.error('Failed to upload product image:', error);
      throw error;
    }
  }

  /**
   * Apply discount to product
   */
  async applyDiscount(id: string, percentage: number): Promise<ProductModel> {
    try {
      if (percentage < 0 || percentage > 100) {
        throw new Error('Discount percentage must be between 0 and 100');
      }

      const response = await apiClient.patch<Product>(`${this.baseEndpoint}/${id}/discount`, { 
        percentage 
      });
      return new ProductModel(response.data);
    } catch (error) {
      console.error(`Failed to apply discount to product ID ${id}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const productService = ProductService.getInstance();