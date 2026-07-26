/* ============================================================
   Mock data layer.
   In the real system these arrays/functions are replaced by
   fetch() calls to the backend, which in turn run SQL against
   the Customers, Products, Categories, Carts, Orders and
   Payments tables. Kept in localStorage here so the UI is
   fully clickable without a server.
   ============================================================ */

const DB_KEY = "ecom_db_v2";

function seedDB(){
  return {
    users: [
      {id:1, name:"Sujeeth S", email:"admin@store.com", password:"admin123", role:"admin"},
      {id:2, name:"Test Customer", email:"customer@store.com", password:"pass123", role:"customer"}
    ],
    categories: ["Electronics","Fashion","Home & Kitchen","Books"],
    products: [
      {id:1, name:"Wireless Earbuds", category:"Electronics", price:1999, stock:34, image:"https://images.unsplash.com/photo-1572569432755-e9aa2febb35f?w=400&q=80"},
      {id:2, name:"Smart Watch", category:"Electronics", price:3499, stock:12, image:"https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80"},
      {id:3, name:"Cotton T-Shirt", category:"Fashion", price:499, stock:80, image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80"},
      {id:4, name:"Running Shoes", category:"Fashion", price:2299, stock:0, image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"},
      {id:5, name:"Non-stick Pan", category:"Home & Kitchen", price:899, stock:25, image:"https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80"},
      {id:6, name:"Table Lamp", category:"Home & Kitchen", price:749, stock:18, image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80"},
      {id:7, name:"DBMS Textbook", category:"Books", price:599, stock:40, image:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80"},
      {id:8, name:"Novel: The Silent Patient", category:"Books", price:349, stock:22, image:"https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80"}
    ],
    cart: [],          // {productId, qty}  -- current logged-in customer's cart
    orders: [           // past orders, all customers (admin can see all; customer sees own)
      {id:101, userId:2, items:[{productId:3, qty:2, price:499}], total:998, status:"Paid", date:"2026-07-20"},
      {id:102, userId:2, items:[{productId:7, qty:1, price:599}], total:599, status:"Shipped", date:"2026-07-15"}
    ],
    session: null       // {id, name, role}
  };
}

function getDB(){
  let raw = localStorage.getItem(DB_KEY);
  if(!raw){ const seed = seedDB(); localStorage.setItem(DB_KEY, JSON.stringify(seed)); return seed; }
  return JSON.parse(raw);
}
function saveDB(db){ localStorage.setItem(DB_KEY, JSON.stringify(db)); }
function resetDB(){ localStorage.removeItem(DB_KEY); location.reload(); }

function currentUser(){ return getDB().session; }
function requireLogin(role){
  const u = currentUser();
  if(!u){ window.location.href = "index.html"; return null; }
  if(role && u.role !== role){ window.location.href = role==="admin" ? "shop.html" : "admin.html"; return null; }
  return u;
}
function logout(){ const db=getDB(); db.session=null; saveDB(db); window.location.href="index.html"; }

function toast(msg){
  let t = document.getElementById("toast");
  if(!t){
    t = document.createElement("div");
    t.id="toast"; t.className="toast"; document.body.appendChild(t);
  }
  t.textContent = msg; t.style.display="block";
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(()=> t.style.display="none", 1800);
}

/* ---------------- Auth page ---------------- */
function initAuthPage(){
  const loginTab=document.getElementById("tab-login"), regTab=document.getElementById("tab-register");
  const loginForm=document.getElementById("login-form"), regForm=document.getElementById("register-form");
  loginTab.onclick=()=>{loginTab.classList.add("active");regTab.classList.remove("active");loginForm.style.display="block";regForm.style.display="none";};
  regTab.onclick=()=>{regTab.classList.add("active");loginTab.classList.remove("active");regForm.style.display="block";loginForm.style.display="none";};

  loginForm.onsubmit = e=>{
    e.preventDefault();
    const email=document.getElementById("login-email").value.trim();
    const pass=document.getElementById("login-pass").value;
    const err=document.getElementById("login-error");
    const db=getDB();
    const user=db.users.find(u=>u.email===email && u.password===pass);
    if(!user){ err.textContent="Invalid email or password."; return; }
    db.session={id:user.id, name:user.name, role:user.role};
    saveDB(db);
    window.location.href = user.role==="admin" ? "admin.html" : "shop.html";
  };

  regForm.onsubmit = e=>{
    e.preventDefault();
    const name=document.getElementById("reg-name").value.trim();
    const email=document.getElementById("reg-email").value.trim();
    const pass=document.getElementById("reg-pass").value;
    const err=document.getElementById("reg-error");
    const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRe.test(email)){ err.textContent="Enter a valid email address."; return; }
    if(pass.length<6){ err.textContent="Password must be at least 6 characters."; return; }
    const db=getDB();
    if(db.users.some(u=>u.email===email)){ err.textContent="An account with this email already exists."; return; }
    const newUser={id:Date.now(), name, email, password:pass, role:"customer"};
    db.users.push(newUser);
    db.session={id:newUser.id, name:newUser.name, role:"customer"};
    saveDB(db);
    window.location.href="shop.html";
  };
}

/* ---------------- Product icons (inline SVG, no external images) ---------------- */
const CATEGORY_ICONS = {
  "Electronics": `<svg viewBox="0 0 64 64"><rect x="14" y="10" width="36" height="44" rx="4" fill="#fff" opacity=".18"/>
    <rect x="19" y="16" width="26" height="26" rx="2" fill="#fff"/>
    <circle cx="32" cy="47" r="3" fill="#fff"/></svg>`,
  "Fashion": `<svg viewBox="0 0 64 64"><path d="M22 12 L32 20 L42 12 L52 20 L46 28 L46 54 L18 54 L18 28 L12 20 Z" fill="#fff"/>
    <circle cx="32" cy="18" r="4" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/></svg>`,
  "Home & Kitchen": `<svg viewBox="0 0 64 64"><ellipse cx="30" cy="34" rx="18" ry="10" fill="#fff"/>
    <rect x="46" y="30" width="12" height="6" rx="3" fill="#fff"/>
    <rect x="18" y="44" width="24" height="4" rx="2" fill="#fff" opacity=".5"/></svg>`,
  "Books": `<svg viewBox="0 0 64 64"><path d="M14 14 h16 a4 4 0 0 1 4 4 v32 a4 4 0 0 0-4-4 H14 Z" fill="#fff"/>
    <path d="M50 14 H34 a4 4 0 0 0-4 4 v32 a4 4 0 0 1 4-4 h16 Z" fill="#fff" opacity=".7"/></svg>`
};
function productIcon(category){
  return CATEGORY_ICONS[category] || `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="18" fill="#fff"/></svg>`;
}

/* ---------------- Shop page ---------------- */
function initShopPage(){
  const user = requireLogin("customer"); if(!user) return;
  document.getElementById("who").textContent = user.name;
  const db = getDB();
  let activeCat = "All";

  function renderFilters(){
    const wrap=document.getElementById("filters"); wrap.innerHTML="";
    ["All", ...db.categories].forEach(c=>{
      const chip=document.createElement("button");
      chip.className="chip"+(c===activeCat?" active":""); chip.textContent=c;
      chip.onclick=()=>{activeCat=c; renderFilters(); renderProducts();};
      wrap.appendChild(chip);
    });
  }
  function renderProducts(){
    const wrap=document.getElementById("products"); wrap.innerHTML="";
    const list = db.products.filter(p=> activeCat==="All" || p.category===activeCat);
    list.forEach(p=>{
      const el=document.createElement("div"); el.className="product";
      el.innerHTML = `<div class="swatch"><img src="${p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'}" alt="${p.name}"></div><h4>${p.name}</h4>
        <div class="muted">${p.category}</div>
        <div class="price">₹${p.price}</div>
        <div class="stock">${p.stock>0 ? p.stock+" in stock" : "Out of stock"}</div>
        <button class="btn small" ${p.stock===0?"disabled":""}>Add to cart</button>`;
      el.querySelector("button").onclick=()=> addToCart(p.id);
      wrap.appendChild(el);
    });
  }
  function addToCart(productId){
    const db=getDB();
    const line = db.cart.find(l=>l.productId===productId);
    if(line) line.qty += 1; else db.cart.push({productId, qty:1});
    saveDB(db);
    updateCartPill();
    toast("Added to cart");
  }
  function updateCartPill(){
    const db=getDB();
    const count = db.cart.reduce((s,l)=>s+l.qty,0);
    document.getElementById("cart-count").textContent = count;
  }
  renderFilters(); renderProducts(); updateCartPill();
}

/* ---------------- Checkout / cart page ---------------- */
function initCheckoutPage(){
  const user = requireLogin("customer"); if(!user) return;
  document.getElementById("who").textContent = user.name;

  function render(){
    const db=getDB();
    const tbody=document.getElementById("cart-body"); tbody.innerHTML="";
    let total=0;
    db.cart.forEach(line=>{
      const p = db.products.find(pr=>pr.id===line.productId);
      const lineTotal = p.price*line.qty; total+=lineTotal;
      const tr=document.createElement("tr");
      tr.innerHTML=`<td>${p.name}</td><td>₹${p.price}</td>
        <td><div class="qty-ctrl">
          <button data-act="dec">-</button><span>${line.qty}</span><button data-act="inc">+</button>
        </div></td><td>₹${lineTotal}</td>
        <td><button class="btn small danger" data-act="rm">Remove</button></td>`;
      tr.querySelector('[data-act="inc"]').onclick=()=>changeQty(line.productId,1);
      tr.querySelector('[data-act="dec"]').onclick=()=>changeQty(line.productId,-1);
      tr.querySelector('[data-act="rm"]').onclick=()=>removeLine(line.productId);
      tbody.appendChild(tr);
    });
    document.getElementById("cart-total").textContent = "₹"+total;
    document.getElementById("place-order").disabled = db.cart.length===0;
    document.getElementById("cart-count").textContent = db.cart.reduce((s,l)=>s+l.qty,0);
    renderOrderHistory(db, user);
  }
  function changeQty(productId, delta){
    const db=getDB();
    const line=db.cart.find(l=>l.productId===productId);
    line.qty += delta;
    if(line.qty<=0) db.cart = db.cart.filter(l=>l.productId!==productId);
    saveDB(db); render();
  }
  function removeLine(productId){
    const db=getDB(); db.cart = db.cart.filter(l=>l.productId!==productId);
    saveDB(db); render();
  }
  function renderOrderHistory(db,user){
    const wrap=document.getElementById("order-history"); wrap.innerHTML="";
    db.orders.filter(o=>o.userId===user.id).slice().reverse().forEach(o=>{
      const row=document.createElement("tr");
      row.innerHTML=`<td>#${o.id}</td><td>${o.date}</td><td>₹${o.total}</td>
        <td><span class="badge ${o.status.toLowerCase()}">${o.status}</span></td>`;
      wrap.appendChild(row);
    });
  }
  document.getElementById("place-order").onclick=()=>{
    const db=getDB();
    if(db.cart.length===0) return;
    const items = db.cart.map(l=>{
      const p=db.products.find(pr=>pr.id===l.productId);
      p.stock -= l.qty; // reflect inventory update
      return {productId:l.productId, qty:l.qty, price:p.price};
    });
    const total = items.reduce((s,i)=>s+i.price*i.qty,0);
    const order = {id: Math.floor(1000+Math.random()*9000), userId:user.id, items, total, status:"Paid",
      date: new Date().toISOString().slice(0,10)};
    db.orders.push(order);
    db.cart = [];
    saveDB(db);
    toast("Order placed successfully");
    render();
  };
  render();
}

/* ---------------- Admin page ---------------- */
function initAdminPage(){
  const user = requireLogin("admin"); if(!user) return;
  document.getElementById("who").textContent = user.name;
  const db = getDB();

  document.getElementById("stat-products").textContent = db.products.length;
  document.getElementById("stat-orders").textContent = db.orders.length;
  document.getElementById("stat-lowstock").textContent = db.products.filter(p=>p.stock<15).length;
  document.getElementById("stat-revenue").textContent = "₹"+db.orders.reduce((s,o)=>s+o.total,0);

  function renderProducts(){
    const tbody=document.getElementById("admin-products"); tbody.innerHTML="";
    const db=getDB();
    db.products.forEach(p=>{
      const tr=document.createElement("tr");
      tr.innerHTML=`<td>${p.name}</td><td>${p.category}</td>
        <td>₹<input type="number" value="${p.price}" style="width:80px;display:inline-block" data-f="price"></td>
        <td><input type="number" value="${p.stock}" style="width:70px;display:inline-block" data-f="stock"></td>
        <td><button class="btn small">Save</button></td>`;
      tr.querySelector("button").onclick=()=>{
        const db2=getDB();
        const prod=db2.products.find(x=>x.id===p.id);
        prod.price = Number(tr.querySelector('[data-f="price"]').value);
        prod.stock = Number(tr.querySelector('[data-f="stock"]').value);
        saveDB(db2); toast("Product updated");
      };
      tbody.appendChild(tr);
    });
  }
  function renderOrders(){
    const tbody=document.getElementById("admin-orders"); tbody.innerHTML="";
    const db=getDB();
    db.orders.slice().reverse().forEach(o=>{
      const cust = db.users.find(u=>u.id===o.userId);
      const tr=document.createElement("tr");
      tr.innerHTML=`<td>#${o.id}</td><td>${cust?cust.name:"—"}</td><td>${o.date}</td>
        <td>₹${o.total}</td>
        <td><select data-id="${o.id}">
          <option ${o.status==="Pending"?"selected":""}>Pending</option>
          <option ${o.status==="Paid"?"selected":""}>Paid</option>
          <option ${o.status==="Shipped"?"selected":""}>Shipped</option>
        </select></td>`;
      tr.querySelector("select").onchange=(e)=>{
        const db2=getDB();
        const ord=db2.orders.find(x=>x.id===o.id);
        ord.status = e.target.value; saveDB(db2); toast("Order status updated");
      };
      tbody.appendChild(tr);
    });
  }
  document.getElementById("add-product-form").onsubmit=(e)=>{
    e.preventDefault();
    const db2=getDB();
    const name=document.getElementById("np-name").value.trim();
    const cat=document.getElementById("np-cat").value;
    const price=Number(document.getElementById("np-price").value);
    const stock=Number(document.getElementById("np-stock").value);
    if(!name||price<=0) return;
    
    // Assign a generic placeholder image for newly added products
    db2.products.push({id:Date.now(), name, category:cat, price, stock, image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"});
    
    saveDB(db2);
    e.target.reset();
    renderProducts();
    document.getElementById("stat-products").textContent = getDB().products.length;
    toast("Product added to catalog");
  };
  renderProducts(); renderOrders();
}