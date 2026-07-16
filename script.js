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
    <p>A three LAN internetwork designed and simulated in Cisco Packet Tracer, modeling a
    4G/5G-style architecture carrying both voice and data traffic.</p>

    <img src="images/topology.png" alt="Complete three-LAN internetwork topology">

    <p><strong>The backbone:</strong> Each LAN reaches the internetwork through its own
    <strong>2911 gateway</strong> over serial links, using static public addresses
    (172.0.10.1, 172.0.20.1, 172.0.30.1). Internally, every LAN runs private addressing via
    DHCP, with <strong>NAT overload (PAT)</strong> on each gateway so private hosts share the
    public interface across the serial backbone.</p>

    <h3>LAN 1 — Cellular</h3>
    <p>A Central Office Server (192.68.10.2) providing DHCP, two cell towers, and three
    smartphones. Devices authenticate through the carrier infrastructure before receiving
    service, and NAT hides every internal address from the outside network.</p>

    <img src="images/lan1.png" alt="LAN 1 cellular topology">

    <h3>LAN 2 — WiFi</h3>
    <p>A basic service set: three access points serving five laptops and two smartphones,
    secured with <strong>WPA2-PSK and AES</strong>. Every client must supply the pre-shared key
    before it can associate and pull a DHCP lease.</p>

    <img src="images/lan2.png" alt="LAN 2 WiFi topology">

    <h3>LAN 3 — Wired + VoIP</h3>
    <p>Three Cisco 7960 IP phones daisy-chained with three PCs, so each phone's built-in switch
    port passes data through to its PC while carrying voice on a dedicated
    <strong>voice VLAN</strong>. VLAN segmentation separates voice from data at the switch, with
    WPA2-PSK protecting the wireless segment.</p>

    <img src="images/lan3.png" alt="LAN 3 wired and VoIP topology">

    <h3>Verification</h3>
    <p>I traced ICMP traffic in Simulation mode from a PC in LAN 3 through the IP phone and
    switch, across all three gateways. End to end pings returned <strong>0% packet loss</strong>,
    confirming DHCP, NAT, VLAN, and inter-LAN routing were all working together.</p>

    <img src="images/ping1.png" alt="Successful ping test showing 0% packet loss">

    <h3>Verification</h3>
    <p>I traced ICMP traffic in Simulation mode from a PC in LAN 3 through the IP phone and
    switch, across all three gateways. The event list shows each hop the packet takes across
    the serial backbone.</p>

    <img src="images/pdu.png" alt="Packet Tracer simulation panel showing ICMP traffic traversing all three LANs">

    <p>End-to-end pings returned <strong>0% packet loss</strong>, confirming DHCP, NAT, VLAN,
    and inter-LAN routing were all working together.</p>

    <img src="images/ping2.png" alt="Successful ping test showing 0% packet loss">
  `,
},

  aws: {
    title: "AWS High-Availability Proof of Concept",
    body: `
      <p>A two-instance, load-balanced web environment on AWS, built to practice designing for
      <strong>failover and observability</strong> rather than a single fragile server.</p>

      <h3>Compute</h3>
      <p>Two Windows Server 2019 EC2 instances (t2.micro), each with an attached 5 GB EBS volume.
      Both passed 2/2 status checks and ran behind a shared security group.</p>

      <img src="images/aws-ec2.png" alt="Two EC2 instances running with 2/2 status checks passed">

      <h3>Load balancing</h3>
      <p>An internet facing <strong>Application Load Balancer</strong> distributing traffic across
      both instances in separate availability zones (us-east-1a and us-east-1b). DNS handled
      through a <strong>Route 53</strong> hosted zone with a CNAME alias pointing at the load
      balancer so the endpoint stays stable even when the infrastructure behind it changes.</p>

      <img src="images/aws-alb.png" alt="Application Load Balancer spanning two availability zones">

      <h3>Monitoring</h3>
      <p><strong>CloudWatch</strong> tracking CPU utilization, disk I/O, and network throughput
      across both instances the difference between "it's running" and "I'd know if it stopped."</p>

      <img src="images/aws-cloudwatch.png" alt="CloudWatch metrics dashboard showing CPU and network metrics">

      <h3>Data layer</h3>
      <p>A <strong>DynamoDB</strong> table storing customer records, queried and verified through
      the console.</p>

      <img src="images/aws-dynamodb.png" alt="DynamoDB table with customer records">

      <h3>What I'd change before production</h3>
      <p>The lab security group allowed SSH (22) and RDP (3389) inbound from <code>0.0.0.0/0</code>
      the entire internet. That's acceptable in a sandbox and unacceptable anywhere real. In
      production I'd restrict management ports to a bastion host or a known CIDR range, drop RDP
      from the public internet entirely, and move the instances into private subnets with only the
      load balancer exposed.</p>

      <p>I also hit a <strong>503 from the load balancer</strong> before the target group finished
      registering the instances as healthy a useful reminder that a <em>provisioned</em> ALB and a
      <em>working</em> ALB aren't the same thing, and that health checks are the first place to look.</p>
    `,
  },

  lab: {
    title: "Security Home Lab",
    body: `
      <p><strong>The setup:</strong> A Kali Linux environment running OWASP Juice Shop in Docker
      a deliberately vulnerable application built by OWASP specifically for training.</p>

      <p><strong>What I'm learning:</strong> Reconnaissance, common web vulnerability classes, and
      how small misconfigurations chain into real access.</p>

      <p><strong>The rule:</strong> Everything runs against targets I own or that are explicitly
      built to be attacked. Learning offensive security and staying on the right side of the line
      aren't in tension the discipline depends on that boundary.</p>

      <p><strong>Why a defender should learn offense:</strong> You defend systems better once
      you've seen how they come apart.</p>
    `,
  },

  itam: {
    title: "IT Asset Management System",
    body: `
      <p><strong>The project:</strong> A full systems analysis and design engagement, delivered
      across multiple milestones from project charter to final presentation.</p>

      <p><strong>Artifacts:</strong> A requirements document with four swim lane process maps,
      a design document with wireframes and a network topology, and a final presentation deck.</p>

      <p><strong>The design:</strong> Single sign-on with two factor authentication, role-based
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