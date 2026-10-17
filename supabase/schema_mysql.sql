-- ========================================================
-- ORVANO E-COMMERCE STORE - HOSTINGER MYSQL DATABASE SCHEMA
-- Copy and paste this entire code into phpMyAdmin -> SQL tab
-- ========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  avatar_url TEXT,
  address JSON,
  is_admin TINYINT(1) DEFAULT 0,
  admin_pin VARCHAR(50) DEFAULT '123456',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2) DEFAULT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  images JSON,
  stock_quantity INT DEFAULT 0,
  glow_color VARCHAR(100) DEFAULT 'rgba(35, 95, 175, 0.55)',
  display_order INT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) DEFAULT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Store Settings Table
CREATE TABLE IF NOT EXISTS store_settings (
  id INT PRIMARY KEY DEFAULT 1,
  bank_name VARCHAR(255),
  account_title VARCHAR(255),
  account_number VARCHAR(255),
  iban VARCHAR(255),
  hero_watch_image TEXT,
  hero_pants_image TEXT,
  premium_box_image TEXT,
  phone_number VARCHAR(100) DEFAULT '+1 (800) 555-0199',
  whatsapp_number VARCHAR(100) DEFAULT '+92 300 0138707',
  instagram_url TEXT,
  tiktok_url TEXT,
  facebook_url TEXT,
  hero_slides JSON,
  popup_cards JSON,
  coupons JSON,
  shipping_fee DECIMAL(10, 2) DEFAULT 0.00,
  free_shipping_threshold DECIMAL(10, 2) DEFAULT 0.00,
  watch_packaging_image TEXT,
  watch_packaging_desc TEXT,
  pants_packaging_image TEXT,
  pants_packaging_desc TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default single row into store_settings if not exists
INSERT INTO store_settings (id, bank_name, account_title, account_number, iban)
VALUES (1, 'Premium Global Bank', 'Orvano Official', '1234-5678-9012', 'PK36 PGBK 1234 5678 9012')
ON DUPLICATE KEY UPDATE id=1;

-- 6. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id VARCHAR(36) PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
