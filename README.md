# NexusERP & CRM — Enterprise Operations Suite

CRM + ERP is a unified full-stack Enterprise Resource Planning (ERP) and Customer Relationship Management (CRM) platform. It streamlines customer lifecycle management, inventory cataloging, stock audit logging, and automated sales delivery order processing.

---

## 🏗️ System Architecture

```text
+-----------------------------------------------------------------------------+
|                         React 19 + Vite Frontend                            |
|    [ Executive Dashboard ]  [ Customer CRM ]  [ Inventory & Challans ]     |
+-----------------------------------------------------------------------------+
                                       |
                                       |  HTTPS / REST API Requests
                                       v
+-----------------------------------------------------------------------------+
|                          Node.js + Express API                              |
|     +-------------------+   +-------------------+   +------------------+    |
|     |  JWT Auth Guard   |-->|  Zod Validation   |-->| Rest Controllers |    |
|     +-------------------+   +-------------------+   +------------------+    |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|                              Prisma ORM (v6)                                |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|                      MongoDB Atlas Database Cluster                         |
|   {users}   {customers}   {products}   {stock_logs}   {challans}            |
+-----------------------------------------------------------------------------+
```

---

## 🔄 Sales Order & Delivery Challan Workflow

```text
+----------------------+      +----------------------+      +----------------------+
| 1. Select Customer   | ---> | 2. Add Line Items    | ---> | 3. Calculate Totals  |
|    from CRM Database |      |    from Inventory    |      |    & Grand Total     |
+----------------------+      +----------------------+      +----------------------+
                                                                       |
                                                                       v
+----------------------+      +----------------------+      +----------------------+
| 6. Generate Print    | <--- | 5. Log Movement Record| <--- | 4. Confirm Order &   |
|    Invoice Receipt   |      |    in Stock Ledger   |      |    Auto-Deduct Stock |
+----------------------+      +----------------------+      +----------------------+
```

---

## 🌟 Core Modules

### 1. Executive Analytics Dashboard
- Live metric cards tracking total customers, product catalog count, confirmed challans, and gross sales volume.
- Real-time stock warning feed highlighting items at or below minimum threshold limits.

### 2. Customer Relationship Management (CRM)
- Centralized client database with real-time text search and filter by client status (`Lead`, `Active`, `Inactive`).
- Full business profiles (GST / Tax ID, contact info, delivery address) and interaction notes timeline.

### 3. Inventory & Stock Audit
- SKU catalog with category tagging, unit pricing, rack location, and stock alert boundaries.
- Complete movement audit trail logging every stock addition (`IN`) and dispatch (`OUT`) with operator ID.

### 4. Sales Delivery Order (Challan) Processing
- Multi-item order builder linked directly to customer profiles and stock availability.
- Order confirmation automatically decrements inventory stock and generates printable delivery receipts.

---

## 🔒 Role-Based Access Control (RBAC) Matrix

| Module / Operation | Admin | Sales | Warehouse | Accounts |
| :--- | :---: | :---: | :---: | :---: |
| **Executive Dashboard & Metrics** | ✅ | ✅ | ✅ | ✅ |
| **Manage CRM Customers & Notes** | ✅ | ✅ | ❌ | ❌ |
| **Manage Products & Stock Adjustments** | ✅ | ❌ | ✅ | ❌ |
| **Issue Sales Delivery Challans** | ✅ | ✅ | ❌ | ❌ |
| **View Audit Reports & Financials** | ✅ | ✅ | ❌ | ✅ |

---

## 🔌 API Reference Architecture

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new staff profile |
| `POST` | `/api/auth/login` | Authenticate user & return Bearer token |
| `GET` | `/api/auth/me` | Retrieve authenticated user details |

### Customer CRM (`/api/customers`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/customers` | Fetch customer directory (Search & Filter) |
| `POST` | `/api/customers` | Create customer profile |
| `POST` | `/api/customers/:id/notes` | Add CRM timeline note |

### Inventory (`/api/products`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch inventory catalog |
| `POST` | `/api/products` | Create product item |
| `POST` | `/api/products/:id/adjust-stock` | Adjust stock & record audit log |

### Delivery Challans (`/api/challans`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/challans` | Fetch sales delivery orders |
| `POST` | `/api/challans` | Issue new delivery order |
| `PATCH` | `/api/challans/:id/status` | Confirm order & auto-deduct stock |

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin123` | Full System Control |
| **Sales** | `sales@example.com` | `sales123` | Client CRM & Sales Orders |
| **Warehouse** | `warehouse@example.com` | `wh123` | Product Catalog & Stock Adjustments |
| **Accounts** | `accounts@example.com` | `accounts123` | Order Audits & Financial Reports |
