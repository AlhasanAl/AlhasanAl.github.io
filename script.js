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
      <p><strong>The build:</strong> A three-LAN enterprise network in Cisco Packet Tracer —
      a cellular LAN, a Wi-Fi LAN, and a wired/VoIP LAN — connected across a serial WAN
      using NAT overload so internal hosts share a single public range.</p>

      <p><strong>The problem:</strong> After adding NAT, traffic from the internal LANs
      started dying mid-path. Routing was fine and both ends looked healthy, which made it
      look like a routing issue. It wasn't — packets were being translated twice, so return
      traffic had nowhere to go.</p>

      <p><strong>The fix:</strong> An extended ACL with a deny statement, so internal-to-internal
      traffic was excluded from translation before the NAT rule could grab it a second time.
      Order mattered: the deny had to be evaluated before the broad permit.</p>

      <p><strong>Also solved:</strong> Corrected the serial subnet mask to unify the public IPs,
      worked around Packet Tracer's DHCP default-gateway bug, and deployed VoIP on a 2811 router
      running CME.</p>

      <p><strong>Delivered:</strong> Topology diagrams, a technical report with a block diagram,
      and a security design addendum mapped to the NIST Cybersecurity Framework 2.0.</p>

      <p><strong>What I took from it:</strong> NAT problems love to disguise themselves as
      routing problems. When connectivity dies mid-path but both ends are healthy, check
      translation before you re-check routes.</p>
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