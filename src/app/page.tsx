'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface NutritionInfo {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
}

interface AllergenInfo {
  allergens: string[]
  may_contain: string[]
}

interface Product {
  id: number
  name: string
  description?: string
  nutrition_info?: NutritionInfo
  allergen_info?: AllergenInfo
  manufacturer?: string
  created_at?: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          setError(error.message)
        } else {
          setProducts(data || [])
        }
      } catch {
        setError('商品の取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">エラー: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">商品一覧</h1>
        
        {products.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            商品がありません
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                
                {product.description && (
                  <p className="text-gray-600 mb-3">{product.description}</p>
                )}
                
                {product.manufacturer && (
                  <p className="text-sm text-gray-500 mb-3">
                    製造者: {product.manufacturer}
                  </p>
                )}
                
                {product.nutrition_info && (
                  <div className="mb-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">栄養情報</h3>
                    <div className="text-sm text-gray-600">
                      {product.nutrition_info.calories && (
                        <p>カロリー: {product.nutrition_info.calories}kcal</p>
                      )}
                      {product.nutrition_info.protein && (
                        <p>タンパク質: {product.nutrition_info.protein}g</p>
                      )}
                    </div>
                  </div>
                )}
                
                {product.allergen_info && product.allergen_info.allergens && product.allergen_info.allergens.length > 0 && (
                  <div className="mb-3">
                    <h3 className="text-sm font-medium text-red-600 mb-1">アレルギー情報</h3>
                    <p className="text-sm text-red-600">
                      {product.allergen_info.allergens.join(', ')}
                    </p>
                  </div>
                )}
                
                <div className="text-xs text-gray-400">
                  ID: {product.id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
