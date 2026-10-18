/**
 * ANNEX BD - Digital Systems & IT Engineering Architecture
 * Main Client-Side Controller
 * Domain: annexbd.tech | Location: Dhaka-1215, Bangladesh
 * Palette: Pitch Black Canvas + White Primary + Artistic Orange, Blue, Red Accents
 * Hosted on Vercel Edge Network
 * Strictly No Emojis | Pure SVG & Precision UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initDhakaClock();
  initMobileNav();
  initServiceTabs();
  initCostCalculator();
  initFaqAccordion();
  initContactModal();
  initToast();
  initScrollEffects();
});

/* --------------------------------------------------------------------------
   1. Live Dhaka-1215 Telemetry Clock & Operating Status
   -------------------------------------------------------------------------- */
function initDhakaClock() {
  const clockElement = document.getElementById('dhaka-live-time');
  if (!clockElement) return;

  function updateClock() {
    const options = {
      timeZone: 'Asia/Dhaka',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const now = new Date();
    const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
    clockElement.textContent = `${timeString} BST (Dhaka-1215)`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   2. Interactive Monochrome & Artistic Particle Constellation
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 30 : 65;
  const connectionDistance = 110;
  let mouse = { x: null, y: null, radius: 130 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.8;
      this.baseAlpha = Math.random() * 0.35 + 0.15;
      
      // 80% White, 10% Orange, 10% Blue for subtle artistic variety
      const r = Math.random();
      if (r < 0.8) {
        this.color = `rgba(255, 255, 255, ${this.baseAlpha})`;
      } else if (r < 0.9) {
        this.color = `rgba(255, 85, 0, ${this.baseAlpha + 0.2})`;
      } else {
        this.color = `rgba(0, 112, 243, ${this.baseAlpha + 0.2})`;
      }
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse gentle interaction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.4;
          this.y -= (dy / dist) * force * 1.4;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Drawer Controller
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-menu-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.remove('translate-x-full');
    document.body.classList.add('overflow-hidden');
  }

  function closeMenu() {
    drawer.classList.add('translate-x-full');
    document.body.classList.remove('overflow-hidden');
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* --------------------------------------------------------------------------
   4. Interactive Service Matrix Tabs
   -------------------------------------------------------------------------- */
function initServiceTabs() {
  const tabs = document.querySelectorAll('.web-tab-btn');
  const contents = document.querySelectorAll('.web-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');

      tabs.forEach(t => {
        t.classList.remove('active');
      });

      tab.classList.add('active');

      contents.forEach(content => {
        if (content.id === target) {
          content.classList.remove('hidden');
          content.classList.add('block');
        } else {
          content.classList.add('hidden');
          content.classList.remove('block');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Project Scope & Cost Estimator Calculator
   -------------------------------------------------------------------------- */
function initCostCalculator() {
  const serviceSelect = document.getElementById('calc-service-type');
  const tierSelect = document.getElementById('calc-tier');
  const addOnCheckboxes = document.querySelectorAll('.calc-addon');
  const timelineOutput = document.getElementById('calc-timeline-output');
  const deliverablesOutput = document.getElementById('calc-deliverables-list');
  const applyBtn = document.getElementById('calc-apply-btn');

  if (!serviceSelect || !tierSelect) return;

  const catalogData = {
    web_dev: {
      name: 'Website Development',
      tiers: {
        starter: { timeline: '5-8 Business Days', desc: 'Custom Business / Portfolio Architecture' },
        growth: { timeline: '10-15 Business Days', desc: 'E-Commerce / Educational School Portal with Gateway' },
        enterprise: { timeline: '18-28 Business Days', desc: 'Private Enterprise / Custom Web Application Platform' }
      },
      deliverables: [
        'Responsive Mobile-First Architecture',
        'Vercel Global Edge & SSL Optimization',
        'Technical On-Page & Schema SEO',
        'Direct WhatsApp & Lead Capture Integration'
      ]
    },
    meta_ads: {
      name: 'Meta Ads Support & Growth Lab',
      tiers: {
        starter: { timeline: '2-4 Days Setup + 30 Days Running', desc: 'Brand Reach & Conversion Campaign' },
        growth: { timeline: '3-5 Days Setup + 30 Days Scaling', desc: 'B2B/B2C Lead Gen + Conversions API (CAPI)' },
        enterprise: { timeline: 'Sprint Setup + Multi-Funnel Scale', desc: 'High ROAS Retargeting & Creative Matrix' }
      },
      deliverables: [
        'Full Meta Pixel & Server-Side CAPI Setup',
        'Audience Segmenting & Retargeting Funnel',
        'Ad Copywriting & Creative Concept Testing',
        'Weekly Performance Telemetry & Optimization'
      ]
    },
    branding: {
      name: 'Canva Branding & Visual Kit',
      tiers: {
        starter: { timeline: '3-5 Business Days', desc: 'Brand Identity & Social Media Suite' },
        growth: { timeline: '5-8 Business Days', desc: 'Complete Corporate Deck & Vector Guidelines' },
        enterprise: { timeline: '8-12 Business Days', desc: 'Omnichannel Digital Brand Kit & Marketing Assets' }
      },
      deliverables: [
        'Editable Premium Canva Pro Templates',
        'High-Res Vector Brand Assets & Color Palettes',
        'Social Media Kit (Meta, LinkedIn, YouTube)',
        'Full Typography & Brand Consistency Manual'
      ]
    },
    devops: {
      name: 'DevOps, Git & Vercel Edge Hosting',
      tiers: {
        starter: { timeline: '2-3 Business Days', desc: 'DNS, Vercel Edge & Domain Setup' },
        growth: { timeline: '4-7 Business Days', desc: 'Git CI/CD Pipeline & Server Hardening' },
        enterprise: { timeline: '7-14 Business Days', desc: 'Multi-Cloud Edge Deployment & Zero-Downtime Migration' }
      },
      deliverables: [
        'Vercel Edge Global Deployment Hooks',
        'DNS & SSL/TLS Hardening (HTTP/3 Performance)',
        'Automated Git Version Control & Rollbacks',
        'Automated Backup & Uptime Health Monitoring'
      ]
    },
    hourly_support: {
      name: 'Dedicated IT & After-Sales SLA',
      tiers: {
        starter: { timeline: 'Instant Dispatch (10 Hrs Retainer)', desc: 'Standard Per-Hour Maintenance & Bugfixes' },
        growth: { timeline: 'Priority SLA (25 Hrs Retainer)', desc: 'Dedicated Monthly Engineering Support' },
        enterprise: { timeline: '24/7 Dedicated Team (50+ Hrs)', desc: 'Mission-Critical Enterprise SLA Support' }
      },
      deliverables: [
        'Priority Response Within Agreed SLA Hours',
        'Direct Developer Discord / WhatsApp Hotline',
        'Security Patches & Performance Audits',
        'Itemized Transparent Hourly Work Logs'
      ]
    }
  };

  function recalculate() {
    const service = serviceSelect.value;
    const tier = tierSelect.value;
    const serviceInfo = catalogData[service] || catalogData.web_dev;
    const tierInfo = serviceInfo.tiers[tier] || serviceInfo.tiers.starter;

    let timelineText = tierInfo.timeline;
    let extraDeliverables = [];

    addOnCheckboxes.forEach(cb => {
      if (cb.checked) {
        extraDeliverables.push(cb.getAttribute('data-name'));
      }
    });

    if (timelineOutput) {
      timelineOutput.textContent = timelineText;
    }

    if (deliverablesOutput) {
      deliverablesOutput.innerHTML = '';
      const allItems = [...serviceInfo.deliverables, ...extraDeliverables];
      allItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'flex items-start text-sm text-zinc-300';
        li.innerHTML = `
          <svg class="w-4 h-4 text-white mr-2.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>${item}</span>
        `;
        deliverablesOutput.appendChild(li);
      });
    }
  }

  serviceSelect.addEventListener('change', recalculate);
  tierSelect.addEventListener('change', recalculate);
  addOnCheckboxes.forEach(cb => cb.addEventListener('change', recalculate));

  recalculate();

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const service = serviceSelect.value;
      const tier = tierSelect.value;
      const serviceInfo = catalogData[service] || catalogData.web_dev;
      const tierInfo = serviceInfo.tiers[tier] || serviceInfo.tiers.starter;

      const addons = Array.from(addOnCheckboxes)
        .filter(c => c.checked)
        .map(c => c.getAttribute('data-name'))
        .join(', ');

      const modal = document.getElementById('contact-modal');
      const serviceInput = document.getElementById('modal-service');
      const detailsInput = document.getElementById('modal-details');

      if (serviceInput) serviceInput.value = serviceInfo.name;
      if (detailsInput) {
        detailsInput.value = `Selected Tier: ${tierInfo.desc} (${tierInfo.timeline})\nSelected Addons: ${addons || 'None'}\nLooking forward to a customized proposal.`;
      }

      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.classList.add('overflow-hidden');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. FAQ Accordion Logic
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.faq-toggle');

  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const content = item.querySelector('.faq-content');
      const icon = btn.querySelector('.faq-icon');
      const isOpen = !content.classList.contains('hidden');

      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.querySelector('.faq-content').classList.add('hidden');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      if (isOpen) {
        content.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Contact / Quote Modal & Direct Dispatch
   -------------------------------------------------------------------------- */
function initContactModal() {
  const modal = document.getElementById('contact-modal');
  const openButtons = document.querySelectorAll('.open-quote-modal');
  const closeButton = document.getElementById('close-modal-btn');
  const contactForm = document.getElementById('project-lead-form');
  const whatsappDirectBtn = document.getElementById('whatsapp-direct-btn');

  if (!modal) return;

  function openModal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  if (closeButton) closeButton.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('modal-name')?.value || 'Client';
      const email = document.getElementById('modal-email')?.value || '';
      const phone = document.getElementById('modal-phone')?.value || 'N/A';
      const service = document.getElementById('modal-service')?.value || 'IT / Web Service';
      const details = document.getElementById('modal-details')?.value || '';

      const subject = encodeURIComponent(`Project Inquiry: ${service} - [${name}]`);
      const body = encodeURIComponent(
        `Dear ANNEX BD Team,\n\n` +
        `Client Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone/WhatsApp: ${phone}\n` +
        `Requested Service: ${service}\n\n` +
        `Project Scope & Requirements:\n${details}\n\n` +
        `Dispatched via annexbd.tech Portal (Vercel Edge)`
      );

      const mailtoUrl = `mailto:support@annexbd.tech?subject=${subject}&body=${body}`;
      
      showToast('Opening email client for support@annexbd.tech...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
        closeModal();
      }, 700);
    });
  }

  if (whatsappDirectBtn) {
    whatsappDirectBtn.addEventListener('click', () => {
      const msg = encodeURIComponent("Hello ANNEX BD, I would like to consult on a project (Website / Meta Ads / IT Support).");
      window.open(`https://wa.me/8801700000000?text=${msg}`, '_blank');
    });
  }
}

/* --------------------------------------------------------------------------
   8. Copy Email & Toast Notification
   -------------------------------------------------------------------------- */
function initToast() {
  const copyButtons = document.querySelectorAll('.copy-email-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText('support@annexbd.tech')
        .then(() => {
          showToast('Email address copied: support@annexbd.tech');
        })
        .catch(() => {
          showToast('Official Contact: support@annexbd.tech');
        });
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastText = document.getElementById('toast-message');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.remove('opacity-0', 'translate-y-8', 'pointer-events-none');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-8', 'pointer-events-none');
  }, 3500);
}

/* --------------------------------------------------------------------------
   9. Scroll Effects & Floating Dock
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const floatingDock = document.getElementById('floating-action-dock');
  const navbar = document.getElementById('main-navbar');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (floatingDock) {
      if (scrollPos > 400) {
        floatingDock.classList.remove('opacity-0', 'translate-y-12', 'pointer-events-none');
        floatingDock.classList.add('opacity-100', 'translate-y-0');
      } else {
        floatingDock.classList.remove('opacity-100', 'translate-y-0');
        floatingDock.classList.add('opacity-0', 'translate-y-12', 'pointer-events-none');
      }
    }

    if (navbar) {
      if (scrollPos > 50) {
        navbar.classList.add('shadow-xl', 'shadow-black', 'border-white/15');
      } else {
        navbar.classList.remove('shadow-xl', 'shadow-black', 'border-white/15');
      }
    }
  });

  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
