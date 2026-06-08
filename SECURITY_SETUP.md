# Local security configuration

The server reads sensitive values from ASP.NET Core User Secrets or environment
variables instead of storing them in source control.

For local development, set the shared staff-login password once:

```powershell
dotnet user-secrets set "StaffAuth:Password" "use-the-team-password" --project International_Payments_Portal.Server
dotnet run --project International_Payments_Portal.Server
```

Each teammate must run the `dotnet user-secrets set` command on their own
computer. User Secrets are not committed to Git.

Environment variables can be used in hosted environments:

```powershell
$env:StaffAuth__Password = "use-the-team-password"
$env:Jwt__Key = "a-random-secret-with-at-least-32-characters"
```

When `Jwt__Key` is omitted, the server creates a temporary key at startup. Never
commit real passwords, tokens, or signing keys to `appsettings.json`.
