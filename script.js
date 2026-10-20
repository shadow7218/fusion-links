/**
 * ============================================================================
 * LIQUIDGLASS HUB — MAIN APPLICATION CONTROLLER
 * ============================================================================
 * Modules:
 * 1. Theme & Navigation Controller
 * 2. Sonic Audio Player + Web Audio API Live Visualizer + Procedural WAV Gen
 * 3. Cinema YouTube Privacy Player & Playlist Manager
 * 4. Nexus Link Sharing Hub + QR Generator + Web Share API
 * 5. Prism Redemption Engine ("Redimate") + Particle Burst Canvas
 * 6. PWA Service Worker & Install Prompt
 * ============================================================================
 */

/* ============================================================================
   STORAGE ADAPTER (LOCALSTORAGE WITH BACKEND SWAP GUIDE)
   ============================================================================
   HOW TO SWAP TO SUPABASE OR FIREBASE LATER:
   Replace the synchronous methods inside `StorageService` with async calls to
   your database SDK:
     - get(key, fallback): `const { data } = await supabase.from(key).select('*')`
     - set(key, value):    `await supabase.from(key).upsert(value)`
   ============================================================================ */
const StorageService = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      console.warn(`Storage read error for ${key}:`, err);
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`Storage write error for ${key}:`, err);
    }
  }
};

/* ============================================================================
   CONFIGURATION & SEED DATA (CUSTOMIZE YOUR CODES & INITIAL ITEMS HERE)
   ============================================================================ */

// 1. Predefined Redeem Codes — Edit or add your own custom codes here!
const REDEEM_CODES_CONFIG = {
  "GLASS-2025": {
    themeId: "aurora",
    title: "Aurora Borealis Shader",
    message: "Unlocked the Aurora Borealis environment!"
  },
  "SUNSET-88": {
    themeId: "sunset",
    title: "Solaris Horizon Shader",
    message: "Unlocked the Solaris Sunset environment!"
  },
  "CYBER-2077": {
    themeId: "neon",
    title: "Cyberpunk Neon Matrix",
    message: "Unlocked the Neon Matrix environment!"
  },
  "COSMOS-X": {
    themeId: "cosmos",
    title: "Deep Cosmos Gold Shader",
    message: "Unlocked the Deep Cosmos Gold environment!"
  },
  "MASTER-KEY": {
    themeId: "ALL",
    title: "All Spatial Shaders",
    message: "Master Key Accepted! All environments unlocked."
  }
};

// 2. Available Background Themes Gallery
const THEMES_CATALOG = [
  {
    id: "ocean",
    name: "Pacific Abyss",
    desc: "Deep bioluminescent blues & teals (Default)",
    gradient: "linear-gradient(135deg, #0284c7, #4f46e5, #0d9488)",
    codeHint: "Default Unlocked"
  },
  {
    id: "aurora",
    name: "Aurora Borealis",
    desc: "Polar emerald greens & violet streams",
    gradient: "linear-gradient(135deg, #10b981, #06b6d4, #8b5cf6)",
    codeHint: "Code: GLASS-2025"
  },
  {
    id: "sunset",
    name: "Solaris Horizon",
    desc: "Warm crimson, amber & magenta dusk",
    gradient: "linear-gradient(135deg, #f43f5e, #f97316, #a855f7)",
    codeHint: "Code: SUNSET-88"
  },
  {
    id: "neon",
    name: "Cyberpunk Pulse",
    desc: "Electric magenta & hyper-cyan glow",
    gradient: "linear-gradient(135deg, #d946ef, #00f5d4, #3b82f6)",
    codeHint: "Code: CYBER-2077"
  },
  {
    id: "cosmos",
    name: "Supernova Gold",
    desc: "Celestial gold dust & deep nebula violet",
    gradient: "linear-gradient(135deg, #eab308, #6366f1, #ec4899)",
    codeHint: "Code: COSMOS-X"
  }
];

// 3. Seed YouTube Videos
const SEED_YOUTUBE_VIDEOS = [
  { id: "jfKfPfyJRdk", title: "lofi hip hop radio — beats to relax/study to" },
  { id: "5qap5aO4i9A", title: "Lofi Girl — Synthwave Chill Beats" },
  { id: "DWcJFNfaw9c", title: "Ambient Space Relaxation — 4K Deep Focus" }
];

