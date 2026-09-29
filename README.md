# 🛒 Ecom-Sem3 | Full-Stack E-Commerce Web Application

A lightweight, full-stack E-Commerce web application built with **Python (FastAPI)**, **SQL**, and **JavaScript / HTML / CSS**. 

The project follows a single-service architecture where FastAPI manages the relational database, processes all core business logic (authentication, stock validation, price calculations, and admin metrics), and directly serves the static frontend pages.

---

## 🌟 Key Features

### 👤 Customer Features
- **User Authentication:** Registration and login functionality validated server-side.
- **Product Catalog:** Filter products dynamically by category (Electronics, Fashion, Home & Kitchen, Books).
- **Cart & Checkout:** Real-time client-side cart buffer with server-side stock validation and order processing.
- **Order History:** View past orders and live tracking statuses (*Paid*, *Shipped*, etc.).

### ⚙️ Admin Dashboard
- **Analytics Overview:** Live metrics for total revenue, total orders, catalog size, and low-stock alerts.
- **Inventory Management:** Update product pricing and stock counts directly with real-time database updates.
- **Order Fulfillment:** Monitor incoming customer orders and modify fulfillment status.

---

## 🏗️ Project Architecture & Directory Structure

```text
Ecom-Sem3/
│
├── backend/
│   ├── main.py           # FastAPI application, REST endpoints, & static file routing
│   ├── database.py       # SQLite connection setup & table initialization
│   ├── models.py         # Pydantic schemas for data validation
│   ├── crud.py           # Database CRUD helper functions
│   └── requirements.txt  # Python dependencies
│
├── frontend/
│   ├── index.html        # Authentication page (Login/Register)
│   ├── shop.html         # Main product catalog page
│   ├── checkout.html     # Shopping cart & customer order history
│   ├── admin.html        # Admin analytics & inventory management dashboard
│   ├── css/
│   │   └── style.css     # UI styles and layout
│   └── js/
│       └── script.js     # API client fetching data from FastAPI endpoints
│
├── Procfile              # Command instructions for production deployment
└── README.md             # Project documentation