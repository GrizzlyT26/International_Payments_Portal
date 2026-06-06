IF COL_LENGTH('dbo.Payments', 'ReviewedAt') IS NULL
BEGIN
    ALTER TABLE dbo.Payments ADD ReviewedAt DATETIME2 NULL;
END;

IF COL_LENGTH('dbo.Payments', 'ReviewedBy') IS NULL
BEGIN
    ALTER TABLE dbo.Payments ADD ReviewedBy NVARCHAR(255) NULL;
END;

IF COL_LENGTH('dbo.Payments', 'ReviewNotes') IS NULL
BEGIN
    ALTER TABLE dbo.Payments ADD ReviewNotes NVARCHAR(500) NULL;
END;
