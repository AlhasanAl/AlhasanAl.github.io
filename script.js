/* ---- 1. Reveal sections as they scroll into view ---- */
const sections = document.querySelectorAll("section");

const revealer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

sections.forEach((section) => revealer.observe(section));


/* ---- 2. Highlight the nav link for the section you're viewing ---- */
const navLinks = document.querySelectorAll(".sidebar__nav a");

const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === "#" + entry.target.id
        );
      });
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach((section) => spy.observe(section));

/* ---- Project data ---- */
const projects = {
  network: {
  title: "Enterprise Multi-LAN Internetwork",
  body: `
    <p><strong>What it is:</strong> A three-LAN internetwork designed and simulated in Cisco
    Packet Tracer, modeling a 4G/5G-style architecture that carries both voice and data.</p>

    <p><strong>LAN 1 — Cellular.</strong> A Central Office Server (192.68.10.2) running DHCP,
    two cell towers, and three smartphones. Devices authenticate through the carrier
    infrastructure before receiving service.</p>

    <p><strong>LAN 2 — WiFi.</strong> A basic service set: three access points serving five
    laptops and two smartphones, secured with WPA2-PSK and AES. Every client supplies the
    pre-shared key before it can associate and pull a DHCP lease.</p>

    <p><strong>LAN 3 — Wired + VoIP.</strong> Three Cisco 7960 IP phones daisy-chained with
    three PCs, so each phone's built-in switch port passes data to its PC while carrying voice
    on a dedicated voice VLAN. VLAN segmentation keeps voice and data separated at the switch.</p>

    <p><strong>The backbone:</strong> Each LAN reaches the internetwork through its own 2911
    gateway over serial links, using static public addresses (172.0.10.1, 172.0.20.1,
    172.0.30.1). Internally every LAN runs private addressing via DHCP, with NAT overload (PAT)
    on each gateway so private hosts share the public interface.</p>

    <p><strong>How I proved it worked:</strong> Traced ICMP traffic in Simulation mode from a
    PC in LAN 3, through the IP phone and switch, across all three gateways. End-to-end pings
    returned <strong>0% packet loss</strong> — confirming DHCP, NAT, VLAN, and inter-LAN routing
    were all functioning together.</p>
  `,
},

  aws: {
    title: "AWS High-Availability Build",
    body: `
      <p><strong>The build:</strong> A resilient web tier on AWS — Windows EC2 instances behind
      an Application Load Balancer, DNS handled by Route 53, health and metrics through
      CloudWatch, and application state in DynamoDB.</p>

      <p><strong>The point:</strong> Practice designing for failover and observability rather
      than a single fragile server. The difference between "it runs" and "it stays running"
      is architecture, not effort.</p>

      <p><strong>Also produced:</strong> A cost comparison across AWS, Azure, and GCP to reason
      about total cost of ownership before committing to a provider.</p>
    `,
  },

  lab: {
    title: "Security Home Lab",
    body: `
      <p><strong>The setup:</strong> A Kali Linux environment running OWASP Juice Shop in Docker
      — a deliberately vulnerable application built by OWASP specifically for training.</p>

      <p><strong>What I'm learning:</strong> Reconnaissance, common web vulnerability classes, and
      how small misconfigurations chain into real access.</p>

      <p><strong>The rule:</strong> Everything runs against targets I own or that are explicitly
      built to be attacked. Learning offensive security and staying on the right side of the line
      aren't in tension — the discipline depends on that boundary.</p>

      <p><strong>Why a defender should learn offense:</strong> You defend systems better once
      you've seen how they come apart.</p>
    `,
  },

  itam: {
    title: "IT Asset Management System",
    body: `
      <p><strong>The project:</strong> A full systems analysis and design engagement, delivered
      across multiple milestones from project charter to final presentation.</p>

      <p><strong>Artifacts:</strong> A requirements document with four swim-lane process maps,
      a design document with wireframes and a network topology, and a final presentation deck.</p>

      <p><strong>The design:</strong> Single sign-on with two-factor authentication, role-based
      access across three roles, and standardized asset states and conditions on a cloud stack
      backed by SQL.</p>
    `,
  },
};

/* ---- Modal ---- */
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");

function openModal(key) {
  const project = projects[key];
  if (!project) return;
  modalTitle.textContent = project.title;
  modalBody.innerHTML = project.body;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-project]").forEach((card) => {
  card.addEventListener("click", () => openModal(card.dataset.project));
});

modal.querySelectorAll("[data-close]").forEach((el) => {
  el.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});