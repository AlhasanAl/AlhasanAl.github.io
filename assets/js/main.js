/* =====================================================================
   main.js: nav, scroll reveals, and the blog engine
   ===================================================================== */

/* ---- Mobile nav --------------------------------------------------- */
(function () {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }
})();

/* ---- Scroll reveal ------------------------------------------------ */
(function () {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !els.length) {
    els.forEach((e) => e.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((e) => io.observe(e));
})();

/* ---- Blog engine ---------------------------------------------------
   Reads /posts.json (a manifest), then either lists posts or renders a
   single markdown file. No build step required, works on GitHub Pages.
 * ------------------------------------------------------------------- */

function fmtDate(iso) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch { return iso; }
}

async function loadManifest() {
  const res = await fetch("posts.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("no manifest");
  const posts = await res.json();
  // newest first
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/* Home page: render up to 3 latest posts */
async function renderLatest(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  try {
    const posts = (await loadManifest()).slice(0, 3);
    if (!posts.length) throw new Error("empty");
    mount.innerHTML = posts.map(rowHTML).join("");
  } catch {
    mount.innerHTML =
      '<p class="posts__empty">No posts yet: first write-up is in progress.</p>';
  }
}

/* Blog index: render all posts */
async function renderIndex(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  try {
    const posts = await loadManifest();
    if (!posts.length) throw new Error("empty");
    mount.innerHTML = posts.map(rowHTML).join("");
  } catch {
    mount.innerHTML =
      '<p class="posts__empty">No posts yet. Check back soon: notes from the lab and the desk are on the way.</p>';
  }
}

function rowHTML(p) {
  return `
    <a class="post-row" href="post.html?p=${encodeURIComponent(p.slug)}">
      <span class="post-row__date mono">${fmtDate(p.date)}</span>
      <span>
        <span class="post-row__title">${escapeHTML(p.title)}</span>
        <span class="post-row__desc">${escapeHTML(p.description || "")}</span>
      </span>
      <span class="post-row__tag">${escapeHTML(p.tag || "")}</span>
    </a>`;
}

/* Single post renderer */
async function renderPost() {
  const mount = document.getElementById("article");
  if (!mount) return;
  const slug = new URLSearchParams(location.search).get("p");
  if (!slug) { mount.innerHTML = notFound(); return; }

  try {
    const posts = await loadManifest();
    const meta = posts.find((x) => x.slug === slug);
    const res = await fetch(`posts/${slug}.md`, { cache: "no-cache" });
    if (!res.ok) throw new Error("missing file");
    const md = await res.text();
    const title = meta ? meta.title : slug;
    document.title = `${title} · Alhasan Abdulrazzaq`;

    mount.innerHTML = `
      <a class="article__back" href="blog.html">&larr; All writing</a>
      <div class="article__meta">${meta ? fmtDate(meta.date) : ""}${meta && meta.tag ? " · " + escapeHTML(meta.tag) : ""}</div>
      <h1>${escapeHTML(title)}</h1>
      <div class="article__body">${window.marked ? window.marked.parse(md) : escapeHTML(md)}</div>`;
  } catch (e) {
    mount.innerHTML = notFound();
  }
}

function notFound() {
  return `
    <a class="article__back" href="blog.html">&larr; All writing</a>
    <h1>Post not found</h1>
    <p class="muted">That post doesn't exist yet. If you're previewing locally, remember posts load over <code>http</code>: run a local server (see the README).</p>`;
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

/* Auto-run based on markers present in the page */
document.addEventListener("DOMContentLoaded", () => {
  renderLatest("latest-posts");
  renderIndex("post-index");
  renderPost();
});
