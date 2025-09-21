import QRCode from 'qrcode'
import fs from 'fs'
import path from 'path'

// コマンドライン引数から商品IDを取得
const productId = process.argv[2]

if (!productId) {
  console.error('使用方法: npm run generate-qr <商品ID>')
  console.error('例: npm run generate-qr 1')
  process.exit(1)
}

// ベースURL（本番環境では実際のドメインに変更）
const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
const productUrl = `${baseUrl}/product?id=${productId}`

// QRコード生成のオプション
const qrOptions = {
  type: 'image/png' as const,
  quality: 0.92,
  margin: 1,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  },
  width: 256
}

async function generateQRCode() {
  try {
    console.log(`商品ID ${productId} のQRコードを生成中...`)
    console.log(`URL: ${productUrl}`)

    // QRコードを生成
    const qrCodeDataURL: string = await QRCode.toDataURL(productUrl, qrOptions)
    
    // DataURLからBufferに変換
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    
    // 出力ディレクトリを作成
    const outputDir = path.join(process.cwd(), 'public', 'qr-codes')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    // ファイル名を生成
    const fileName = `product-${productId}-qr.png`
    const filePath = path.join(outputDir, fileName)
    
    // ファイルに保存
    fs.writeFileSync(filePath, buffer)
    
    console.log(`✅ QRコードが生成されました: ${filePath}`)
    console.log(`📱 アクセスURL: ${productUrl}`)
    console.log(`🖼️ 画像パス: /qr-codes/${fileName}`)
    
  } catch (error) {
    console.error('❌ QRコード生成エラー:', error)
    process.exit(1)
  }
}

// 複数の商品IDを指定した場合の処理
async function generateMultipleQRCodes() {
  const ids = process.argv.slice(2)
  
  console.log(`${ids.length}個の商品のQRコードを生成します...`)
  
  for (const id of ids) {
    process.argv[2] = id
    await generateQRCode()
    console.log('---')
  }
  
  console.log('🎉 全てのQRコード生成が完了しました！')
}

// メイン実行
if (process.argv.length > 3) {
  generateMultipleQRCodes()
} else {
  generateQRCode()
}
