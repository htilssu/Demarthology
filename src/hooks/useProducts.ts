// Product management hook - Controller for product state and operations
import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services';
import { Product, ProductModel, CreateProductRequest, UpdateProductRequest, ProductListParams, ProductCategory } from '../models';

interface UseProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseProductsActions {
  fetchProducts: (params?: ProductListParams) => Promise<void>;
  createProduct: (productData: CreateProductRequest) => Promise<ProductModel>;
  updateProduct: (id: string, updates: UpdateProductRequest) => Promise<ProductModel>;
  deleteProduct: (id: string) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  updateStock: (id: string, quantity: number) => Promise<ProductModel>;
  clearError: () => void;
  refreshProducts: () => Promise<void>;
}

export type UseProductsReturn = UseProductsState & UseProductsActions;

/**
 * Custom hook for managing products state and operations
 */
export function useProducts(initialParams: ProductListParams = {}): UseProductsReturn {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    }
  });

  const [currentParams, setCurrentParams] = useState<ProductListParams>(initialParams);

  // Fetch products
  const fetchProducts = useCallback(async (params: ProductListParams = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const newParams = { ...currentParams, ...params };
      setCurrentParams(newParams);
      
      const response = await productService.getProducts(newParams);
      
      setState(prev => ({
        ...prev,
        products: response.data,
        pagination: response.pagination,
        loading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch products',
        loading: false
      }));
    }
  }, [currentParams]);

  // Create product
  const createProduct = useCallback(async (productData: CreateProductRequest): Promise<ProductModel> => {
    setState(prev => ({ ...prev, error: null }));
    
    try {
      const newProduct = await productService.createProduct(productData);
      
      // Refresh the list
      await fetchProducts();
      
      return newProduct;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to create product'
      }));
      throw error;
    }
  }, [fetchProducts]);

  // Update product
  const updateProduct = useCallback(async (id: string, updates: UpdateProductRequest): Promise<ProductModel> => {
    setState(prev => ({ ...prev, error: null }));
    
    try {
      const updatedProduct = await productService.updateProduct(id, updates);
      
      // Update the product in the local state
      setState(prev => ({
        ...prev,
        products: prev.products.map(product => 
          product.id === id ? updatedProduct.getData() : product
        )
      }));
      
      return updatedProduct;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to update product'
      }));
      throw error;
    }
  }, []);

  // Delete product
  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    setState(prev => ({ ...prev, error: null }));
    
    try {
      await productService.deleteProduct(id);
      
      // Remove the product from the local state
      setState(prev => ({
        ...prev,
        products: prev.products.filter(product => product.id !== id),
        pagination: {
          ...prev.pagination,
          total: prev.pagination.total - 1
        }
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to delete product'
      }));
      throw error;
    }
  }, []);

  // Search products
  const searchProducts = useCallback(async (query: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const products = await productService.searchProducts(query);
      
      setState(prev => ({
        ...prev,
        products,
        loading: false,
        pagination: {
          page: 1,
          limit: products.length,
          total: products.length,
          totalPages: 1
        }
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to search products',
        loading: false
      }));
    }
  }, []);

  // Update stock
  const updateStock = useCallback(async (id: string, quantity: number): Promise<ProductModel> => {
    setState(prev => ({ ...prev, error: null }));
    
    try {
      const updatedProduct = await productService.updateStock(id, quantity);
      
      // Update the product in the local state
      setState(prev => ({
        ...prev,
        products: prev.products.map(product => 
          product.id === id ? updatedProduct.getData() : product
        )
      }));
      
      return updatedProduct;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to update stock'
      }));
      throw error;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Refresh products with current parameters
  const refreshProducts = useCallback(async (): Promise<void> => {
    await fetchProducts(currentParams);
  }, [fetchProducts, currentParams]);

  // Initial load
  useEffect(() => {
    fetchProducts(initialParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return {
    ...state,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    updateStock,
    clearError,
    refreshProducts
  };
}

// Hook for managing a single product
interface UseProductState {
  product: ProductModel | null;
  loading: boolean;
  error: string | null;
}

interface UseProductActions {
  fetchProduct: (id: string) => Promise<void>;
  updateProduct: (updates: UpdateProductRequest) => Promise<ProductModel>;
  updateStock: (quantity: number) => Promise<ProductModel>;
  clearError: () => void;
  clearProduct: () => void;
}

export type UseProductReturn = UseProductState & UseProductActions;

/**
 * Custom hook for managing a single product
 */
export function useProduct(productId?: string): UseProductReturn {
  const [state, setState] = useState<UseProductState>({
    product: null,
    loading: false,
    error: null
  });

  // Fetch product by ID
  const fetchProduct = useCallback(async (id: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const product = await productService.getProductById(id);
      setState(prev => ({ ...prev, product, loading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch product',
        loading: false
      }));
    }
  }, []);

  // Update product
  const updateProduct = useCallback(async (updates: UpdateProductRequest): Promise<ProductModel> => {
    if (!state.product) {
      throw new Error('No product loaded');
    }

    setState(prev => ({ ...prev, error: null }));
    
    try {
      const updatedProduct = await productService.updateProduct(state.product.getData().id, updates);
      setState(prev => ({ ...prev, product: updatedProduct }));
      return updatedProduct;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to update product'
      }));
      throw error;
    }
  }, [state.product]);

  // Update stock
  const updateStock = useCallback(async (quantity: number): Promise<ProductModel> => {
    if (!state.product) {
      throw new Error('No product loaded');
    }

    setState(prev => ({ ...prev, error: null }));
    
    try {
      const updatedProduct = await productService.updateStock(state.product.getData().id, quantity);
      setState(prev => ({ ...prev, product: updatedProduct }));
      return updatedProduct;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to update stock'
      }));
      throw error;
    }
  }, [state.product]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Clear product
  const clearProduct = useCallback(() => {
    setState({ product: null, loading: false, error: null });
  }, []);

  // Load product on mount if productId provided
  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  return {
    ...state,
    fetchProduct,
    updateProduct,
    updateStock,
    clearError,
    clearProduct
  };
}

// Hook for managing product categories
interface UseCategoriesState {
  categories: ProductCategory[];
  loading: boolean;
  error: string | null;
}

interface UseCategoriesActions {
  fetchCategories: () => Promise<void>;
  clearError: () => void;
}

export type UseCategoriesReturn = UseCategoriesState & UseCategoriesActions;

/**
 * Custom hook for managing product categories
 */
export function useCategories(): UseCategoriesReturn {
  const [state, setState] = useState<UseCategoriesState>({
    categories: [],
    loading: false,
    error: null
  });

  // Fetch categories
  const fetchCategories = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const categories = await productService.getCategories();
      setState(prev => ({ ...prev, categories, loading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch categories',
        loading: false
      }));
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    ...state,
    fetchCategories,
    clearError
  };
}