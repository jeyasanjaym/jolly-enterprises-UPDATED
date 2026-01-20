import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { Plus, Edit, Trash2, Package, ShoppingCart, Users, DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../utils/imageHelper'

const AdminDashboard = () => {
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login')
      return
    }
    fetchProducts()
    fetchStats()
  }, [user, navigate])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products?limit=100')
      setProducts(res.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/dashboard')
      setStats(res.data.stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      await axios.delete(`/api/products/${id}`)
      fetchProducts()
      fetchStats()
    } catch (error) {
      alert('Error deleting product: ' + (error.response?.data?.message || error.message))
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {user?.name}</span>
              <button onClick={logout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                </div>
                <Package className="text-blue-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
                <ShoppingCart className="text-green-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="text-purple-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="text-yellow-500" size={32} />
              </div>
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Products</h2>
            <button
              onClick={() => {
                setEditingProduct(null)
                setShowProductForm(true)
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Product
            </button>
          </div>

          {showProductForm && (
            <ProductForm
              product={editingProduct}
              onClose={() => {
                setShowProductForm(false)
                setEditingProduct(null)
              }}
              onSuccess={() => {
                fetchProducts()
                fetchStats()
                setShowProductForm(false)
                setEditingProduct(null)
              }}
            />
          )}

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-4 py-3">
                      <img
                        src={getImageUrl(product.images?.[0])}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">₹{product.price}</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product)
                            setShowProductForm(true)
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProductForm = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'T-Shirt',
    subcategory: product?.subcategory || '',
    price: product?.price || '',
    originalPrice: product?.originalPrice || '',
    stock: product?.stock || 0,
    sizes: product?.sizes?.join(', ') || '',
    colors: product?.colors?.join(', ') || '',
    featured: product?.featured || false,
    newArrival: product?.newArrival || false,
    backInStock: product?.backInStock || false,
    inStock: product?.inStock !== false,
  })
  const [images, setImages] = useState([])
  const [existingImages, setExistingImages] = useState(product?.images || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    'T-Shirt',
    'Pant / Track',
    'Co-Ord Set',
    'Shirt',
    'Hoodies',
    'Shoes',
    'Slipper',
    'Perfume',
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files))
  }

  const handleRemoveImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      
      // Add form fields
      Object.keys(formData).forEach((key) => {
        if (key !== 'images') {
          formDataToSend.append(key, formData[key])
        }
      })

      // Add existing images
      existingImages.forEach((img) => {
        formDataToSend.append('images', img)
      })

      // Add new images
      images.forEach((img) => {
        formDataToSend.append('images', img)
      })

      let res
      if (product) {
        res = await axios.put(`/api/products/${product._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        res = await axios.post('/api/products', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      onSuccess()
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subcategory</label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Original Price (₹)</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sizes (comma separated)</label>
                <input
                  type="text"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleChange}
                  placeholder="S, M, L, XL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Colors (comma separated)</label>
                <input
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleChange}
                  placeholder="Red, Blue, Green"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Product Images</label>
              {existingImages.length > 0 && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={getImageUrl(img)}
                        alt={`Existing ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
              <p className="text-sm text-gray-500 mt-1">
                You can select multiple images (max 10, 5MB each)
              </p>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="mr-2"
                />
                Featured
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="newArrival"
                  checked={formData.newArrival}
                  onChange={handleChange}
                  className="mr-2"
                />
                New Arrival
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="backInStock"
                  checked={formData.backInStock}
                  onChange={handleChange}
                  className="mr-2"
                />
                Back in Stock
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="mr-2"
                />
                In Stock
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

