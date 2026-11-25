CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS products (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL CHECK (length(trim(name)) > 0),
 price NUMERIC(12,2) NOT NULL CHECK (price >= 0), image_url TEXT, category TEXT NOT NULL DEFAULT 'ทั่วไป',
 sku TEXT UNIQUE, stock INTEGER CHECK (stock IS NULL OR stock >= 0), low_stock_threshold INTEGER NOT NULL DEFAULT 3,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'ทั่วไป';
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER NOT NULL DEFAULT 3;
CREATE UNIQUE INDEX IF NOT EXISTS products_sku_unique_idx ON products(sku) WHERE sku IS NOT NULL;
CREATE TABLE IF NOT EXISTS costs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), description TEXT NOT NULL CHECK (length(trim(description)) > 0),
 amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0), created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sales (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), items_json JSONB NOT NULL,
 subtotal NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0), discount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
 total NUMERIC(12,2) NOT NULL CHECK (total >= 0), payment_method TEXT NOT NULL CHECK (payment_method IN ('Cash','Transfer')),
 received NUMERIC(12,2) NOT NULL CHECK (received >= 0), change_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (change_amount >= 0),
 donation NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (donation >= 0), status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('COMPLETED','VOID')),
 idempotency_key TEXT UNIQUE, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS pos_sessions (
 session_code VARCHAR(6) PRIMARY KEY CHECK (session_code ~ '^[0-9]{4,6}$'),
 status TEXT NOT NULL DEFAULT 'IDLE' CHECK (status IN ('IDLE','CHECKING_OUT','PAID')),
 cart_json JSONB NOT NULL DEFAULT '[]'::jsonb, subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
 discount NUMERIC(12,2) NOT NULL DEFAULT 0, total NUMERIC(12,2) NOT NULL DEFAULT 0,
 payment_method TEXT CHECK (payment_method IN ('Cash','Transfer')), received NUMERIC(12,2) NOT NULL DEFAULT 0,
 change_amount NUMERIC(12,2) NOT NULL DEFAULT 0, donation NUMERIC(12,2) NOT NULL DEFAULT 0,
 qr_data TEXT, sale_id UUID REFERENCES sales(id), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sales_created_at_idx ON sales(created_at DESC);
CREATE INDEX IF NOT EXISTS sales_status_created_idx ON sales(status, created_at DESC);
CREATE INDEX IF NOT EXISTS costs_created_at_idx ON costs(created_at DESC);