// 4. Seed Links for Nexus Hub
const SEED_LINKS = [
  {
    id: "lnk-1",
    title: "Apple Human Interface Guidelines — visionOS",
    url: "https://developer.apple.com/design/human-interface-guidelines/designing-for-visionos",
    tag: "Design",
    notes: "Spatial materials, glass surfaces, and depth ergonomics.",
    createdAt: Date.now() - 3600000 * 24 * 3
  },
  {
    id: "lnk-2",
    title: "MDN Web Audio API Documentation",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API",
    tag: "Dev",
    notes: "Reference for real-time frequency analysis and spatial audio nodes.",
    createdAt: Date.now() - 3600000 * 24 * 2
  },
  {
    id: "lnk-3",
    title: "Lucide Open-Source Icon Library",
    url: "https://lucide.dev",
    tag: "Design",
    notes: "Clean, consistent SVG icons used across LiquidGlass Hub.",
    createdAt: Date.now() - 3600000 * 24
  },
  {
    id: "lnk-4",
    title: "GitHub Pages Deployment Guide",
    url: "https://pages.github.com/",
    tag: "Cloud",
    notes: "Host static SPAs directly from your repository with zero config.",
    createdAt: Date.now()
  }
];

/* ============================================================================
   TOAST NOTIFICATION HELPER
   ============================================================================ */
