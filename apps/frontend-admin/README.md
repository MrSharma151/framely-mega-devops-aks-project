# 👓 Framely Admin Dashboard

Framely Admin is a **premium admin dashboard** for managing the Framely eyewear store.
Admins can **manage categories, products, and orders**, upload product images, and monitor store performance.
This is the **Admin Frontend (MVP level)** built with **Next.js (App Router)** and deployed on **Azure Static Web Apps**.

🔗 **Live Demo:** [Framely Admin Dashboard](https://gentle-glacier-044690e00.1.azurestaticapps.net/)
⚠️ **Note:** This dashboard is accessible **only with admin credentials**.

---

## 📌 Status

* ✅ **MVP Features Completed**
* 🚀 **Deployed & Live on Azure Static Web Apps**
* 🔧 **Actively evolving (analytics, reports & role-based access under development)**

---

## 🛠️ Tech Stack

* **Next.js 14+ (App Router)** – Modern React framework
* **TypeScript** – Strict type safety
* **TailwindCSS** – Utility-first styling
* **Lucide-react** – Icon library
* **Axios** – API client (`apiClient.ts`)
* **react-hot-toast** – User-friendly notifications
* **Global Dark Premium Theme** – CSS variables & glassmorphism
* **Protected Routes** – Secure authentication & access control

---

## ✅ Features (MVP Level)

### 📊 Dashboard

* Overview of orders, revenue & quick stats
* Reusable **Card** & **Table** components

### 📂 Categories Management

* Add, edit, search, delete categories
* Glassmorphic tables & modals
* Fully responsive

### 🛍️ Products Management

* CRUD operations on products
* Filter by category & brand
* **Image upload & preview (via Blob APIs)**
* Pagination & search

### 📦 Orders Management

* Paginated list of all orders
* Update order status → `Pending`, `Processing`, `Completed`, `Cancelled`
* View order details in modal
* Delete orders (if required)

### ♻️ Reusable Components

* Buttons, Cards, Tables, Modals
* Search bars & filters
* Smooth transitions & hover effects

### 🔔 Notifications

* Success & error messages with **react-hot-toast**

---

## 🌐 Backend API Integration

* **Base API URL** configured in `apiClient.ts`

**Category APIs**

* `GET /Categories` → All categories
* `POST /Categories` → Add category
* `PUT /Categories/{id}` → Update category
* `DELETE /Categories/{id}` → Delete category

**Product APIs**

* `GET /Products` → All products
* `GET /Products/{id}` → Product details
* `POST /Products` → Add product
* `PUT /Products/{id}` → Update product
* `DELETE /Products/{id}` → Delete product
* `GET /Products/category?name=` → Filter by category
* `GET /Products/brand?name=` → Filter by brand
* `GET /Products/search?term=` → Search products

**Order APIs**

* `GET /Orders` → Paginated orders
* `GET /Orders/{id}` → Order by ID
* `PUT /Orders/{id}/status` → Update status
* `DELETE /Orders/{id}` → Delete order

**Blob APIs (Image Uploads)**

* `POST /Blob/upload` → Uploads an image (returns public URL)
* `DELETE /Blob/{fileName}` → Deletes an uploaded image

```

**Pagination Response Example:**

```json
{
  "totalItems": 120,
  "totalPages": 12,
  "currentPage": 1,
  "pageSize": 10,
  "data": [
    {
      "id": 1,
      "userId": 101,
      "totalPrice": 4999,
      "status": "Pending",
      "items": [
        { "productId": 1, "name": "Premium Aviator", "quantity": 2, "price": 1999 }
      ]
    }
  ]
}
```

---

## 🚀 Deployment (Azure Static Web App)

This project is deployed on **Azure Static Web Apps** with **CI/CD via GitHub Actions**.

### 📦 Hosting & Infra

* Azure SWA resource (`framely-admin`)
* GitHub-connected for automated deployments
* Deployment token stored in GitHub Secrets (`AZURE_STATIC_WEB_APPS_API_TOKEN_ADMIN`)
* Tagged resources for cost, ownership & environment clarity

### 🔐 Security

* GitHub Secrets used:

  * `AZURE_STATIC_WEB_APPS_API_TOKEN_ADMIN`
* No hardcoded secrets in repo

### ⚙️ CI/CD Workflow

* Workflow File: `.github/workflows/framely-admin-deploy.yml`
* Modular: Separate workflow per deployable (`framely-customer`, `framely-admin`)
* Trigger: Push to `azure-deployment` branch
* Steps: Checkout → Install deps → Build Next.js → Deploy

### 🧼 Config Hygiene

* `next.config.ts` uses inferred typing
* Enabled:

  * `reactStrictMode`
  * `trailingSlash`
  * `styledComponents` compiler toggle
* SSR retained for LCP & dynamic rendering

---

## 📂 Deployment-Relevant Structure

```bash
Framely/
├── .github/
│   └── workflows/
│       └── framely-admin-deploy.yml
├── frontend/
│   └── framely-admin/
│       ├── public/
│       ├── src/
│       ├── next.config.ts
│       └── README.md  
```

---

## 📝 Notes

* This project is **MVP ready** and already **deployed on Azure**
* Accessible only with **admin credentials** (not for general users)
* Next milestones: **analytics dashboards, reporting, role-based access management**
* Contributions & feedback are welcome 🚀


