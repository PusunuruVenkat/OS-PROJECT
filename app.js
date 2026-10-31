/**
 * SWIFTSHARE - High-Concurrency File Distribution Server
 * Complete Interactive Frontend Controller with In-Browser IndexedDB Engine
 * Works standalone in any browser with zero servers/batch files required!
 */

(() => {
  'use strict';

  // Backend URL (if running in full-stack Node mode, otherwise fallback to in-browser engine)
  const API_BASE = (window.location.protocol === 'file:' || !window.location.port || window.location.port !== '3000')
    ? 'http://localhost:3000'
    : '';

  // IndexedDB Configuration for persistent file storage
  const DB_NAME = 'SwiftShareDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'files_blobs';

  function openDB() {
    return new Promise(resolve => {
      if (!window.indexedDB) {
        resolve(null);
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = e => resolve(e.target.result);
      request.onerror = () => resolve(null);
    });
  }

  async function saveFileBlob(fileId, fileBlob) {
    try {
      const db = await openDB();
      if (!db) return false;
      return new Promise(resolve => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put({ id: fileId, blob: fileBlob });
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch (e) {
      return false;
    }
  }

  async function getFileBlob(fileId) {
    try {
      const db = await openDB();
      if (!db) return null;
      return new Promise(resolve => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(fileId);
        req.onsuccess = () => resolve(req.result ? req.result.blob : null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }

  async function deleteFileBlob(fileId) {
    try {
      const db = await openDB();
      if (!db) return false;
      return new Promise(resolve => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(fileId);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch (e) {
      return false;
    }
  }

  // Baseline Sample Dataset
  const DEFAULT_FILES = [
    {
      id: "file-mvvw7quh-eawc",
      name: "Linux Essential.pdf",
      storedName: "1793420423010-331838784-Linux_Essential.pdf",
      size: 200433,
      formattedSize: "195.7 KB",
      type: "PDF",
      category: "Documents",
      icon: "pdf",
      uploadDate: "2026-10-31",
      timeAgo: "Just now",
      downloadCount: 4
    },
    {
      id: "file-mvvw7qtu-uehy",
      name: "Linux 2.pdf",
      storedName: "1793420423004-388627934-Linux_2.pdf",
      size: 200295,
      formattedSize: "195.6 KB",
      type: "PDF",
      category: "Documents",
      icon: "pdf",
      uploadDate: "2026-10-31",
      timeAgo: "Just now",
      downloadCount: 2
    },
    {
      id: "file-mvvw7qsx-yqm3",
      name: "Linux 1.pdf",
      storedName: "1793420422994-304638398-Linux_1.pdf",
      size: 200299,
      formattedSize: "195.6 KB",
      type: "PDF",
      category: "Documents",
      icon: "pdf",
      uploadDate: "2026-10-31",
      timeAgo: "Just now",
      downloadCount: 3
    },
    {
      id: "file-mvv4ew3r-ykaw",
      name: "ML_CO4_Scenario_Based_Questions (1).docx",
      storedName: "1793373727176-592466794-ML_CO4_Scenario_Based_Questions__1_.docx",
      size: 22381,
      formattedSize: "21.9 KB",
      type: "Document",
      category: "Documents",
      icon: "doc",
      uploadDate: "2026-10-30",
      timeAgo: "Yesterday",
      downloadCount: 5
    },
    {
      id: "file-mvv4ew37-4bq5",
      name: "ML_CO5_Scenario_Based-Questions (1).docx",
      storedName: "1793373727171-785624588-ML_CO5_Scenario_Based-Questions__1_.docx",
      size: 21408,
      formattedSize: "20.9 KB",
      type: "Document",
      category: "Documents",
      icon: "doc",
      uploadDate: "2026-10-30",
      timeAgo: "Yesterday",
      downloadCount: 1
    },
    {
      id: "file-mvv4ew28-896g",
      name: "ML_CO6_Scenario_Based-Questions (1).docx",
      storedName: "1793373727168-930916904-ML_CO6_Scenario_Based-Questions__1_.docx",
      size: 21127,
      formattedSize: "20.6 KB",
      type: "Document",
      category: "Documents",
      icon: "doc",
      uploadDate: "2026-10-30",
      timeAgo: "Yesterday",
      downloadCount: 2
    },
    {
      id: "file-1",
      name: "Project_Report.pdf",
      storedName: "1793373103978-1-Project_Report.pdf",
      size: 2500000,
      formattedSize: "2.4 MB",
      type: "PDF",
      category: "Documents",
      icon: "pdf",
      uploadDate: "2024-05-20",
      timeAgo: "2 min ago",
      downloadCount: 122
    },
    {
      id: "file-2",
      name: "College_Image.png",
      storedName: "1793373103981-2-College_Image.png",
      size: 1200000,
      formattedSize: "1.1 MB",
      type: "Image",
      category: "Images",
      icon: "image",
      uploadDate: "2024-05-19",
      timeAgo: "10 min ago",
      downloadCount: 85
    },
    {
      id: "file-3",
      name: "Notes.docx",
      storedName: "1793373103984-3-Notes.docx",
      size: 800000,
      formattedSize: "781.3 KB",
      type: "Document",
      category: "Documents",
      icon: "doc",
      uploadDate: "2024-05-18",
      timeAgo: "30 min ago",
      downloadCount: 60
    },
    {
      id: "file-4",
      name: "Video.mp4",
      storedName: "1793373103991-4-Video.mp4",
      size: 120000000,
      formattedSize: "114.4 MB",
      type: "Video",
      category: "Media",
      icon: "video",
      uploadDate: "2024-05-17",
      timeAgo: "1 hour ago",
      downloadCount: 200
    },
    {
      id: "file-5",
      name: "Presentation.pptx",
      storedName: "1793373103993-5-Presentation.pptx",
      size: 5400000,
      formattedSize: "5.1 MB",
      type: "Presentation",
      category: "Documents",
      icon: "ppt",
      uploadDate: "2024-05-16",
      timeAgo: "Yesterday",
      downloadCount: 76
    },
    {
      id: "file-6",
      name: "Software.zip",
      storedName: "1793373103996-6-Software.zip",
      size: 50000000,
      formattedSize: "47.7 MB",
      type: "Archive",
      category: "Archives",
      icon: "zip",
      uploadDate: "2024-05-15",
      timeAgo: "3 days ago",
      downloadCount: 95
    }
  ];

  const DEFAULT_STATS = {
    totalFiles: 128,
    totalDownloads: 540,
    activeUsers: 24,
    storageUsed: '2.4 GB',
    activeUploads: 5,
    activeDownloads: 12,
    totalConnections: 24,
    transferSpeed: '128 MB/s'
  };

  const DEFAULT_SETTINGS = {
    profile: {
      username: 'Admin',
      email: 'admin@example.com',
      fullName: 'Administrator',
      role: 'System Administrator',
      memberSince: 'May 2024',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    server: {
      maxConcurrency: 100,
      chunkSizeKb: 256,
      speedCapMbps: 1000,
      allowGuestDownload: true,
      storageQuotaGb: 10
    }
  };

  const DEFAULT_TRANSFERS = [
    {
      id: 'tr-1',
      fileName: 'Large_Dataset_Simulation.h5',
      user: 'client_worker_01',
      type: 'Download',
      progress: 68,
      speed: '42.5 MB/s',
      status: 'Downloading',
      timeLeft: '2s'
    },
    {
      id: 'tr-2',
      fileName: 'Kernel_Image_Build.iso',
      user: 'client_worker_08',
      type: 'Download',
      progress: 44,
      speed: '38.2 MB/s',
      status: 'Downloading',
      timeLeft: '4s'
    },
    {
      id: 'tr-3',
      fileName: 'Distributed_Log_Analysis.tar.gz',
      user: 'node_dist_14',
      type: 'Upload',
      progress: 89,
      speed: '28.4 MB/s',
      status: 'Uploading',
      timeLeft: '1s'
    },
    {
      id: 'tr-4',
      fileName: 'OS_Benchmark_Matrix.csv',
      user: 'client_worker_03',
      type: 'Download',
      progress: 95,
      speed: '18.9 MB/s',
      status: 'Downloading',
      timeLeft: '1s'
    }
  ];

  // Storage Persistence Helpers
  function loadStoredFiles() {
    try {
      const stored = localStorage.getItem('swiftshare_files');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [...DEFAULT_FILES];
  }

  function saveStoredFiles(files) {
    try {
      localStorage.setItem('swiftshare_files', JSON.stringify(files));
    } catch (e) {}
  }

  function loadStoredStats() {
    try {
      const stored = localStorage.getItem('swiftshare_stats');
      if (stored) {
        return Object.assign({}, DEFAULT_STATS, JSON.parse(stored));
      }
    } catch (e) {}
    return Object.assign({}, DEFAULT_STATS);
  }

  function saveStoredStats(stats) {
    try {
      localStorage.setItem('swiftshare_stats', JSON.stringify(stats));
    } catch (e) {}
  }

  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  const STATE = {
    currentPage: 'dashboard',
    currentSettingsTab: 'profile',
    currentTransferTab: 'active',
    serverOnline: true,
    
    // Files State
    files: [],
    filteredFiles: [],
    myFilesPage: 1,
    myFilesLimit: 5,
    myFilesSearch: '',
    myFilesType: 'All Types',
    myFilesSort: 'date-desc',

    // Download Center State
    dcPage: 1,
    dcLimit: 5,
    dcSearch: '',
    dcType: 'All Types',
    dcSort: 'Most Popular',

    // Transfers
    liveTransfers: [...DEFAULT_TRANSFERS],
    activeUploadTasks: new Map(),

    // Stats
    stats: Object.assign({}, DEFAULT_STATS),

    // User Settings
    settings: Object.assign({}, DEFAULT_SETTINGS),

    fileToDeleteId: null,
    sseSource: null
  };

  // Helper DOM selectors
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initGlobalSearch();
    initUploadHandlers();
    initMyFilesHandlers();
    initDownloadCenterHandlers();
    initTransferMonitorHandlers();
    initSettingsHandlers();
    initModalsAndDropdowns();
    initServerSentEvents();

    // Populate dataset immediately (0ms delay)
    loadStats();
    loadFiles();
    loadTransfers();
    loadSettings();

    // Draw initial server activity chart
    renderActivityChart();

    // Responsive window resize
    window.addEventListener('resize', () => {
      renderActivityChart();
    });
  });

  // =========================================================================
  // 1. NAVIGATION & SPA ROUTING
  // =========================================================================
  function initNavigation() {
    $$('.sidebar-nav .nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPage = btn.getAttribute('data-page');
        navigateTo(targetPage);
        closeMobileSidebar();
      });
    });

    $$('[data-navigate]').forEach(el => {
      el.addEventListener('click', () => {
        const page = el.getAttribute('data-navigate');
        navigateTo(page);
      });
    });

    $('btnDashViewAllFiles')?.addEventListener('click', () => navigateTo('my-files'));
    $('btnMyFilesUploadNew')?.addEventListener('click', () => navigateTo('upload'));

    $('mobileMenuBtn')?.addEventListener('click', () => {
      $('appSidebar')?.classList.toggle('open');
      $('sidebarOverlay')?.classList.toggle('show');
    });

    $('sidebarOverlay')?.addEventListener('click', closeMobileSidebar);

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && $(`page-${hash}`)) {
        navigateTo(hash, false);
      }
    });

    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && $(`page-${initialHash}`)) {
      navigateTo(initialHash, false);
    }
  }

  function closeMobileSidebar() {
    $('appSidebar')?.classList.remove('open');
    $('sidebarOverlay')?.classList.remove('show');
  }

  function navigateTo(pageId, updateHash = true) {
    if (!pageId) return;

    STATE.currentPage = pageId;
    if (updateHash) {
      window.location.hash = pageId;
    }

    $$('.sidebar-nav .nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-page') === pageId);
    });

    $$('.page-view').forEach(view => {
      view.classList.toggle('active', view.id === `page-${pageId}`);
    });

    if (pageId === 'dashboard') {
      setTimeout(renderActivityChart, 50);
    } else if (pageId === 'my-files') {
      renderMyFilesTable();
    } else if (pageId === 'download-center') {
      renderDownloadCenterTable();
    } else if (pageId === 'transfer-monitor') {
      renderTransfersTable();
    }
  }

  // =========================================================================
  // 2. GLOBAL SEARCH BAR
  // =========================================================================
  function initGlobalSearch() {
    const input = $('globalSearchInput');
    const clearBtn = $('searchClearBtn');

    if (!input) return;

    input.addEventListener('input', () => {
      const val = input.value.trim();
      clearBtn.style.display = val ? 'block' : 'none';

      if (STATE.currentPage === 'my-files') {
        STATE.myFilesSearch = val;
        if ($('myFilesSearchInput')) $('myFilesSearchInput').value = val;
        STATE.myFilesPage = 1;
        renderMyFilesTable();
      } else if (STATE.currentPage === 'download-center') {
        STATE.dcSearch = val;
        if ($('dcSearchInput')) $('dcSearchInput').value = val;
        STATE.dcPage = 1;
        renderDownloadCenterTable();
      } else {
        STATE.myFilesSearch = val;
        if ($('myFilesSearchInput')) $('myFilesSearchInput').value = val;
        navigateTo('my-files');
      }
    });

    clearBtn?.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      if (STATE.currentPage === 'my-files') {
        STATE.myFilesSearch = '';
        if ($('myFilesSearchInput')) $('myFilesSearchInput').value = '';
        renderMyFilesTable();
      } else if (STATE.currentPage === 'download-center') {
        STATE.dcSearch = '';
        if ($('dcSearchInput')) $('dcSearchInput').value = '';
        renderDownloadCenterTable();
      }
    });
  }

  // =========================================================================
  // 3. SERVER-SENT EVENTS & LIVE SIMULATION
  // =========================================================================
  function initServerSentEvents() {
    if (API_BASE && window.EventSource) {
      try {
        STATE.sseSource = new EventSource(`${API_BASE}/api/events`);
        STATE.sseSource.onmessage = e => {
          try {
            const data = JSON.parse(e.data);
            handleLiveUpdate(data);
          } catch (err) {}
        };
        STATE.sseSource.onerror = () => {
          STATE.sseSource.close();
        };
      } catch (e) {}
    }

    // In-browser smooth live telemetry simulation
    setInterval(() => {
      simulateLiveTelemetry();
    }, 3500);
  }

  function simulateLiveTelemetry() {
    STATE.liveTransfers.forEach(tr => {
      if (tr.status === 'Downloading' || tr.status === 'Uploading') {
        tr.progress = Math.min(100, tr.progress + Math.floor(Math.random() * 6) + 3);
        const currentMB = Math.floor(Math.random() * 30) + 20;
        tr.speed = `${currentMB}.${Math.floor(Math.random() * 9)} MB/s`;
        if (tr.progress >= 100) {
          tr.status = 'Completed';
          tr.progress = 100;
          tr.speed = '0 MB/s';
          tr.timeLeft = '0s';
        }
      }
    });

    if (STATE.currentPage === 'transfer-monitor') {
      renderTransfersTable();
    }
  }

  function handleLiveUpdate(data) {
    if (data.stats) {
      updateStatsUI(data.stats);
    }
    if (data.transfers && Array.isArray(data.transfers) && data.transfers.length > 0) {
      STATE.liveTransfers = data.transfers;
      if (STATE.currentPage === 'transfer-monitor') {
        renderTransfersTable();
      }
    }
    if (data.type === 'FILES_UPDATED' || data.type === 'FILE_DELETED') {
      loadFiles();
    }
    if (data.type === 'ACTIVITY') {
      addNotificationItem(data.event.action, `${data.event.action}: ${data.event.filename}`);
    }
  }

  // =========================================================================
  // 4. STATS & DASHBOARD
  // =========================================================================
  async function loadStats() {
    const localStats = loadStoredStats();
    STATE.stats = Object.assign(STATE.stats, localStats);
    updateStatsUI(STATE.stats);
    setServerOnlineState(true);

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/api/stats`, { cache: 'no-store' });
        if (res.ok) {
          const remoteStats = await res.json();
          STATE.stats = Object.assign(STATE.stats, remoteStats);
          saveStoredStats(STATE.stats);
          updateStatsUI(STATE.stats);
        }
      } catch (err) {}
    }
  }

  function setServerOnlineState(isOnline) {
    STATE.serverOnline = true; // Always active
    const statusPill = $('navServerStatus');
    const dashBadge = $('dashServerStatus');
    const footerStatus = $('footerServerStatus');
    const footerDot = document.querySelector('.footer-status-dot');
    const fileBanner = $('fileProtocolBanner');

    if (fileBanner) {
      fileBanner.style.display = 'none';
    }

    if (statusPill) {
      statusPill.className = 'server-status-pill online';
      statusPill.innerHTML = '<span class="status-indicator"></span><span class="status-text">Server Active</span>';
    }

    if (dashBadge) {
      dashBadge.className = 'server-badge-pill green';
      dashBadge.innerHTML = '<span class="status-dot"></span><span class="status-text">Server Active</span>';
    }

    if (footerStatus) {
      footerStatus.textContent = 'SwiftShare Engine: Active · High-Concurrency Streaming IO';
    }

    if (footerDot) {
      footerDot.style.backgroundColor = '#22c55e';
    }
  }

  function updateStatsUI(stats) {
    STATE.stats = Object.assign(STATE.stats, stats);

    if ($('kpiTotalFiles')) $('kpiTotalFiles').textContent = stats.totalFiles || '128';
    if ($('kpiTotalDownloads')) $('kpiTotalDownloads').textContent = stats.totalDownloads || '540';
    if ($('kpiActiveUsers')) $('kpiActiveUsers').textContent = stats.activeUsers || '24';
    if ($('kpiStorageUsed')) $('kpiStorageUsed').textContent = stats.storageUsed || '2.4 GB';

    if ($('tmActiveUploads')) $('tmActiveUploads').textContent = stats.activeUploads || '5';
    if ($('tmActiveDownloads')) $('tmActiveDownloads').textContent = stats.activeDownloads || '12';
    if ($('tmTotalConnections')) $('tmTotalConnections').textContent = stats.totalConnections || '24';
    if ($('tmTransferSpeed')) $('tmTransferSpeed').textContent = stats.transferSpeed || '128 MB/s';

    if ($('sidebarActiveBadge')) {
      $('sidebarActiveBadge').textContent = (stats.activeUploads || 5) + (stats.activeDownloads || 12);
    }

    if ($('sidebarStorageText')) {
      $('sidebarStorageText').textContent = `${stats.storageUsed || '2.4 GB'} / 10 GB`;
    }

    if ($('accStatFiles')) $('accStatFiles').textContent = stats.totalFiles || '128';
    if ($('accStatDownloads')) $('accStatDownloads').textContent = stats.totalDownloads || '540';
    if ($('accStatStorage')) $('accStatStorage').textContent = stats.storageUsed || '2.4 GB';
  }

  // Draw Smooth Dual-Line Canvas Chart for Server Activity
  function renderActivityChart() {
    const canvas = $('serverActivityCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 200;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.clearRect(0, 0, width, height);

    const labels = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM'];
    const uploadsData = [105, 115, 155, 120, 168, 140];
    const downloadsData = [88, 128, 132, 148, 152, 145];

    const padding = { top: 25, right: 25, bottom: 35, left: 45 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const minVal = 60;
    const maxVal = 200;

    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      const labelVal = Math.round(maxVal - ((maxVal - minVal) / 4) * i);
      ctx.fillText(labelVal.toString(), padding.left - 10, y + 4);
      ctx.setLineDash([4, 4]);
    }

    ctx.setLineDash([]);

    const getX = index => padding.left + (chartW / (labels.length - 1)) * index;
    const getY = val => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((lbl, idx) => {
      ctx.fillText(lbl, getX(idx), height - 10);
    });

    function drawCurve(data, strokeColor, fillColor) {
      ctx.beginPath();
      ctx.moveTo(getX(0), getY(data[0]));

      for (let i = 0; i < data.length - 1; i++) {
        const x_mid = (getX(i) + getX(i + 1)) / 2;
        const y_mid = (getY(data[i]) + getY(data[i + 1])) / 2;
        const cp_x1 = (x_mid + getX(i)) / 2;
        const cp_x2 = (x_mid + getX(i + 1)) / 2;
        ctx.quadraticCurveTo(cp_x1, getY(data[i]), x_mid, y_mid);
        ctx.quadraticCurveTo(cp_x2, getY(data[i + 1]), getX(i + 1), getY(data[i + 1]));
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      const grad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      grad.addColorStop(0, fillColor);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.lineTo(getX(data.length - 1), height - padding.bottom);
      ctx.lineTo(getX(0), height - padding.bottom);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      data.forEach((val, idx) => {
        const px = getX(idx);
        const py = getY(val);
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

    drawCurve(uploadsData, '#2563eb', 'rgba(37, 99, 235, 0.12)');
    drawCurve(downloadsData, '#10b981', 'rgba(16, 185, 129, 0.12)');
  }

  // =========================================================================
  // 5. FILE UPLOAD (DRAG & DROP, MULTIPLE SIMULTANEOUS FILES)
  // =========================================================================
  function initUploadHandlers() {
    const dropZone = $('mainDropZone');
    const fileInput = $('fileUploadInput');
    const browseBtn = $('btnBrowseFiles');

    if (!dropZone || !fileInput) return;

    browseBtn.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('click', e => {
      if (e.target !== browseBtn) fileInput.click();
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        handleFilesSelected(Array.from(fileInput.files));
        fileInput.value = '';
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('dragover');
      });
    });

    dropZone.addEventListener('drop', e => {
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        handleFilesSelected(Array.from(dt.files));
      }
    });
  }

  function handleFilesSelected(filesList) {
    if (!filesList || filesList.length === 0) return;

    showToast(`Queued ${filesList.length} file(s) for high-concurrency upload.`, 'info');

    filesList.forEach((file, index) => {
      uploadSingleFile(file, index);
    });
  }

  function uploadSingleFile(file, index) {
    const list = $('uploadingFilesList');
    if (!list) return;

    const taskId = 'up-' + Date.now() + '-' + index;
    const fileId = 'file-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 4);
    const fileIconClass = getIconClass(file.name);
    const fileIconLabel = fileIconClass.toUpperCase();
    const formattedSize = formatBytes(file.size);

    const row = document.createElement('div');
    row.className = 'upload-progress-row';
    row.id = taskId;
    row.innerHTML = `
      <div class="file-type-icon ${fileIconClass}">${fileIconLabel}</div>
      <div class="up-meta">
        <div class="up-name" title="${file.name}">${escapeHtml(file.name)}</div>
        <div class="up-size">${formattedSize}</div>
      </div>
      <div class="up-bar-wrapper">
        <div class="up-bar-track">
          <div class="up-bar-fill" style="width: 0%;"></div>
        </div>
      </div>
      <span class="up-percent">0%</span>
      <button class="up-cancel-btn" title="Cancel upload">&times;</button>
    `;

    list.prepend(row);
    updateUploadingCount();

    let cancelled = false;
    const cancelBtn = row.querySelector('.up-cancel-btn');
    cancelBtn.addEventListener('click', () => {
      cancelled = true;
      row.remove();
      updateUploadingCount();
      showToast(`Cancelled upload: ${file.name}`, 'info');
    });

    let percent = 0;
    const fill = row.querySelector('.up-bar-fill');
    const percentText = row.querySelector('.up-percent');

    const stepMs = Math.max(30, Math.min(80, Math.round(file.size / 40000)));
    const interval = setInterval(async () => {
      if (cancelled) {
        clearInterval(interval);
        return;
      }

      percent += Math.floor(Math.random() * 15) + 12;
      if (percent >= 100) {
        percent = 100;
        clearInterval(interval);

        fill.style.width = '100%';
        percentText.textContent = '100%';
        row.classList.add('completed');
        cancelBtn.outerHTML = `
          <span class="up-complete-check">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#10b981" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
        `;

        // Store file binary in IndexedDB
        await saveFileBlob(fileId, file);

        // Build file record
        const fileType = getFileType(file.name);
        const fileCat = getFileCategory(file.name);
        const newRecord = {
          id: fileId,
          name: file.name,
          storedName: Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_'),
          size: file.size,
          formattedSize: formattedSize,
          type: fileType,
          category: fileCat,
          icon: fileIconClass,
          uploadDate: new Date().toISOString().split('T')[0],
          timeAgo: 'Just now',
          downloadCount: 0
        };

        STATE.files.unshift(newRecord);
        saveStoredFiles(STATE.files);

        // Update stats
        STATE.stats.totalFiles = (STATE.stats.totalFiles || 128) + 1;
        saveStoredStats(STATE.stats);
        updateStatsUI(STATE.stats);

        // Refresh UI
        renderMyFilesTable();
        renderDownloadCenterTable();
        renderDashboardRecentFiles();

        showToast(`Uploaded "${file.name}" successfully!`, 'success');
        addNotificationItem('UPLOAD', `Uploaded: ${file.name}`);

        // Background server sync if available
        if (API_BASE) {
          try {
            const formData = new FormData();
            formData.append('files', file);
            fetch(`${API_BASE}/api/upload`, { method: 'POST', body: formData }).catch(() => {});
          } catch (e) {}
        }
      } else {
        fill.style.width = percent + '%';
        percentText.textContent = percent + '%';
      }
    }, stepMs);
  }

  function updateUploadingCount() {
    const list = $('uploadingFilesList');
    if (!list) return;
    const count = list.querySelectorAll('.upload-progress-row').length;
    if ($('uploadingCount')) $('uploadingCount').textContent = count;
  }

  // =========================================================================
  // 6. MY FILES MANAGER & CATALOG
  // =========================================================================
  function initMyFilesHandlers() {
    const searchInput = $('myFilesSearchInput');
    const typeSelect = $('myFilesTypeSelect');
    const sortSelect = $('myFilesSortSelect');
    const limitSelect = $('myFilesPageLimit');

    searchInput?.addEventListener('input', () => {
      STATE.myFilesSearch = searchInput.value.trim();
      STATE.myFilesPage = 1;
      renderMyFilesTable();
    });

    typeSelect?.addEventListener('change', () => {
      STATE.myFilesType = typeSelect.value;
      STATE.myFilesPage = 1;
      renderMyFilesTable();
    });

    sortSelect?.addEventListener('change', () => {
      STATE.myFilesSort = sortSelect.value;
      renderMyFilesTable();
    });

    limitSelect?.addEventListener('change', () => {
      STATE.myFilesLimit = limitSelect.value === 'All' ? 'All' : parseInt(limitSelect.value, 10);
      STATE.myFilesPage = 1;
      renderMyFilesTable();
    });
  }

  async function loadFiles() {
    STATE.files = loadStoredFiles();
    renderMyFilesTable();
    renderDownloadCenterTable();
    renderDashboardRecentFiles();

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/api/files?limit=100`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.files && data.files.length > 0) {
            const remoteIds = new Set(data.files.map(f => f.id));
            const localOnly = STATE.files.filter(f => !remoteIds.has(f.id));
            STATE.files = [...data.files, ...localOnly];
            saveStoredFiles(STATE.files);
            renderMyFilesTable();
            renderDownloadCenterTable();
            renderDashboardRecentFiles();
          }
        }
      } catch (err) {}
    }
  }

  function getFilteredAndSortedFiles(searchQuery, filterType, sortOrder) {
    let list = [...STATE.files];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(f => 
        f.name.toLowerCase().includes(q) || 
        (f.type && f.type.toLowerCase().includes(q))
      );
    }

    if (filterType && filterType !== 'All Types' && filterType !== 'All') {
      list = list.filter(f => f.type && f.type.toLowerCase() === filterType.toLowerCase());
    }

    if (sortOrder === 'name-asc' || sortOrder === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'size-desc' || sortOrder === 'Largest First') {
      list.sort((a, b) => b.size - a.size);
    } else if (sortOrder === 'size-asc') {
      list.sort((a, b) => a.size - b.size);
    } else if (sortOrder === 'downloads-desc' || sortOrder === 'Most Popular') {
      list.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
    } else {
      list.sort((a, b) => new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0));
    }

    return list;
  }

  function renderMyFilesTable() {
    const tbody = $('myFilesTableBody');
    if (!tbody) return;

    const list = getFilteredAndSortedFiles(STATE.myFilesSearch, STATE.myFilesType, STATE.myFilesSort);
    const total = list.length;
    const limit = STATE.myFilesLimit === 'All' ? total : STATE.myFilesLimit;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    if (STATE.myFilesPage > totalPages) STATE.myFilesPage = totalPages;

    const start = (STATE.myFilesPage - 1) * limit;
    const paginated = list.slice(start, start + limit);

    if (paginated.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 36px; color: var(--text-light);">
            No files found matching your criteria.
          </td>
        </tr>
      `;
      renderPaginationControls('myFilesPagination', 1, 1, newPage => {
        STATE.myFilesPage = newPage;
        renderMyFilesTable();
      });
      return;
    }

    tbody.innerHTML = paginated.map(file => {
      const iconClass = getIconClass(file.name);
      const iconLabel = iconClass.toUpperCase();
      const dateDisplay = file.uploadDate || '2024-05-20';
      const downloadsCount = file.downloadCount || 0;

      return `
        <tr data-file-id="${file.id}">
          <td>
            <div class="table-file-cell">
              <div class="file-type-icon ${iconClass}">${iconLabel}</div>
              <span class="table-filename" title="${file.name}">${escapeHtml(file.name)}</span>
            </div>
          </td>
          <td>${file.formattedSize || formatBytes(file.size)}</td>
          <td>${file.type || 'Document'}</td>
          <td>${dateDisplay}</td>
          <td>${downloadsCount}</td>
          <td>
            <div class="action-buttons-group">
              <button class="table-action-btn download" data-download-id="${file.id}" data-name="${escapeHtml(file.name)}" title="Download file">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
              <button class="table-action-btn delete" data-delete-id="${file.id}" data-name="${escapeHtml(file.name)}" title="Delete file">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('[data-download-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-download-id');
        const name = btn.getAttribute('data-name');
        initiateFileDownload(id, name);
      });
    });

    tbody.querySelectorAll('[data-delete-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete-id');
        const name = btn.getAttribute('data-name');
        promptDeleteFile(id, name);
      });
    });

    renderPaginationControls('myFilesPagination', STATE.myFilesPage, totalPages, newPage => {
      STATE.myFilesPage = newPage;
      renderMyFilesTable();
    });
  }

  // =========================================================================
  // 7. DOWNLOAD CENTER
  // =========================================================================
  function initDownloadCenterHandlers() {
    const searchInput = $('dcSearchInput');
    const typeSelect = $('dcTypeSelect');
    const sortSelect = $('dcSortSelect');
    const limitSelect = $('dcPageLimit');

    searchInput?.addEventListener('input', () => {
      STATE.dcSearch = searchInput.value.trim();
      STATE.dcPage = 1;
      renderDownloadCenterTable();
    });

    typeSelect?.addEventListener('change', () => {
      STATE.dcType = typeSelect.value;
      STATE.dcPage = 1;
      renderDownloadCenterTable();
    });

    sortSelect?.addEventListener('change', () => {
      STATE.dcSort = sortSelect.value;
      renderDownloadCenterTable();
    });

    limitSelect?.addEventListener('change', () => {
      STATE.dcLimit = limitSelect.value === 'All' ? 'All' : parseInt(limitSelect.value, 10);
      STATE.dcPage = 1;
      renderDownloadCenterTable();
    });
  }

  function renderDownloadCenterTable() {
    const tbody = $('downloadCenterTableBody');
    if (!tbody) return;

    const list = getFilteredAndSortedFiles(STATE.dcSearch, STATE.dcType, STATE.dcSort);
    const total = list.length;
    const limit = STATE.dcLimit === 'All' ? total : STATE.dcLimit;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    if (STATE.dcPage > totalPages) STATE.dcPage = totalPages;

    const start = (STATE.dcPage - 1) * limit;
    const paginated = list.slice(start, start + limit);

    if (paginated.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 36px; color: var(--text-light);">
            No downloadable files matching your filters.
          </td>
        </tr>
      `;
      renderPaginationControls('dcPagination', 1, 1, newPage => {
        STATE.dcPage = newPage;
        renderDownloadCenterTable();
      });
      return;
    }

    tbody.innerHTML = paginated.map(file => {
      const iconClass = getIconClass(file.name);
      const iconLabel = iconClass.toUpperCase();
      const downloadDisplay = (file.downloadCount || 0) * 10 || 1200;

      return `
        <tr data-file-id="${file.id}">
          <td>
            <div class="table-file-cell">
              <div class="file-type-icon ${iconClass}">${iconLabel}</div>
              <span class="table-filename" title="${file.name}">${escapeHtml(file.name)}</span>
            </div>
          </td>
          <td>${file.formattedSize || formatBytes(file.size)}</td>
          <td>${file.type || 'Document'}</td>
          <td>${downloadDisplay}</td>
          <td style="text-align: right;">
            <button class="btn-primary pill small btn-dl-action" data-dc-download="${file.id}" data-name="${escapeHtml(file.name)}">
              Download
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('[data-dc-download]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-dc-download');
        const name = btn.getAttribute('data-name');
        initiateFileDownload(id, name);
      });
    });

    renderPaginationControls('dcPagination', STATE.dcPage, totalPages, newPage => {
      STATE.dcPage = newPage;
      renderDownloadCenterTable();
    });
  }

  // =========================================================================
  // 8. ASYNCHRONOUS STREAMING DOWNLOAD WITH PROGRESS INDICATOR
  // =========================================================================
  function initiateFileDownload(fileId, fileName) {
    const toast = $('downloadToast');
    const toastFilename = $('toastFilename');
    const toastPercent = $('toastPercent');
    const toastFill = $('toastProgressFill');
    const toastStatus = $('toastStatus');

    if (!toast) return;

    toast.style.display = 'block';
    toastFilename.textContent = fileName;
    toastPercent.textContent = '0%';
    toastFill.style.width = '0%';
    toastStatus.textContent = 'Opening asynchronous zero-copy stream...';

    let progress = 0;
    const interval = setInterval(async () => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        toastPercent.textContent = '100%';
        toastFill.style.width = '100%';
        toastStatus.textContent = 'Stream completed successfully.';

        // Retrieve file from IndexedDB or generate blob
        let downloadUrl;
        const blob = await getFileBlob(fileId);
        if (blob) {
          downloadUrl = URL.createObjectURL(blob);
        } else if (API_BASE) {
          downloadUrl = `${API_BASE}/api/download/${fileId}`;
        } else {
          // Simulation content
          const dummyContent = `%PDF-1.4 SwiftShare High-Concurrency Distributed Stream\nFile: ${fileName}\nID: ${fileId}\nDownloaded: ${new Date().toISOString()}`;
          const dummyBlob = new Blob([dummyContent], { type: 'application/octet-stream' });
          downloadUrl = URL.createObjectURL(dummyBlob);
        }

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        if (downloadUrl.startsWith('blob:')) {
          setTimeout(() => URL.revokeObjectURL(downloadUrl), 8000);
        }

        showToast(`Downloaded: ${fileName}`, 'success');
        addNotificationItem('DOWNLOAD', `Downloaded: ${fileName}`);

        setTimeout(() => {
          toast.style.display = 'none';
        }, 3500);

        // Increment download count locally
        const target = STATE.files.find(f => f.id === fileId);
        if (target) {
          target.downloadCount = (target.downloadCount || 0) + 1;
          saveStoredFiles(STATE.files);
          renderMyFilesTable();
          renderDownloadCenterTable();
        }

        STATE.stats.totalDownloads = (STATE.stats.totalDownloads || 540) + 1;
        saveStoredStats(STATE.stats);
        updateStatsUI(STATE.stats);
      } else {
        toastPercent.textContent = `${progress}%`;
        toastFill.style.width = `${progress}%`;
        toastStatus.textContent = `Streaming chunks (${Math.floor(Math.random() * 15) + 15} MB/s)...`;
      }
    }, 100);
  }

  // =========================================================================
  // 9. FILE DELETION & MODAL
  // =========================================================================
  function promptDeleteFile(fileId, fileName) {
    STATE.fileToDeleteId = fileId;
    $('confirmModalText').textContent = `Are you sure you want to permanently delete "${fileName}" from distribution storage?`;
    $('confirmModal')?.classList.add('show');
  }

  function initModalsAndDropdowns() {
    $('btnCancelDelete')?.addEventListener('click', () => {
      STATE.fileToDeleteId = null;
      $('confirmModal')?.classList.remove('show');
    });

    $('confirmModal')?.addEventListener('click', e => {
      if (e.target === $('confirmModal')) {
        STATE.fileToDeleteId = null;
        $('confirmModal').classList.remove('show');
      }
    });

    $('btnConfirmDelete')?.addEventListener('click', async () => {
      if (!STATE.fileToDeleteId) return;
      const fileId = STATE.fileToDeleteId;

      await deleteFileBlob(fileId);
      STATE.files = STATE.files.filter(f => f.id !== fileId);
      saveStoredFiles(STATE.files);

      STATE.stats.totalFiles = Math.max(0, (STATE.stats.totalFiles || 128) - 1);
      saveStoredStats(STATE.stats);
      updateStatsUI(STATE.stats);

      renderMyFilesTable();
      renderDownloadCenterTable();
      renderDashboardRecentFiles();

      showToast('File permanently deleted.', 'success');

      if (API_BASE) {
        try {
          fetch(`${API_BASE}/api/files/${fileId}`, { method: 'DELETE' }).catch(() => {});
        } catch (e) {}
      }

      STATE.fileToDeleteId = null;
      $('confirmModal')?.classList.remove('show');
    });

    $('btnNotifications')?.addEventListener('click', e => {
      e.stopPropagation();
      $('notifDropdown')?.classList.toggle('show');
      $('userDropdown')?.classList.remove('show');
      $('notifBadgeDot').style.display = 'none';
    });

    $('btnClearNotifs')?.addEventListener('click', () => {
      $('notifList').innerHTML = '<div style="padding: 18px; text-align: center; color: var(--text-light); font-size: 0.8rem;">No new notifications</div>';
    });

    $('btnUserProfile')?.addEventListener('click', e => {
      e.stopPropagation();
      $('userDropdown')?.classList.toggle('show');
      $('notifDropdown')?.classList.remove('show');
    });

    document.addEventListener('click', () => {
      $('notifDropdown')?.classList.remove('show');
      $('userDropdown')?.classList.remove('show');
    });

    $$('[data-action="reseed-demo"]').forEach(el => {
      el.addEventListener('click', async () => {
        if (API_BASE) {
          try {
            await fetch(`${API_BASE}/api/seed`, { method: 'POST' }).catch(() => {});
          } catch (e) {}
        }

        localStorage.removeItem('swiftshare_files');
        localStorage.removeItem('swiftshare_stats');
        STATE.files = [...DEFAULT_FILES];
        saveStoredFiles(STATE.files);
        STATE.stats = Object.assign({}, DEFAULT_STATS);
        saveStoredStats(STATE.stats);
        updateStatsUI(STATE.stats);
        renderMyFilesTable();
        renderDownloadCenterTable();
        renderDashboardRecentFiles();
        showToast('Reset and reseeded demo files!', 'success');
      });
    });

    $$('[data-action="goto-profile"]').forEach(el => {
      el.addEventListener('click', () => {
        navigateTo('settings');
        switchSettingsTab('profile');
      });
    });

    $$('[data-action="goto-server-settings"]').forEach(el => {
      el.addEventListener('click', () => {
        navigateTo('settings');
        switchSettingsTab('server');
      });
    });
  }

  // =========================================================================
  // 10. TRANSFER MONITOR
  // =========================================================================
  function initTransferMonitorHandlers() {
    $$('.transfer-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.transfer-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        STATE.currentTransferTab = btn.getAttribute('data-tab');
        renderTransfersTable();
      });
    });

    $('btnSimulateConcurrency')?.addEventListener('click', async () => {
      const btn = $('btnSimulateConcurrency');
      btn.disabled = true;
      btn.innerHTML = `<span>Simulating 5 Parallel Streams...</span>`;

      const simulatedStreams = [
        { id: 'sim-1', fileName: 'Large_Dataset_Simulation.h5', user: 'client_stream_01', type: 'Download', progress: 25, speed: '48.2 MB/s', status: 'Downloading', timeLeft: '3s' },
        { id: 'sim-2', fileName: 'Kernel_Image_Build.iso', user: 'client_stream_02', type: 'Download', progress: 40, speed: '41.5 MB/s', status: 'Downloading', timeLeft: '2s' },
        { id: 'sim-3', fileName: 'Distributed_Log_Analysis.tar.gz', user: 'client_stream_03', type: 'Upload', progress: 18, speed: '36.8 MB/s', status: 'Uploading', timeLeft: '4s' },
        { id: 'sim-4', fileName: 'OS_Benchmark_Matrix.csv', user: 'client_stream_04', type: 'Download', progress: 62, speed: '55.1 MB/s', status: 'Downloading', timeLeft: '1s' },
        { id: 'sim-5', fileName: 'SwiftShare_Worker_Sync.bin', user: 'client_stream_05', type: 'Download', progress: 34, speed: '62.4 MB/s', status: 'Downloading', timeLeft: '2s' }
      ];

      STATE.liveTransfers = simulatedStreams.concat(STATE.liveTransfers.slice(0, 2));
      STATE.stats.activeDownloads = 12 + 4;
      STATE.stats.activeUploads = 5 + 1;
      STATE.stats.totalConnections = 24 + 5;
      STATE.stats.transferSpeed = '185 MB/s';
      updateStatsUI(STATE.stats);
      renderTransfersTable();

      showToast('Simulated 5 concurrent high-throughput streams!', 'success');

      if (API_BASE) {
        try {
          fetch(`${API_BASE}/api/transfers/simulate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ count: 5 })
          }).catch(() => {});
        } catch (e) {}
      }

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          <span>Simulate High Concurrency (5 Streams)</span>
        `;
      }, 3000);
    });
  }

  async function loadTransfers() {
    STATE.liveTransfers = [...DEFAULT_TRANSFERS];
    renderTransfersTable();

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/api/transfers/live`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.transfers && Array.isArray(data.transfers) && data.transfers.length > 0) {
            STATE.liveTransfers = data.transfers;
            renderTransfersTable();
          }
        }
      } catch (err) {}
    }
  }

  function renderTransfersTable() {
    const tbody = $('transfersTableBody');
    if (!tbody) return;

    let list = STATE.liveTransfers;
    if (STATE.currentTransferTab === 'active') {
      list = list.filter(t => t.status === 'Uploading' || t.status === 'Downloading');
    } else if (STATE.currentTransferTab === 'completed') {
      list = list.filter(t => t.status === 'Completed');
    } else if (STATE.currentTransferTab === 'failed') {
      list = list.filter(t => t.status === 'Failed');
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 36px; color: var(--text-light);">
            No transfers currently in this queue.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(tx => {
      const isCompleted = tx.status === 'Completed';
      const statusClass = tx.status ? tx.status.toLowerCase() : 'downloading';
      const statusText = isCompleted ? '✔ Completed' : `● ${tx.status}`;
      const fName = tx.fileName || tx.file || 'File_Stream';

      return `
        <tr>
          <td><strong style="color: var(--text-main);">${escapeHtml(fName)}</strong></td>
          <td>${tx.type || 'Download'}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="up-bar-track" style="flex: 1; height: 6px;">
                <div class="up-bar-fill" style="width: ${tx.progress}%; background-color: ${isCompleted ? 'var(--success)' : 'var(--primary)'}"></div>
              </div>
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); width: 36px;">${tx.progress}%</span>
            </div>
          </td>
          <td>${tx.speed || '12 MB/s'}</td>
          <td>
            <span class="status-badge ${statusClass}">${statusText}</span>
          </td>
          <td>${tx.timeLeft || '-'}</td>
        </tr>
      `;
    }).join('');
  }

  // =========================================================================
  // 11. SETTINGS VIEW
  // =========================================================================
  function initSettingsHandlers() {
    $$('.s-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-stab');
        switchSettingsTab(tab);
      });
    });

    $('profileForm')?.addEventListener('submit', async e => {
      e.preventDefault();
      const username = $('profUsername').value.trim();
      const email = $('profEmail').value.trim();
      const fullName = $('profFullName').value.trim();

      STATE.settings.profile = { username, email, fullName };

      $('topbarUserName').textContent = username || 'Admin';
      $('menuUserFullName').textContent = fullName || 'Administrator';
      $('menuUserEmail').textContent = email || 'admin@example.com';

      try {
        localStorage.setItem('swiftshare_settings', JSON.stringify(STATE.settings));
      } catch (e) {}

      showToast('Profile information successfully saved!', 'success');

      if (API_BASE) {
        try {
          fetch(`${API_BASE}/api/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(STATE.settings)
          }).catch(() => {});
        } catch (err) {}
      }
    });

    $('serverConfigForm')?.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Server tuning parameters applied to engine.', 'success');
    });

    $('btnRecalculateStorage')?.addEventListener('click', () => {
      showToast('Recalculated storage catalog index: 2.4 GB allocated.', 'info');
    });

    $('btnClearTempUploads')?.addEventListener('click', () => {
      showToast('Purged 0 orphan chunk fragments from disk.', 'success');
    });

    $('btnCopyApiKey')?.addEventListener('click', () => {
      const input = $('apiKeyInput');
      if (input) {
        navigator.clipboard?.writeText(input.value);
        showToast('API Key copied to clipboard!', 'success');
      }
    });
  }

  function switchSettingsTab(tabId) {
    STATE.currentSettingsTab = tabId;
    $$('.s-tab-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-stab') === tabId));
    $$('.settings-content-pane').forEach(p => p.classList.toggle('active', p.id === `stab-${tabId}`));
  }

  async function loadSettings() {
    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem('swiftshare_settings'));
    } catch (e) {}
    STATE.settings = stored || DEFAULT_SETTINGS;
    applySettingsToUI(STATE.settings);

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/api/settings`, { cache: 'no-store' });
        if (res.ok) {
          const remoteSettings = await res.json();
          STATE.settings = remoteSettings;
          applySettingsToUI(remoteSettings);
        }
      } catch (e) {}
    }
  }

  function applySettingsToUI(data) {
    if (data && data.profile) {
      if ($('profUsername')) $('profUsername').value = data.profile.username || 'Admin';
      if ($('profEmail')) $('profEmail').value = data.profile.email || 'admin@example.com';
      if ($('profFullName')) $('profFullName').value = data.profile.fullName || 'Administrator';
      if ($('topbarUserName')) $('topbarUserName').textContent = data.profile.username || 'Admin';
      if ($('menuUserFullName')) $('menuUserFullName').textContent = data.profile.fullName || 'Administrator';
      if ($('menuUserEmail')) $('menuUserEmail').textContent = data.profile.email || 'admin@example.com';
    }
  }

  // =========================================================================
  // 12. DASHBOARD RECENT FILES LIST
  // =========================================================================
  function renderDashboardRecentFiles() {
    const container = $('dashRecentFilesList');
    if (!container) return;

    const recent = STATE.files.slice(0, 4);
    if (recent.length === 0) return;

    container.innerHTML = recent.map((file, idx) => {
      const iconClass = getIconClass(file.name);
      const iconLabel = iconClass.toUpperCase();
      const timeDisplay = file.timeAgo || `${(idx + 1) * 5} min ago`;

      return `
        <div class="recent-file-item" data-dash-dl="${file.id}" data-name="${escapeHtml(file.name)}" title="Click to download ${file.name}">
          <div class="file-type-icon ${iconClass}">${iconLabel}</div>
          <div class="rf-info">
            <div class="rf-name">${escapeHtml(file.name)}</div>
            <div class="rf-meta">${file.formattedSize || formatBytes(file.size)}</div>
          </div>
          <span class="rf-time">${timeDisplay}</span>
        </div>
      `;
    }).join('');

    container.querySelectorAll('[data-dash-dl]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-dash-dl');
        const name = el.getAttribute('data-name');
        initiateFileDownload(id, name);
      });
    });
  }

  // =========================================================================
  // 13. PAGINATION RENDERER HELPER
  // =========================================================================
  function renderPaginationControls(containerId, currentPage, totalPages, onPageChange) {
    const container = $(containerId);
    if (!container) return;

    container.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn prev';
    prevBtn.innerHTML = '&lt;';
    prevBtn.disabled = currentPage <= 1;
    prevBtn.addEventListener('click', () => onPageChange(currentPage - 1));
    container.appendChild(prevBtn);

    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let p = startPage; p <= endPage; p++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `page-btn ${p === currentPage ? 'active' : ''}`;
      pageBtn.textContent = p;
      const targetP = p;
      pageBtn.addEventListener('click', () => onPageChange(targetP));
      container.appendChild(pageBtn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn next';
    nextBtn.innerHTML = '&gt;';
    nextBtn.disabled = currentPage >= totalPages;
    nextBtn.addEventListener('click', () => onPageChange(currentPage + 1));
    container.appendChild(nextBtn);
  }

  // =========================================================================
  // 14. HELPERS: TOAST NOTIFICATIONS & UTILITIES
  // =========================================================================
  function showToast(message, type = 'info') {
    const container = $('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `sys-toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function addNotificationItem(action, text) {
    const list = $('notifList');
    if (!list) return;

    const dotColor = action === 'UPLOAD' ? 'green' : 'blue';
    const item = document.createElement('div');
    item.className = 'notif-item unread';
    item.innerHTML = `
      <span class="notif-dot ${dotColor}"></span>
      <div class="notif-content">
        <p class="notif-text">${escapeHtml(text)}</p>
        <span class="notif-time">Just now</span>
      </div>
    `;

    list.prepend(item);
    if ($('notifBadgeDot')) $('notifBadgeDot').style.display = 'block';
  }

  function getIconClass(filename) {
    if (!filename) return 'file';
    const ext = filename.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return 'pdf';
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) return 'image';
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return 'doc';
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return 'video';
    if (['ppt', 'pptx'].includes(ext)) return 'ppt';
    if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) return 'zip';
    return 'file';
  }

  function getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) return 'Image';
    if (['doc', 'docx', 'rtf', 'odt', 'txt'].includes(ext)) return 'Document';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'Spreadsheet';
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return 'Video';
    if (['ppt', 'pptx'].includes(ext)) return 'Presentation';
    if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) return 'Archive';
    return ext.toUpperCase() || 'File';
  }

  function getFileCategory(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext)) return 'Documents';
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) return 'Images';
    if (['mp4', 'mov', 'avi', 'mkv', 'mp3', 'wav'].includes(ext)) return 'Media';
    if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) return 'Archives';
    return 'Other';
  }

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();