function showToast(message, iconName = "check-circle") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i data-lucide="${iconName}"></i><span>${escapeHTML(message)}</span>`;
  container.appendChild(toast);
  if (window.lucide) lucide.createIcons({ root: toast });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(30px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function escapeHTML(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ============================================================================
   1. NAVIGATION & LIGHT/DARK THEME CONTROLLER
   ============================================================================ */
function initNavigationAndTheme() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".tab-section");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      navButtons.forEach((b) => {
        const isMatch = b.dataset.target === target;
        b.classList.toggle("active", isMatch);
        b.setAttribute("aria-selected", isMatch ? "true" : "false");
      });
      sections.forEach((sec) => {
        sec.classList.toggle("active", sec.id === `section-${target}`);
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Light / Dark Mode Init (Default to system preference, persist in localStorage)
  const savedMode = localStorage.getItem("lg_color_mode");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const initialMode = savedMode || (prefersLight ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", initialMode);

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("lg_color_mode", next);
    showToast(`Switched to ${next === "dark" ? "Dark" : "Light"} Glass Mode`, next === "dark" ? "moon" : "sun");
  });
}

/* ============================================================================
   2. SONIC MUSIC PLAYER & WEB AUDIO API VISUALIZER
   ============================================================================
   Generates 3 distinct stereo WAV tracks in-memory on load so the HTML5 <audio>
   element and Web Audio AnalyserNode work immediately without external MP3 CORS
   issues or 404s. Users can also upload/drop any local audio files.
   ============================================================================ */
function createSynthesizedWavBlobUrl(chordFreqs, durationSec = 10) {
  const sampleRate = 22050;
  const numSamples = sampleRate * durationSec;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Rhythmic pulse envelope + harmonic chord synthesis
    const pulse = 0.65 + 0.35 * Math.sin(2 * Math.PI * 2 * t);
    const bass = 0.35 * Math.sin(2 * Math.PI * (chordFreqs[0] / 2) * t);
    let sample = bass;
    for (let f = 0; f < chordFreqs.length; f++) {
      sample += (0.22 * Math.sin(2 * Math.PI * chordFreqs[f] * t)) * pulse;
    }
    // Arpeggio sparkle
    const arpFreq = chordFreqs[Math.floor(t * 4) % chordFreqs.length] * 2;
    sample += 0.12 * Math.sin(2 * Math.PI * arpFreq * t) * Math.exp(-((t * 4) % 1) * 4);

    // Fade in/out edges
    const env = Math.min(1, t / 0.4, (durationSec - t) / 0.6);
    const pcmValue = Math.max(-1, Math.min(1, sample * env)) * 32767;
    view.setInt16(44 + i * 2, pcmValue, true);
  }

  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}

function initMusicPlayer() {
  const audioEl = document.getElementById("html5-audio");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const shuffleBtn = document.getElementById("shuffle-btn");
  const repeatBtn = document.getElementById("repeat-btn");
  const seekSlider = document.getElementById("seek-slider");
  const volumeSlider = document.getElementById("volume-slider");
  const muteBtn = document.getElementById("mute-btn");
  const currentTimeEl = document.getElementById("current-time");
  const totalDurationEl = document.getElementById("total-duration");
  const trackTitleEl = document.getElementById("track-title");
  const trackArtistEl = document.getElementById("track-artist");
  const trackBadgeEl = document.getElementById("track-source-badge");
  const albumArtWrapper = document.getElementById("album-art-wrapper");
  const albumArtVisual = document.getElementById("album-art-visual");
  const playlistUl = document.getElementById("playlist-ul");
  const playlistCount = document.getElementById("playlist-count");
  const fileUpload = document.getElementById("audio-upload");
  const dropZone = document.getElementById("drop-zone");
  const canvas = document.getElementById("audio-visualizer");
  const ctx = canvas.getContext("2d");

  // Built-in Demo Tracks (Synthesized in-memory so they never 404)
  const defaultTracks = [
    {
      id: "demo-1",
      title: "Glass Horizon (Spatial Pad)",
      artist: "LiquidGlass Synth Engine",
      source: "Built-in Audio",
      url: createSynthesizedWavBlobUrl([220, 277.18, 329.63, 440], 12),
      gradient: "conic-gradient(from 0deg, #38bdf8, #818cf8, #c084fc, #38bdf8)"
    },
    {
      id: "demo-2",
      title: "Nebula Pulse (Arpeggio)",
      artist: "VisionOS Sound Lab",
      source: "Built-in Audio",
      url: createSynthesizedWavBlobUrl([196, 246.94, 293.66, 392], 12),
      gradient: "conic-gradient(from 45deg, #10b981, #06b6d4, #6366f1, #10b981)"
    },
    {
      id: "demo-3",
      title: "Cybernetic Dusk (Sub Bass)",
      artist: "Prism Audio Collective",
      source: "Built-in Audio",
      url: createSynthesizedWavBlobUrl([164.81, 207.65, 246.94, 329.63], 12),
      gradient: "conic-gradient(from 90deg, #f43f5e, #f97316, #a855f7, #f43f5e)"
    }
  ];

  // Restore saved metadata of uploaded tracks for display reference
  let playlist = [...defaultTracks];
  let currentIndex = 0;
  let isPlaying = false;
  let isShuffle = false;
  let isRepeat = false;

  // Web Audio API Context & AnalyserNode
  let audioCtx = null;
  let analyser = null;
  let dataArray = null;

  function ensureAudioContext() {
    if (audioCtx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    const sourceNode = audioCtx.createMediaElementSource(audioEl);
    sourceNode.connect(analyser);
    analyser.connect(audioCtx.destination);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    drawVisualizer();
  }

  function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const barCount = 40;
    const gap = 5;
    const barWidth = (width - gap * (barCount - 1)) / barCount;

    if (analyser && isPlaying) {
      analyser.getByteFrequencyData(dataArray);
    }

    const styles = getComputedStyle(document.documentElement);
    const accent1 = styles.getPropertyValue("--accent-primary").trim() || "#38bdf8";
    const accent2 = styles.getPropertyValue("--accent-secondary").trim() || "#818cf8";

    const grad = ctx.createLinearGradient(0, height, 0, 0);
    grad.addColorStop(0, accent2);
    grad.addColorStop(1, accent1);
    ctx.fillStyle = grad;

    for (let i = 0; i < barCount; i++) {
      const value = analyser && isPlaying ? dataArray[i] : 12;
      const percent = Math.max(0.08, value / 255);
      const barHeight = percent * (height - 12);
      const x = i * (barWidth + gap);
      const y = height - barHeight;

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 6);
      ctx.fill();
    }
  }

  function formatTime(sec) {
    if (! isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  function renderPlaylist() {
    playlistCount.textContent = `${playlist.length} tracks`;
    playlistUl.innerHTML = "";

    playlist.forEach((track, idx) => {
      const li = document.createElement("li");
      li.className = `playlist-item ${idx === currentIndex ? "active" : ""}`;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", idx === currentIndex ? "true" : "false");
      li.innerHTML = `
        <div class="playlist-item-left">
          <div class="playlist-num">${idx + 1}</div>
          <div class="playlist-meta">
            <h4>${escapeHTML(track.title)}</h4>
            <span>${escapeHTML(track.artist)} • ${escapeHTML(track.source)}</span>
          </div>
        </div>
        <i data-lucide="${idx === currentIndex && isPlaying ? "volume-2" : "play"}"></i>
      `;
      li.addEventListener("click", () => {
        loadTrack(idx, true);
      });
      playlistUl.appendChild(li);
    });

    if (window.lucide) lucide.createIcons({ root: playlistUl });
  }

  function updatePlayButtonIcon() {
    playPauseBtn.innerHTML = `<i data-lucide="${isPlaying ? "pause" : "play"}"></i>`;
    if (window.lucide) lucide.createIcons({ root: playPauseBtn });
    albumArtWrapper.classList.toggle("playing", isPlaying);
  }

  function loadTrack(index, autoPlay = false) {
    if (index < 0) index = playlist.length - 1;
    if (index >= playlist.length) index = 0;
    currentIndex = index;

    const track = playlist[currentIndex];
    audioEl.src = track.url;
    trackTitleEl.textContent = track.title;
    trackArtistEl.textContent = track.artist;
    trackBadgeEl.textContent = track.source;
    albumArtVisual.style.background = track.gradient;

    seekSlider.value = 0;
    currentTimeEl.textContent = "0:00";

    if (autoPlay) {
      playCurrent();
    } else {
      renderPlaylist();
    }
  }

  async function playCurrent() {
    try {
      ensureAudioContext();
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }
      await audioEl.play();
      isPlaying = true;
      updatePlayButtonIcon();
      renderPlaylist();
    } catch (err) {
      console.warn("Playback failed:", err);
      showToast("Tap Play again to start audio", "info");
    }
  }

  function pauseCurrent() {
    audioEl.pause();
    isPlaying = false;
    updatePlayButtonIcon();
    renderPlaylist();
  }

  playPauseBtn.addEventListener("click", () => {
    if (isPlaying) pauseCurrent();
    else playCurrent();
  });

  prevBtn.addEventListener("click", () => loadTrack(currentIndex - 1, true));

  nextBtn.addEventListener("click", () => {
    if (isShuffle) {
      const rand = Math.floor(Math.random() * playlist.length);
      loadTrack(rand, true);
    } else {
      loadTrack(currentIndex + 1, true);
    }
  });

  shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active-toggle", isShuffle);
    showToast(`Shuffle ${isShuffle ? "Enabled" : "Disabled"}`, "shuffle");
  });

  repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;
    audioEl.loop = isRepeat;
    repeatBtn.classList.toggle("active-toggle", isRepeat);
    showToast(`Repeat ${isRepeat ? "Enabled" : "Disabled"}`, "repeat");
  });

  audioEl.addEventListener("timeupdate", () => {
    if (audioEl.duration) {
      seekSlider.value = (audioEl.currentTime / audioEl.duration) * 100;
      currentTimeEl.textContent = formatTime(audioEl.currentTime);
      totalDurationEl.textContent = formatTime(audioEl.duration);
    }
  });

  audioEl.addEventListener("loadedmetadata", () => {
    totalDurationEl.textContent = formatTime(audioEl.duration);
  });

  audioEl.addEventListener("ended", () => {
    if (!isRepeat) {
      nextBtn.click();
    }
  });

  seekSlider.addEventListener("input", () => {
    if (audioEl.duration) {
      audioEl.currentTime = (seekSlider.value / 100) * audioEl.duration;
    }
  });

  volumeSlider.addEventListener("input", () => {
    audioEl.volume = parseFloat(volumeSlider.value);
    audioEl.muted = audioEl.volume === 0;
  });

  muteBtn.addEventListener("click", () => {
    audioEl.muted = !audioEl.muted;
    muteBtn.innerHTML = `<i data-lucide="${audioEl.muted ? "volume-x" : "volume-2"}"></i>`;
    if (window.lucide) lucide.createIcons({ root: muteBtn });
  });

  // Handle Local File Uploads & Drag-and-Drop
  function handleAudioFiles(fileList) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("audio/"));
    if (!files.length) {
      showToast("Please select valid audio files (.mp3, .wav, .ogg)", "alert-circle");
      return;
    }

    const uploadedMeta = StorageService.get("lg_uploaded_audio_meta", []);

    files.forEach((file) => {
      const objectUrl = URL.createObjectURL(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      const newTrack = {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: cleanName,
        artist: "Local Audio File",
        source: "Uploaded",
        url: objectUrl,
        gradient: "conic-gradient(from 180deg, #ec4899, #8b5cf6, #38bdf8, #ec4899)"
      };
      playlist.push(newTrack);
      uploadedMeta.push({ title: cleanName, addedAt: Date.now() });
    });

    StorageService.set("lg_uploaded_audio_meta", uploadedMeta.slice(-25));
    renderPlaylist();
    loadTrack(playlist.length - files.length, true);
    showToast(`Added ${files.length} audio track(s) to queue!`, "music");
  }

  fileUpload.addEventListener("change", (e) => {
    if (e.target.files.length) handleAudioFiles(e.target.files);
    fileUpload.value = "";
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    if (e.dataTransfer.files.length) {
      handleAudioFiles(e.dataTransfer.files);
    }
  });

  // Initial Draw & Load First Track
  drawVisualizer();
  loadTrack(0, false);
}

/* ============================================================================
   3. CINEMA YOUTUBE VIDEO PLAYER & PLAYLIST
   ============================================================================ */
function extractYouTubeId(input) {
  const trimmed = input.trim();
  // Direct 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  // Standard & shortened YouTube URLs
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regex);
  return match ? match[1] : null;
}

function initYouTubeModule() {
  const ytForm = document.getElementById("yt-form");
  const urlInput = document.getElementById("yt-url-input");
  const titleInput = document.getElementById("yt-title-input");
  const stageBox = document.getElementById("yt-stage-box");
  const currentTitleEl = document.getElementById("yt-current-title");
  const currentIdEl = document.getElementById("yt-current-id");
  const externalLinkEl = document.getElementById("yt-external-link");
  const ytGrid = document.getElementById("yt-grid");
  const ytCount = document.getElementById("yt-count");

  let videos = StorageService.get("lg_yt_playlist", SEED_YOUTUBE_VIDEOS);
  let activeVideoId = videos[0]?.id || "jfKfPfyJRdk";

  function loadVideoIntoStage(videoObj) {
    if (!videoObj) return;
    activeVideoId = videoObj.id;
    currentTitleEl.textContent = videoObj.title;
    currentIdEl.textContent = `Video ID: ${videoObj.id} • Privacy-Enhanced Embed`;
    externalLinkEl.href = `https://www.youtube.com/watch?v=${encodeURIComponent(videoObj.id)}`;

    stageBox.innerHTML = `
      <iframe
        src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoObj.id)}?rel=0"
        title="${escapeHTML(videoObj.title)}"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>
    `;
    renderVideoGrid();
  }

  function renderVideoGrid() {
    ytCount.textContent = `${videos.length} videos`;
    ytGrid.innerHTML = "";

    videos.forEach((vid) => {
      const card = document.createElement("article");
      card.className = `glass-card yt-card ${vid.id === activeVideoId ? "active-video" : ""}`;
      card.innerHTML = `
        <div class="yt-thumb-wrap">
          <img src="https://img.youtube.com/vi/${encodeURIComponent(vid.id)}/mqdefault.jpg" alt="${escapeHTML(vid.title)}" loading="lazy" />
          <div class="yt-play-overlay">
            <div class="glass-btn play-fab"><i data-lucide="play"></i></div>
          </div>
        </div>
        <div class="yt-card-footer">
          <h4 class="yt-card-title">${escapeHTML(vid.title)}</h4>
          <button class="glass-btn icon-only sm delete-yt-btn" aria-label="Remove video" title="Remove">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      `;

      card.addEventListener("click", (e) => {
        if (e.target.closest(".delete-yt-btn")) return;
        loadVideoIntoStage(vid);
      });

      card.querySelector(".delete-yt-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        videos = videos.filter((v) => v.id !== vid.id);
        StorageService.set("lg_yt_playlist", videos);
        renderVideoGrid();
        showToast("Removed video from playlist", "trash-2");
      });

      ytGrid.appendChild(card);
    });

    if (window.lucide) lucide.createIcons({ root: ytGrid });
  }

  ytForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const extractedId = extractYouTubeId(urlInput.value);
    if (!extractedId) {
      showToast("Invalid YouTube URL or Video ID", "alert-triangle");
      return;
    }

    const customTitle = titleInput.value.trim() || `YouTube Stream (${extractedId})`;
    const existing = videos.find((v) => v.id === extractedId);
    const videoObj = existing || { id: extractedId, title: customTitle };

    if (!existing) {
      videos.unshift(videoObj);
      StorageService.set("lg_yt_playlist", videos);
    }

    urlInput.value = "";
    titleInput.value = "";
    loadVideoIntoStage(videoObj);
    showToast("Video loaded into Cinema stage!", "tv");
  });

  if (videos.length > 0) {
    loadVideoIntoStage(videos[0]);
  } else {
    renderVideoGrid();
  }
}

