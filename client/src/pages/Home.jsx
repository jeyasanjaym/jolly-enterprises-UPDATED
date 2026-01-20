import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import { ShoppingBag, Truck, Shield, Star } from 'lucide-react'

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([])
  const [backInStock, setBackInStock] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const [newArrivalsRes, backInStockRes, featuredRes] = await Promise.all([
        axios.get('/api/products?newArrival=true&limit=6'),
        axios.get('/api/products?backInStock=true&limit=6'),
        axios.get('/api/products?featured=true&limit=6'),
      ])

      setNewArrivals(newArrivalsRes.data.products || [])
      setBackInStock(backInStockRes.data.products || [])
      setFeatured(featuredRes.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Jolly Enterprises</h1>
          <p className="text-xl mb-8">Premium Clothing for Every Style</p>
          <Link to="/products" className="btn-primary inline-block">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Truck className="mx-auto mb-2" size={40} />
              <h3 className="font-semibold mb-1">Fast Shipping</h3>
              <p className="text-sm text-gray-600">Ships in 24–48 Hours</p>
            </div>
            <div className="text-center">
              <Star className="mx-auto mb-2" size={40} />
              <h3 className="font-semibold mb-1">4.8★ Rating</h3>
              <p className="text-sm text-gray-600">from 8,000+ customers</p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto mb-2" size={40} />
              <h3 className="font-semibold mb-1">Secure Checkout</h3>
              <p className="text-sm text-gray-600">Secure Checkout with Buyer Protection</p>
            </div>
            <div className="text-center">
              <ShoppingBag className="mx-auto mb-2" size={40} />
              <h3 className="font-semibold mb-1">Store Location</h3>
              <p className="text-sm text-gray-600">Visit our 5 Stores in Coimbatore</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">NEW ARRIVAL</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back in Stock */}
      {backInStock.length > 0 && (
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">BACK IN STOCK</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {backInStock.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">FEATURED PRODUCTS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home

