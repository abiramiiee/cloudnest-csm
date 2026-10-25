# CloudNest — Cloud-Based File Storage and Sharing System

> **Tagline:** "Your Files. Your Space. Your Control."  
> **Course Scope:** College Cloud Service Management (CSM) Capstone Project  
> **Frontend Stack:** React 19, TypeScript, Vite, Tailwind CSS, React Router v7, Lucide React

---

## 1. Project Overview

CloudNest is a modern, responsive, and secure SaaS cloud storage web application. Designed as a college Cloud Service Management project, it features a complete frontend architecture prepared to integrate with a **Java 21 / Spring Boot 3** REST API backend, **MySQL 8** relational database for metadata, and **Amazon S3** for secure encrypted object storage.

---

## 2. Key Features

- **SaaS Design System:** Lavender and white palette with violet-blue accents, dark/light theme support, accessible dialogs, and responsive mobile-first navigation.
- **Deterministic File Organization:** Categorizes files into Documents, Images, Videos, Audio, Archives, and Other based on MIME type and extension without artificial AI claims.
- **File Management:** Drag-and-drop uploads, folder creation with custom colors, breadcrumb directory traversal, grid/list view toggles, sorting, and multi-file bulk operations.
- **Expiring Share Links:** Tokenized sharing (`/share/:token`) with configurable expiration windows (1h, 24h, 7d, 30d), granular view-only or download permissions, and optional server-verified access passcodes.
- **Personal Secure Vault:** Isolated repository for private keys, credentials, and certificates with secondary 4-digit PIN challenge (`1234` in demo mode) and zero public sharing policy.
- **Trash & Soft Deletion:** Safeguarded trash bin with restoration and irreversible permanent erasure.
- **Storage Insights:** Visual capacity meters, quota breakdown by media category, monthly upload velocity charts, and top largest file indicators.
- **Integrated Audit Trail:** Immutable activity stream recording every upload, star, move, share generation, and trash event.

---

## 3. Technology Stack & Decoupled Architecture

| Tier | Technology | Description |
|---|---|---|
| **Frontend** | React 19 + TypeScript + Vite | Modular SPA architecture with Tailwind CSS v4 styling |
| **Routing** | React Router v7 | Protected app layouts, token share recipient routes, and public marketing pages |
| **Backend Integration Target** | Java 21 / Spring Boot 3 | Stateless Spring Security with JWT Bearer authentication filter |
| **Relational Database** | MySQL 8.0 | ACID-compliant storage for users, file metadata, shares, and activity logs |
| **Object Storage** | Amazon S3 / Local Dev Storage | Server-side encrypted (AES-256) blob store |

---

## 4. REST API Endpoint Mapping

The frontend service layer (`src/services/`) targets standard Spring Boot REST controllers:

- **Authentication:**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
  - `GET /api/auth/me`
- **Files & Folders:**
  - `GET /api/files` (filter by `folderId`, `category`, `starred`, `search`)
  - `POST /api/files/upload` (multipart/form-data)
  - `GET /api/files/{id}/download`
  - `PUT /api/files/{id}` (rename)
  - `DELETE /api/files/{id}` (soft-delete to trash)
  - `PATCH /api/files/{id}/star`
  - `PATCH /api/files/{id}/move`
  - `GET /api/folders`
  - `POST /api/folders`
  - `DELETE /api/folders/{id}`
- **Sharing & Vault:**
  - `POST /api/shares`
  - `GET /api/shares/created-by-me`
  - `GET /api/shares/shared-with-me`
  - `DELETE /api/shares/{id}` (revoke)
  - `GET /api/public/shares/{token}` (public recipient view)
  - `GET /api/vault/files`
  - `POST /api/vault/files`
  - `POST /api/vault/verify` (PIN validation)
- **Trash & Analytics:**
  - `GET /api/trash`
  - `POST /api/trash/{id}/restore`
  - `DELETE /api/trash/{id}` (permanent purge)
  - `DELETE /api/trash` (empty all)
  - `GET /api/activity`
  - `GET /api/storage/insights`

---

## 5. Demo Mode & Evaluator Quick Start

When no Spring Boot server is active at `http://localhost:8080/api`:
- CloudNest automatically operates in **DEMO MODE** with a clear top banner indicator.
- Evaluators can test full interaction flows: drag-and-drop file upload, folder creation, starring, moving, generating share links, and unlocking the Personal Vault using the demo PIN `1234`.
- A 1-click **"Instant Sign In as Alex Chen"** button is provided on the Login page for immediate workspace evaluation.

---

## 6. Local Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.
