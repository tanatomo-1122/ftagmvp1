'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Product {
  id: number
  name: string
  description?: string
  price?: number
  created_at?: string
}

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        // URLパラメータからidを取得（例: /product?id=1）
        const urlParams = new URLSearchParams(window.location.search)
        const productId = urlParams.get('id')
        
        if (!productId) {
          setError('商品IDが指定されていません')
          return
        }

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()

        if (error) {
          setError(error.message)
        } else {
          setProduct(data)
        }
      } catch {
        setError('商品の取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [])

  if (loading) {
    return <div className="p-4">読み込み中...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>
  }

  if (!product) {
    return <div className="p-4">商品が見つかりません</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      {product.description && (
        <p className="mb-4">{product.description}</p>
      )}
      {product.price && (
        <p className="text-lg font-semibold mb-4">¥{product.price.toLocaleString()}</p>
      )}
      <div className="text-sm text-gray-500">
        <p>ID: {product.id}</p>
        {product.created_at && (
          <p>作成日: {new Date(product.created_at).toLocaleDateString('ja-JP')}</p>
        )}
      </div>
    </div>
  )
}

