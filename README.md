# High-Concurrency File Distribution Server (SwiftShare)

A modern, responsive, full-stack cloud file distribution and management platform built with **Node.js**, **Express.js**, **Multer**, and vanilla **HTML5 / CSS3 / JavaScript (ES6+)**.

Branded as **SwiftShare**, this server incorporates Operating Systems principles of **asynchronous non-blocking I/O multiplexing**, **zero-copy streaming pipelines**, and **HTTP 206 Partial Content Range chunking** to deliver files to multiple concurrent clients without memory exhaustion.

---

## 📸 Website Layout & Pages Overview

The platform implements all six core views matching the high-fidelity UI design:

| View | Key Capabilities |
| :--- | :--- |
| **1. Dashboard** | Welcome header with real-time `Server Online` status badge, 4 KPI statistic cards (**Total Files: 128**, **Total Downloads: 540**, **Active Users: 24**, **Storage Used: 2.4 GB**), dual-line smooth SVG/Canvas Server Activity chart (Uploads vs. Downloads), and Recent Files list. |
| **2. Upload Files** | Large drag-and-drop file upload dropzone with cloud icon, "Choose Files" browser picker, multi-file simultaneous upload processing, real-time animated percentage progress bars with transfer cancel/complete states, and bottom upload status banner. |
| **3. My Files** | File Manager displaying filename, file size, type badge, upload date, download counter, live search, category/type filter dropdown, sorting (Date, Name, Size, Downloads), pagination controls, and Download / Delete action buttons. |
| **4. Download Center** | Public distribution catalog for browsing shared files with search, type filters, "Most Popular" sort, pagination, and dedicated **Download** pill buttons initiating asynchronous streams with floating download progress. |
| **5. Transfer Monitor** | Real-time observation of file distribution streams with 4 metric cards (**Active Uploads: 5**, **Active Downloads: 12**, **Total Connections: 24**, **Transfer Speed: 128 MB/s**), filter tabs (`Active Transfers`, `Completed`, `Failed`), live progress bars, speed gauges, status pills, and a **High-Concurrency Load Simulator** button. |
| **6. Settings** | Multi-tab settings panel (`Profile`, `Storage`, `Security`, `Server`, `Preferences`) with Profile Information form, profile picture avatar changer, Account Statistics overview, disk cleanup triggers, server concurrency buffer tuning, and API key management. |

---

## 🚀 Key Features

1. **Dashboard Overview**: Instant metrics on total files, cumulative downloads, active concurrent users, and total disk storage used.
2. **Drag-and-Drop Multi-File Upload**: Supports selecting or dragging multiple files simultaneously. Files are uploaded via asynchronous `XMLHttpRequest` streaming with live progress bars, speed calculation, and cancel buttons.
3. **High-Concurrency Zero-Copy Streaming**: Downloads are served via Node.js non-blocking `fs.createReadStream()` piped directly to the HTTP socket.
4. **HTTP 206 Partial Content & Range Chunking**: Full support for `Accept-Ranges: bytes` and `Range: bytes=start-end`, enabling multi-threaded download accelerators, parallel chunk distribution, and resumable downloads.
5. **Real-Time Telemetry & Server-Sent Events (SSE)**: The server automatically pushes active connection counts, live transfer rates, and distribution events to clients via `/api/events`.
6. **Built-in High-Concurrency Load Simulator**: Click **"Simulate High Concurrency (5 Streams)"** in the Transfer Monitor to fire simultaneous parallel stream workers and watch the speedometer and connection metrics update dynamically.
7. **File Lifecycle & Storage Management**: Create, stream, search, filter, paginate, and safely delete uploaded files from disk and metadata index.
8. **Responsive Modern Theme**: Professional dark-navy (`#0b132b`) and crisp white dashboard styling with smooth rounded cards, subtle shadows, and complete mobile drawer navigation.

---

## 📂 Project Structure

```text
hcfd/
├── data/
│   ├── files.json              # Persistent JSON metadata database
│   └── settings.json           # Server configuration & profile data
├── public/
│   ├── app.js                  # Frontend SPA routing, SSE, uploads & UI
│   ├── index.html              # Modern semantic HTML5 markup (All 6 views)
│   └── style.css               # Responsive white and navy-blue stylesheet
├── uploads/                    # Server disk storage for uploaded assets
├── app.js                      # Root synchronized bundle
├── index.html                  # Root synchronized index
├── package.json                # Project dependencies and npm scripts
├── README.md                   # Comprehensive documentation & guide
├── server.js                   # Express.js, Multer & Range Streaming Engine
└── style.css                   # Root synchronized stylesheet
```

