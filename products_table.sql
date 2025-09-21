-- productsテーブルを作成するSQL
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  nutrition_info JSONB,
  allergen_info JSONB,
  manufacturer VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスを作成（検索パフォーマンス向上のため）
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_manufacturer ON products(manufacturer);

-- updated_atを自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_atトリガーを作成
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- サンプルデータを挿入（テスト用）
INSERT INTO products (name, description, nutrition_info, allergen_info, manufacturer) VALUES
(
  'オーガニック バナナ',
  '自然栽培で育てられた甘いバナナです。',
  '{"calories": 89, "protein": 1.1, "carbs": 22.8, "fat": 0.3, "fiber": 2.6}',
  '{"allergens": [], "may_contain": []}',
  'グリーンファーム株式会社'
),
(
  '国産 りんご',
  '青森県産の新鮮なりんごです。',
  '{"calories": 52, "protein": 0.3, "carbs": 13.8, "fat": 0.2, "fiber": 2.4}',
  '{"allergens": [], "may_contain": []}',
  '青森りんご農園'
),
(
  'アーモンドミルク',
  '植物性のミルクです。乳製品不使用。',
  '{"calories": 39, "protein": 1.0, "carbs": 1.5, "fat": 3.2, "fiber": 0.5}',
  '{"allergens": ["nuts"], "may_contain": []}',
  'プラントベース食品株式会社'
);