/* ============================================================================
   4. NEXUS LINK SHARING HUB (SEARCH, TAGS, CLIPBOARD, WEB SHARE, QR CODE)
   ============================================================================ */
function initLinksHub() {
  const toggleFormBtn = document.getElementById("toggle-link-form-btn");
  const linkForm = document.getElementById("link-form");
  const formHeading = document.getElementById("link-form-heading");
  const submitLabel = document.getElementById("link-submit-label");
  const cancelBtn = document.getElementById("cancel-link-btn");
  const editIdInput = document.getElementById("link-edit-id");
  const titleInput = document.getElementById("link-title");
  const urlInput = document.getElementById("link-url");
  const tagInput = document.getElementById("link-tag");
  const notesInput = document.getElementById("link-notes");

  const searchInput = document.getElementById("link-search");
  const tagFilter = document.getElementById("link-tag-filter");
  const sortSelect = document.getElementById("link-sort");
  const linksGrid = document.getElementById("links-grid");

  // QR Modal Elements
  const qrModal = document.getElementById("qr-modal");
  const closeQrBtn = document.getElementById("close-qr-modal");
  const qrContainer = document.getElementById("qr-code-container");
  const qrUrlText = document.getElementById("qr-modal-url");

  let links = StorageService.get("lg_links_vault", SEED_LINKS);

  function extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return "example.com";
    }
  }

  function updateCategoryDropdown() {
    const currentVal = tagFilter.value;
    const uniqueTags = Array.from(new Set(links.map((l) => (l.tag || "General").trim()).filter(Boolean)));
    tagFilter.innerHTML = `<option value="ALL">All Categories (${links.length})</option>`;
    uniqueTags.forEach((tag) => {
      const opt = document.createElement("option");
      opt.value = tag;
      opt.textContent = tag;
      tagFilter.appendChild(opt);
    });
    if (uniqueTags.includes(currentVal)) tagFilter.value = currentVal;
  }

  function openQrModal(linkObj) {
    qrContainer.innerHTML = "";
    qrUrlText.textContent = linkObj.url;
    qrModal.classList.remove("hidden");
    if (window.QRCode) {
      new QRCode(qrContainer, {
        text: linkObj.url,
        width: 190,
        height: 190,
        colorDark: "#060913",
        colorLight: "#ffffff"
      });
    }
  }

  closeQrBtn.addEventListener("click", () => qrModal.classList.add("hidden"));
  qrModal.addEventListener("click", (e) => {
    if (e.target === qrModal) qrModal.classList.add("hidden");
  });

  function renderLinks() {
    updateCategoryDropdown();
    const query = searchInput.value.trim().toLowerCase();
    const selectedTag = tagFilter.value;
    const sortBy = sortSelect.value;

    let filtered = links.filter((item) => {
      const matchesTag = selectedTag === "ALL" || (item.tag || "General") === selectedTag;
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.url.toLowerCase().includes(query) ||
        (item.tag || "").toLowerCase().includes(query) ||
        (item.notes || "").toLowerCase().includes(query);
      return matchesTag && matchesQuery;
    });

    filtered.sort((a, b) => {
      if (sortBy === "newest") return b.createdAt - a.createdAt;
      if (sortBy === "oldest") return a.createdAt - b.createdAt;
      if (sortBy === "az") return a.title.localeCompare(b.title);
      if (sortBy === "za") return b.title.localeCompare(a.title);
      return 0;
    });

    linksGrid.innerHTML = "";

    if (filtered.length === 0) {
      linksGrid.innerHTML = `
        <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 2.5rem;">
          <p class="text-muted">No links match your search filter. Try adding a new bookmark!</p>
        </div>
      `;
      return;
    }

    filtered.forEach((item) => {
      const domain = extractDomain(item.url);
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;

      const card = document.createElement("article");
      card.className = "glass-card link-card";
      card.innerHTML = `
        <div>
          <div class="link-card-top">
            <img src="${faviconUrl}" alt="" class="link-favicon" loading="lazy" />
            <div class="link-info">
              <span class="link-tag-pill">${escapeHTML(item.tag || "General")}</span>
              <a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer" class="link-title-anchor">
                ${escapeHTML(item.title)}
              </a>
              <p class="link-domain">${escapeHTML(domain)}</p>
            </div>
          </div>
          ${item.notes ? `<p class="link-notes" style="margin-top: 0.85rem;">${escapeHTML(item.notes)}</p>` : ""}
        </div>

        <div class="link-card-actions">
          <div class="link-action-group">
            <button class="glass-btn icon-only sm copy-btn" title="Copy Link" aria-label="Copy URL">
              <i data-lucide="copy"></i>
            </button>
            <button class="glass-btn icon-only sm share-btn" title="Share Link" aria-label="Share URL">
              <i data-lucide="share-2"></i>
            </button>
            <button class="glass-btn icon-only sm qr-btn" title="Show QR Code" aria-label="Generate QR Code">
              <i data-lucide="qr-code"></i>
            </button>
          </div>
          <div class="link-action-group">
            <button class="glass-btn icon-only sm edit-btn" title="Edit Link" aria-label="Edit Link">
              <i data-lucide="edit-3"></i>
            </button>
            <button class="glass-btn icon-only sm delete-btn" title="Delete Link" aria-label="Delete Link">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      `;

      // Copy Link Handler
      card.querySelector(".copy-btn").addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(item.url);
          showToast("Link copied to clipboard!", "clipboard-check");
        } catch {
          showToast("Failed to copy link", "alert-circle");
        }
      });

      // Web Share API Handler
      card.querySelector(".share-btn").addEventListener("click", async () => {
        if (navigator.share) {
          try {
            await navigator.share({ title: item.title, text: item.notes || item.title, url: item.url });
          } catch {
            // User canceled share sheet
          }
        } else {
          await navigator.clipboard.writeText(item.url);
          showToast("Share API unavailable — URL copied instead!", "share-2");
        }
      });

      // QR Code Handler
      card.querySelector(".qr-btn").addEventListener("click", () => openQrModal(item));

      // Edit Link Handler
      card.querySelector(".edit-btn").addEventListener("click", () => {
        editIdInput.value = item.id;
        titleInput.value = item.title;
        urlInput.value = item.url;
        tagInput.value = item.tag || "";
        notesInput.value = item.notes || "";
        formHeading.textContent = "Edit Bookmark";
        submitLabel.textContent = "Update Link";
        linkForm.classList.remove("hidden");
        titleInput.focus();
      });

      // Delete Link Handler
      card.querySelector(".delete-btn").addEventListener("click", () => {
        links = links.filter((l) => l.id !== item.id);
        StorageService.set("lg_links_vault", links);
        renderLinks();
        showToast("Bookmark deleted", "trash-2");
      });

      linksGrid.appendChild(card);
    });

    if (window.lucide) lucide.createIcons({ root: linksGrid });
  }

  function resetLinkForm() {
    linkForm.reset();
    editIdInput.value = "";
    formHeading.textContent = "Add New Bookmark";
    submitLabel.textContent = "Save Link";
    linkForm.classList.add("hidden");
  }

  toggleFormBtn.addEventListener("click", () => {
    const isHidden = linkForm.classList.contains("hidden");
    if (isHidden) {
      resetLinkForm();
      linkForm.classList.remove("hidden");
      titleInput.focus();
    } else {
      resetLinkForm();
    }
  });

  cancelBtn.addEventListener("click", resetLinkForm);

  linkForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const editingId = editIdInput.value;
    const payload = {
      id: editingId || `lnk-${Date.now()}`,
      title: titleInput.value.trim(),
      url: urlInput.value.trim(),
      tag: tagInput.value.trim() || "General",
      notes: notesInput.value.trim(),
      createdAt: Date.now()
    };

    if (editingId) {
      links = links.map((l) => (l.id === editingId ? { ...l, ...payload, createdAt: l.createdAt } : l));
      showToast("Bookmark updated!", "check");
    } else {
      links.unshift(payload);
      showToast("Bookmark added to Nexus Vault!", "bookmark");
    }

    StorageService.set("lg_links_vault", links);
    resetLinkForm();
    renderLinks();
  });

  // Debounced Search Input
  let searchTimer = null;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(renderLinks, 180);
  });

  tagFilter.addEventListener("change", renderLinks);
  sortSelect.addEventListener("change", renderLinks);

  renderLinks();
}

