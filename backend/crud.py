from database import get_db
from datetime import datetime

def get_all_products(category: str = None):
    conn = get_db()
    cursor = conn.cursor()
    if category and category != "All":
        cursor.execute("SELECT * FROM products WHERE category = ?", (category,))
    else:
        cursor.execute("SELECT * FROM products")
    products = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return products

def add_product(name, category, price, stock, image):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO products (name, category, price, stock, image) VALUES (?, ?, ?, ?, ?)",
                   (name, category, price, stock, image))
    conn.commit()
    conn.close()

def update_product(prod_id, price, stock):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE products SET price = ?, stock = ? WHERE id = ?", (price, stock, prod_id))
    conn.commit()
    conn.close()

def authenticate_user(email, password):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, role FROM users WHERE email = ? AND password = ?", (email, password))
    user = cursor.fetchone()
    conn.close()
    return dict(user) if user else None

def create_user(name, email, password):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'customer')",
                   (name, email, password))
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()
    return {"id": user_id, "name": name, "email": email, "role": "customer"}

def create_order(user_id, items, total):
    conn = get_db()
    cursor = conn.cursor()
    order_date = datetime.now().strftime("%Y-%m-%d")
    
    # Insert order
    cursor.execute("INSERT INTO orders (user_id, total, status, date) VALUES (?, ?, 'Paid', ?)",
                   (user_id, total, order_date))
    
    # Deduct stock for each purchased item
    for item in items:
        cursor.execute("UPDATE products SET stock = stock - ? WHERE id = ?", (item.qty, item.productId))
        
    conn.commit()
    conn.close()

def get_user_orders(user_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC", (user_id,))
    orders = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return orders

def get_all_orders():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT orders.id, users.name as customer_name, orders.date, orders.total, orders.status 
        FROM orders 
        JOIN users ON orders.user_id = users.id 
        ORDER BY orders.id DESC
    """)
    orders = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return orders

def update_order_status(order_id, status):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE orders SET status = ? WHERE id = ?", (status, order_id))
    conn.commit()
    conn.close()