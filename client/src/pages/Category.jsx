import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

const Category = () => {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const subcategory = searchParams.get('subcategory')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [category, subcategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      let url = `/api/products?category=${category}`
      if (subcategory) {
        url += `&subcategory=${subcategory}`
      }
      const res = await axios.get(url)
      setProducts(res.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {subcategory || category}
      </h1>
      
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">No products found in this category</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Category