/* ============================================================================
   5. PRISM MEDIA REDEMPTION ("REDIMATE") & CONFETTI BURST ENGINE
   ============================================================================ */
function triggerCelebrationBurst() {
  const canvas = document.getElementById("burst-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#38bdf8", "#818cf8", "#34d399", "#fb7185", "#facc15", "#e879f9", "#ffffff"];
  const particles = Array.from({ length: 95 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: (Math.random() - 0.5) * 18,
    vy: (Math.random() - 0.7) * 18,
    size: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 1,
    rotation: Math.random() * 360,
    vRot: (Math.random() - 0.5) * 10
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach((p) => {
      if (p.alpha <= 0) return;
      active = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.32; // Gravity
      p.alpha -= 0.014;
      p.rotation += p.vRot;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (active) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  animate();
}

function initRedeemModule() {
  const redeemForm = document.getElementById("redeem-form");
  const codeInput = document.getElementById("redeem-code-input");
  const themesGrid = document.getElementById("themes-grid");
  const unlockedCountEl = document.getElementById("unlocked-count");
  const hintPills = document.querySelectorAll(".hint-pill");

  let unlockedThemes = StorageService.get("lg_unlocked_themes", ["ocean"]);
  let activeBgTheme = localStorage.getItem("lg_active_bg_theme") || "ocean";

  function applyBgTheme(themeId) {
    activeBgTheme = themeId;
    document.documentElement.setAttribute("data-bg-theme", themeId);
    localStorage.setItem("lg_active_bg_theme", themeId);
    renderThemesGallery();
  }

  function renderThemesGallery() {
    unlockedCountEl.textContent = `${unlockedThemes.length} / ${THEMES_CATALOG.length} Unlocked`;
    themesGrid.innerHTML = "";

    THEMES_CATALOG.forEach((theme) => {
      const isUnlocked = unlockedThemes.includes(theme.id);
      const isActive = activeBgTheme === theme.id;

      const card = document.createElement("article");
      card.className = "glass-card theme-card";
      card.innerHTML = `
        <div class="theme-preview" style="background: ${theme.gradient};">
          <div class="theme-lock-badge" title="${isUnlocked ? "Unlocked" : "Locked"}">
            <i data-lucide="${isUnlocked ? "unlock" : "lock"}"></i>
          </div>
          <span class="track-badge" style="background: rgba(0,0,0,0.55); color: #fff;">
            ${escapeHTML(theme.codeHint)}
          </span>
        </div>
        <div class="theme-card-body">
          <div>
            <h4>${escapeHTML(theme.name)}</h4>
            <p>${escapeHTML(theme.desc)}</p>
          </div>
          <button
            class="glass-btn sm ${isActive ? "primary-btn" : ""}"
            ${!isUnlocked ? "disabled style='opacity:0.5;cursor:not-allowed;'" : ""}
          >
            ${isActive ? "Active" : isUnlocked ? "Apply" : "Locked"}
          </button>
        </div>
      `;

      if (isUnlocked) {
        card.querySelector("button").addEventListener("click", () => {
          applyBgTheme(theme.id);
          showToast(`Activated ${theme.name} environment!`, "palette");
        });
      }

      themesGrid.appendChild(card);
    });

    if (window.lucide) lucide.createIcons({ root: themesGrid });
  }

  hintPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      codeInput.value = pill.dataset.code;
      codeInput.focus();
    });
  });

  redeemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const entered = codeInput.value.trim().toUpperCase();
    const reward = REDEEM_CODES_CONFIG[entered];

    if (!reward) {
      showToast("Invalid redemption code. Try one of the demo codes!", "x-circle");
      return;
    }

    if (reward.themeId === "ALL") {
      unlockedThemes = THEMES_CATALOG.map((t) => t.id);
    } else if (!unlockedThemes.includes(reward.themeId)) {
      unlockedThemes.push(reward.themeId);
    }

    StorageService.set("lg_unlocked_themes", unlockedThemes);
    if (reward.themeId !== "ALL") {
      applyBgTheme(reward.themeId);
    } else {
      renderThemesGallery();
    }

    codeInput.value = "";
    triggerCelebrationBurst();
    showToast(reward.message, "sparkles");
  });

  // Restore saved active background shader on boot
  applyBgTheme(unlockedThemes.includes(activeBgTheme) ? activeBgTheme : "ocean");
}

/* ============================================================================
   6. PWA SERVICE WORKER & INSTALL PROMPT
   ============================================================================ */
function initPWA() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch((err) => {
        console.warn("Service worker registration skipped:", err);
      });
    });
  }

  let deferredPrompt = null;
  const installBtn = document.getElementById("install-pwa-btn");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove("hidden");
  });

  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.classList.add("hidden");
  });
}

/* ============================================================================
   BOOT APPLICATION
   ============================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  initNavigationAndTheme();
  initMusicPlayer();
  initYouTubeModule();
  initLinksHub();
  initRedeemModule();
  initPWA();
});
