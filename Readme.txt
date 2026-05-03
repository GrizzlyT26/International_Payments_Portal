# 🌍 International Payments Portal

A full-stack web application for managing users and processing international payments.

---

## 🚀 Tech Stack

**Frontend**

* React (Vite)
* Axios
* Tailwind / Custom Styles

**Backend**

* ASP.NET Core Web API
* Entity Framework Core
* JWT Authentication (optional)

**Database**

* SQL Server (LocalDB or SQL Server)

---

## 📁 Project Structure

```
International_Payments_Portal/
│
├── International_Payments_Portal.Server   # Backend (.NET API)
├── international_payments_portal.client   # Frontend (React)
└── .github/workflows                     # CI Pipeline
```

---

## ⚙️ Prerequisites

Make sure you have installed:

* [.NET SDK 8+](https://dotnet.microsoft.com/download)
* [Node.js 18+](https://nodejs.org/)
* [SQL Server / LocalDB](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb)
* [Git](https://git-scm.com/)

---

## 🗄️ Database Setup

1. Open SQL Server Management Studio (SSMS)

2. Create database:

```sql
CREATE DATABASE Internatiional_Payment_System;
```

3. Run required tables (example):

### Users Table

```sql
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    FullName NVARCHAR(255) NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    PasswordSalt NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    IsActive BIT DEFAULT 1
);
```

### CustomerDetails Table

```sql
CREATE TABLE CustomerDetails (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    AccountHolder NVARCHAR(255),
    AccountNumber NVARCHAR(50),
    BranchCode NVARCHAR(20),
    AccountType NVARCHAR(50),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
```

---

## 🔧 Backend Setup (ASP.NET Core)

Navigate to backend folder:

```bash
cd International_Payments_Portal.Server
```

Restore dependencies:

```bash
dotnet restore
```

Run the API:

```bash
dotnet run
```

API will run on:

```
https://localhost:5001
```

---

## 🎨 Frontend Setup (React + Vite)

Navigate to frontend:

```bash
cd international_payments_portal.client
```

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

App will run on something like:

```
http://localhost:62034
```

---

## 🔐 Environment Notes

* Make sure backend is running before frontend
* Ensure CORS is enabled for localhost
* If HTTPS error occurs:

```bash
dotnet dev-certs https --trust
```

---

## 🧪 Running the App

1. Start backend
2. Start frontend
3. Open browser:

```
http://localhost:62034
```

---

## 🔁 Common Issues & Fixes

### ❌ Port already in use

```bash
taskkill /F /IM node.exe
taskkill /F /IM dotnet.exe
```

---

### ❌ HTTPS certificate error

```bash
dotnet dev-certs https --trust
```

---

### ❌ Git not recognized

Install Git and restart terminal

---

### ❌ File encoding error (UTF-8)

Re-save `.jsx` files as UTF-8

---

## 🔄 CI/CD Pipeline

GitHub Actions is configured:

```
.github/workflows/ci.yml
```

Triggers on:

* Push to main
* Pull requests

---

## 📌 Future Improvements

* JWT Authentication
* Role-based access (Admin/User)
* Payment history dashboard
* Deployment (Azure / Docker)

---

## 👨‍💻 Author

US :)

---

## 📄 License

This project is for educational/demo purposes.
