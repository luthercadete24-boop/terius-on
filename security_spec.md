# Security Specification & Threat Model for Teríus on

## 1. Data Invariants
- A user document must correspond strictly to the authenticated `request.auth.uid`.
- Users cannot grant themselves `admin` role or elevate privileges.
- All study progress, calendars, pronunciation logs, and favorites are strictly isolated to the authenticated owning user (`/users/{userId}/*`).
- Documents must pass schema key validation (`keys().hasAll()` and `keys().hasOnly()`) and volumetric size restrictions.
- Admin collection (`/admins/{adminId}`) is only accessible by verified platform administrators.

## 2. The Dirty Dozen Payloads (Negative Security Tests)
1. Unauthenticated write to `/users/user123` -> PERMISSION_DENIED.
2. User `userA` attempting to read `/users/userB` -> PERMISSION_DENIED.
3. User `userA` attempting to write to `/users/userB` -> PERMISSION_DENIED.
4. User attempting to register with role `admin` -> PERMISSION_DENIED.
5. Injected payload with ghost field (`isVerified: true` or `isAdmin: true`) -> PERMISSION_DENIED.
6. User progress with negative grade (`nota_prova_final: -1`) -> PERMISSION_DENIED.
7. User progress with excessive grade (`nota_prova_final: 99`) -> PERMISSION_DENIED.
8. Calendar schedule with invalid day of week (`dia_semana: 8`) -> PERMISSION_DENIED.
9. Calendar schedule with oversized time string (>10 chars) -> PERMISSION_DENIED.
10. Pronunciation log with oversized term (>200 chars) -> PERMISSION_DENIED.
11. Pronunciation log with score out of bounds (`accuracyScore: 150`) -> PERMISSION_DENIED.
12. Blanket query listing all users from an unprivileged account -> PERMISSION_DENIED.