---

## 🛠️ Prerequisites

- **Node.js** v18.0.0 or higher (Tested on Node.js v24.x)
- **npm** v9.0.0 or higher

---

## 📦 Installation & Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd c:\Users\nvkar\OneDrive\OS\hcfd
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   - **Option A (Easiest)**: Double-click `start-server.bat` in File Explorer.
   - **Option B (Terminal)**: Run `node server.js` (or `npm start`).

4. **Access SwiftShare**:
   - The browser will automatically open to `http://localhost:3000`.
   - *Note: Keep the terminal / command prompt window open while using SwiftShare.*

---

## 🌐 REST API Reference

### 1. System & Dashboard Metrics
- **`GET /api/stats`**
  - Returns current totals for files, downloads, active users, storage usage, active uploads/downloads, transfer speed, and 6-hour activity chart points.

- **`GET /api/events`**
  - Server-Sent Events (SSE) live stream broadcasting concurrency updates, file additions, and deletions in real time.

### 2. File Operations
- **`GET /api/files`**
  - **Query Parameters**:
    - `search` (string): Filter by filename or type.
    - `type` / `category` (string): Filter by category (`PDF`, `Image`, `Document`, `Video`, `Archive`, `Presentation`).
    - `sort` (string): `date-desc`, `name-asc`, `size-desc`, `size-asc`, `downloads-desc`.
    - `page` (number): Page number (default: 1).
    - `limit` (number / 'All'): Page size (default: 5 or 10).
  - Returns paginated files list and total record counts.

- **`POST /api/upload`**
  - Handles `multipart/form-data` with field name `files`.
  - Supports up to 50 simultaneous files per request up to 1 GB each.
  - Automatically indexes file metadata, type detection, and stores safely to disk.

- **`GET /api/download/:id`**
  - Streams file to client asynchronously.
  - Supports standard full download (HTTP 200) and HTTP Range chunk requests (HTTP 206 Partial Content).
  - Tracks active concurrent client sockets.

- **`DELETE /api/files/:id`**
  - Permanently removes file record from catalog and unlinks physical file from storage disk.

### 3. Concurrency & Transfer Monitor
- **`GET /api/transfers/live`**
  - Returns active transfer stream items with individual progress, speed, status, and time remaining.

- **`POST /api/transfers/simulate`**
  - **Body**: `{ "count": 5 }`
  - Spawns concurrent asynchronous load streams to benchmark server throughput.

### 4. Settings
- **`GET /api/settings`** & **`POST /api/settings`**
  - Retrieve and save profile information and server engine tuning parameters.

- **`POST /api/seed`**
  - Reseeds standard initial sample files matching the reference design layout.

---

## 🧪 Testing High Concurrency & Range Chunking

### 1. Test Parallel Download Burst via PowerShell:
```powershell
# Fire 10 simultaneous asynchronous HTTP downloads against the server
1..10 | ForEach-Object -Parallel {
    curl.exe -s -o NUL "http://localhost:3000/api/download/file-1"
}
```

### 2. Verify HTTP Range Resumable / Multi-Part Chunking:
```bash
curl -I -H "Range: bytes=0-1023" http://localhost:3000/api/download/file-1
```
*Expected Response:*
```http
HTTP/1.1 206 Partial Content
Content-Range: bytes 0-1023/524288
Accept-Ranges: bytes
Content-Length: 1024
```

---

## 🎨 UI & Layout Highlights

- **Navy Sidebar Navigation**: Quick access across Dashboard, Upload Files, My Files, Download Center, Transfer Monitor, and Settings.
- **Floating Download Progress Toast**: Bottom-right real-time download status widget showing file name, stream progress percentage, and animated fill bar.
- **Interactive Server Activity Chart**: Dual-line canvas chart mapping Uploads and Downloads across diurnal traffic cycles.
- **Mobile Friendly**: Sidebar seamlessly collapses into an off-canvas drawer on mobile screens with backdrop touch dismiss.

---

## 📄 License
ISC License &middot; Built for High-Performance Operating Systems Distribution Architecture.
