-- International Payments Portal
-- Database initialization script for LocalDB (Microsoft SQL Server LocalDB)
-- Run this script in SSMS or with sqlcmd against (localdb)\MSSQLLocalDB
SET NOCOUNT ON;

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'Internatiional_Payment_System')
BEGIN
    CREATE DATABASE Internatiional_Payment_System;
END
GO

USE Internatiional_Payment_System;
GO

-- =========================
-- Users
-- =========================
IF OBJECT_ID('dbo.Users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        FullName NVARCHAR(255) NOT NULL,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        PasswordSalt NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT (SYSUTCDATETIME()),
        IsActive BIT NOT NULL CONSTRAINT DF_Users_IsActive DEFAULT (1)
    );
END
GO

-- =========================
-- CustomerDetails
-- =========================
IF OBJECT_ID('dbo.CustomerDetails', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.CustomerDetails
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        AccountHolder NVARCHAR(255) NOT NULL,
        AccountNumber NVARCHAR(50) NOT NULL,
        BranchCode NVARCHAR(20) NOT NULL,
        AccountType NVARCHAR(50) NOT NULL,
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_CustomerDetails_CreatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT FK_CustomerDetails_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE
    );
END
GO

-- =========================
-- Payments
-- =========================
IF OBJECT_ID('dbo.Payments', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Payments
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        ReceiverIBAN NVARCHAR(100) NOT NULL,
        ReceiverSWIFT NVARCHAR(20) NOT NULL,
        Amount DECIMAL(18,2) NOT NULL,
        Currency NVARCHAR(10) NOT NULL,
        Description NVARCHAR(500) NULL,
        TransactionId NVARCHAR(100) NOT NULL UNIQUE,
        Fee DECIMAL(18,2) NULL,
        Status NVARCHAR(50) NOT NULL DEFAULT 'Completed',
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Payments_CreatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT FK_Payments_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE
    );
END
GO

-- =========================
-- Indexes
-- =========================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Email' AND object_id = OBJECT_ID('dbo.Users'))
    CREATE INDEX IX_Users_Email ON dbo.Users(Email);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_CustomerDetails_UserId' AND object_id = OBJECT_ID('dbo.CustomerDetails'))
    CREATE INDEX IX_CustomerDetails_UserId ON dbo.CustomerDetails(UserId);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Payments_UserId' AND object_id = OBJECT_ID('dbo.Payments'))
    CREATE INDEX IX_Payments_UserId ON dbo.Payments(UserId);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Payments_TransactionId' AND object_id = OBJECT_ID('dbo.Payments'))
    CREATE INDEX IX_Payments_TransactionId ON dbo.Payments(TransactionId);
GO

-- =========================
-- Verification (sample queries)
-- =========================
SELECT TOP 10 * FROM dbo.Users;
SELECT TOP 10 * FROM dbo.CustomerDetails;
SELECT TOP 10 * FROM dbo.Payments;
GO
