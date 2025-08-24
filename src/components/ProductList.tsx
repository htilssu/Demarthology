// Product List Component - View layer demonstrating MVC pattern
import React, { useState } from 'react';
import { useProducts, useCategories } from '../hooks';
import { CreateProductRequest } from '../models';
import Button from './Button';

const ProductList: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Controller: Use custom hooks to manage product state and operations
  const {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    updateStock,
    clearError
  } = useProducts({ limit: 4 });

  const { categories } = useCategories();

  // Form state for creating new product
  const [createForm, setCreateForm] = useState<CreateProductRequest>({
    name: '',
    description: '',
    price: 0,
    category: '',
    tags: [],
    stockQuantity: 0
  });

  // Handle search
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchProducts(searchQuery);
    } else {
      await fetchProducts();
    }
  };

  // Handle category filter
  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    if (category) {
      await fetchProducts({ category });
    } else {
      await fetchProducts();
    }
  };

  // Handle create product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct({
        ...createForm,
        tags: createForm.tags || []
      });
      setCreateForm({
        name: '',
        description: '',
        price: 0,
        category: '',
        tags: [],
        stockQuantity: 0
      });
      setShowCreateForm(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  // Handle stock update
  const handleUpdateStock = async (id: string, currentStock: number) => {
    const newStock = prompt(`Current stock: ${currentStock}. Enter new stock quantity:`, currentStock.toString());
    if (newStock !== null && !isNaN(Number(newStock))) {
      await updateStock(id, Number(newStock));
    }
  };

  // Handle price update
  const handleUpdatePrice = async (id: string, currentPrice: number) => {
    const newPrice = prompt(`Current price: $${currentPrice}. Enter new price:`, currentPrice.toString());
    if (newPrice !== null && !isNaN(Number(newPrice))) {
      await updateProduct(id, { price: Number(newPrice) });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          📦 Product Management (MVC Demo)
        </h2>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant="primary"
          size="sm"
        >
          {showCreateForm ? 'Cancel' : '+ Add Product'}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-500 hover:text-red-700">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-3 mb-4">
        {/* Search */}
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or description..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} size="sm">
            🔍 Search
          </Button>
          <Button onClick={() => { setSearchQuery(''); fetchProducts(); }} variant="outline" size="sm">
            Clear
          </Button>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name} ({category.productCount})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Create Product Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateProduct} className="bg-gray-50 p-4 rounded-md mb-4">
          <h3 className="text-lg font-medium mb-3">Create New Product</h3>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Product Name"
              value={createForm.name}
              onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Price"
              step="0.01"
              value={createForm.price}
              onChange={(e) => setCreateForm(prev => ({ ...prev, price: Number(e.target.value) }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={createForm.category}
              onChange={(e) => setCreateForm(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={createForm.stockQuantity}
              onChange={(e) => setCreateForm(prev => ({ ...prev, stockQuantity: Number(e.target.value) }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <textarea
            placeholder="Product Description"
            value={createForm.description}
            onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
          <div className="flex gap-2 mt-3">
            <Button type="submit" variant="primary" size="sm">
              Create Product
            </Button>
            <Button type="button" onClick={() => setShowCreateForm(false)} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Product Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => {
            const stockStatus = product.stockQuantity === 0 ? 'out-of-stock' : product.stockQuantity <= 5 ? 'low-stock' : 'in-stock';
            
            return (
              <div key={product.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                <div className="flex gap-3">
                  <img
                    src={`https://via.placeholder.com/80x80/e2e8f0/64748b?text=${encodeURIComponent(product.name)}`}
                    alt={product.name}
                    className="w-20 h-20 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-green-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Category: {product.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stockStatus === 'out-of-stock' 
                          ? 'bg-red-100 text-red-800'
                          : stockStatus === 'low-stock'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        Stock: {product.stockQuantity}
                      </span>
                      <span className="text-sm text-gray-500">
                        ⭐ {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    onClick={() => handleUpdatePrice(product.id, product.price)}
                    variant="outline"
                    size="sm"
                  >
                    Update Price
                  </Button>
                  <Button
                    onClick={() => handleUpdateStock(product.id, product.stockQuantity)}
                    variant="outline"
                    size="sm"
                  >
                    Update Stock
                  </Button>
                  <Button
                    onClick={() => handleDeleteProduct(product.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found</p>
          <Button onClick={() => fetchProducts()} variant="outline" size="sm" className="mt-2">
            Refresh
          </Button>
        </div>
      )}

      {/* Pagination Info */}
      {pagination.total > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {products.length} of {pagination.total} products
          {pagination.totalPages > 1 && (
            <span> (Page {pagination.page} of {pagination.totalPages})</span>
          )}
        </div>
      )}

      {/* MVC Architecture Explanation */}
      <div className="mt-6 bg-blue-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">🏗️ MVC Architecture Demo</h3>
        <div className="text-xs text-blue-700 space-y-1">
          <p><strong>Model:</strong> Product.ts - Data structure, validation, business logic</p>
          <p><strong>View:</strong> ProductList.tsx (this component) - UI presentation layer</p>
          <p><strong>Controller:</strong> useProducts hook + ProductService.ts - State management & API calls</p>
        </div>
      </div>
    </div>
  );
};

export default ProductList;