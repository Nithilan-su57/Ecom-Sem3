import sqlite3

DB_NAME = "ecommerce.db"

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row  # Returns query results as dictionary-like objects
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. Users Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'customer'
        )
    ''')

    # 2. Products Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            stock INTEGER NOT NULL,
            image TEXT
        )
    ''')

    # 3. Orders Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total REAL NOT NULL,
            status TEXT NOT NULL DEFAULT 'Paid',
            date TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Seed Default Data (Admin User and Default Products if empty)
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
                       ("Sujeeth S", "admin@store.com", "admin123", "admin"))
        cursor.execute("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
                       ("Test Customer", "customer@store.com", "pass123", "customer"))

    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        seed_products = [
            ("Wireless Earbuds", "Electronics", 1999, 34, "https://images.unsplash.com/photo-1572569432755-e9aa2febb35f?w=400&q=80"),
            ("Smart Watch", "Electronics", 3499, 12, "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80"),
            ("Cotton T-Shirt", "Fashion", 499, 80, "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80"),
            ("Running Shoes", "Fashion", 2299, 0, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"),
            ("Non-stick Pan", "Home & Kitchen", 899, 25, "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80")
        ]
        cursor.executemany("INSERT INTO products (name, category, price, stock, image) VALUES (?, ?, ?, ?, ?)", seed_products)

    conn.commit()
    conn.close()