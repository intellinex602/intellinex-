/* =========================================
   Intellinex Technology - MAIN JS
   ========================================= */

// ---- THEME MANAGER ----
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('Intellinex-theme') || 'dark';
    this.apply(saved);
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('Intellinex-theme', theme);
    const icons = document.querySelectorAll('.theme-icon');
    icons.forEach(icon => {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

// ---- NAVBAR ----
const Navbar = {
  init() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
    // Hamburger
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      });
    }
    // Active link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .nav-dropdown-item').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPage || href.includes(currentPage.replace('.html', '')))) {
        link.classList.add('active');
      }
    });
    // Mobile sub-menus
    document.querySelectorAll('.mobile-menu-link.has-sub').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const sub = link.nextElementSibling;
        if (sub) sub.classList.toggle('open');
        const arrow = link.querySelector('.sub-arrow');
        if (arrow) arrow.style.transform = sub?.classList.contains('open') ? 'rotate(180deg)' : '';
      });
    });
  }
};

// ---- SCROLL REVEAL ----
const ScrollReveal = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      observer.observe(el);
    });
  }
};

// ---- COUNTER ANIMATION ----
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          this.animate(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  },
  animate(el) {
    const target = parseFloat(el.dataset.target || el.textContent);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      el.textContent = prefix + (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
};

// ---- PROGRESS BAR ANIMATION ----
const ProgressBars = {
  init() {
    const bars = document.querySelectorAll('.progress-fill');
    if (!bars.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.dataset.width || '0%';
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(bar => {
      bar.style.width = '0%';
      observer.observe(bar);
    });
  }
};

// ---- FAQ ----
const FAQ = {
  init() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }
};

// ---- AI CHAT WIDGET ----
const ChatWidget = {
  isOpen: false,
  messages: [],
  responses: {
    default: "Thank you for reaching out! I'm Intellinex AI. I can help with questions about our Managed IT, Cloud, AI, and Cybersecurity services. What would you like to know?",
    managed: "Our Managed IT Services include 24/7 monitoring, helpdesk support, network management, patch management, and proactive maintenance. We guarantee 99.9% uptime with our SLA. Would you like a free assessment?",
    cloud: "We offer comprehensive cloud solutions including AWS, Azure, and Google Cloud migration, multi-cloud architecture, cloud security, and cost optimization. Our certified architects can design the perfect solution for you.",
    ai: "Our AI solutions include machine learning models, intelligent automation, predictive analytics, natural language processing, and AI-powered business intelligence. We help enterprises leverage AI for competitive advantage.",
    security: "Our cybersecurity services cover threat detection, SOC monitoring, penetration testing, compliance management (ISO 27001, SOC2, GDPR), and incident response. We protect your business 24/7.",
    hardware: "We procure, deploy, and maintain enterprise hardware including servers, networking equipment, workstations, and peripherals. We partner with Dell, HP, Cisco, and other top vendors.",
    software: "Our software development team builds custom enterprise applications, web platforms, mobile apps, and system integrations using modern tech stacks. We follow agile methodology with full transparency.",
    contact: "You can reach us at: 📧 info@Intellinex.tech | 📞 +1 (800) Intellinex | 🏢 123 Tech Plaza, Silicon Valley, CA. Or fill out our contact form and we'll respond within 2 hours!",
    pricing: "We offer flexible pricing models including monthly subscriptions, project-based, and enterprise contracts. Contact our sales team for a custom quote tailored to your needs and budget.",
    support: "We provide 24/7 support through phone, email, chat, and our dedicated client portal. Our average response time is under 15 minutes for critical issues."
  },

  init() {
    const btn = document.getElementById('chat-toggle');
    const panel = document.getElementById('chat-panel');
    const closeBtn = document.getElementById('chat-close');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');

    if (!btn || !panel) return;

    btn.addEventListener('click', () => this.toggle());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });
    }

    document.querySelectorAll('.quick-reply').forEach(btn => {
      btn.addEventListener('click', () => {
        const msg = btn.textContent;
        this.addMessage(msg, 'user');
        setTimeout(() => this.generateResponse(msg), 600);
      });
    });

    // Show welcome after 3s
    setTimeout(() => {
      const badge = document.querySelector('.chat-badge');
      if (badge) badge.style.display = 'flex';
    }, 3000);
  },

  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  open() {
    this.isOpen = true;
    const panel = document.getElementById('chat-panel');
    if (panel) panel.classList.add('open');
    const badge = document.querySelector('.chat-badge');
    if (badge) badge.style.display = 'none';
  },

  close() {
    this.isOpen = false;
    const panel = document.getElementById('chat-panel');
    if (panel) panel.classList.remove('open');
  },

  addMessage(text, sender) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;
    msg.innerHTML = `
      <div class="chat-msg-avatar ${sender === 'bot' ? 'bot' : 'user-av'}">
        ${sender === 'bot' ? '🤖' : '👤'}
      </div>
      <div class="chat-bubble ${sender}">${text}</div>
    `;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  },

  addTyping() {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot';
    typing.id = 'typing-indicator';
    typing.innerHTML = `
      <div class="chat-msg-avatar bot">🤖</div>
      <div class="chat-bubble bot" style="display:flex;gap:4px;align-items:center">
        <span style="width:7px;height:7px;background:var(--cyan);border-radius:50%;animation:pulse 1s infinite;"></span>
        <span style="width:7px;height:7px;background:var(--cyan);border-radius:50%;animation:pulse 1s 0.2s infinite;"></span>
        <span style="width:7px;height:7px;background:var(--cyan);border-radius:50%;animation:pulse 1s 0.4s infinite;"></span>
      </div>
    `;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
  },

  removeTyping() {
    const t = document.getElementById('typing-indicator');
    if (t) t.remove();
  },

  sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    this.addMessage(text, 'user');
    input.value = '';
    this.addTyping();
    setTimeout(() => {
      this.removeTyping();
      this.generateResponse(text);
    }, 1000 + Math.random() * 500);
  },

  generateResponse(text) {
    const lower = text.toLowerCase();
    let response = this.responses.default;
    if (lower.includes('managed') || lower.includes('msp')) response = this.responses.managed;
    else if (lower.includes('cloud') || lower.includes('aws') || lower.includes('azure')) response = this.responses.cloud;
    else if (lower.includes('ai') || lower.includes('artificial') || lower.includes('machine')) response = this.responses.ai;
    else if (lower.includes('security') || lower.includes('cyber') || lower.includes('hack')) response = this.responses.security;
    else if (lower.includes('hardware') || lower.includes('server') || lower.includes('laptop')) response = this.responses.hardware;
    else if (lower.includes('software') || lower.includes('develop') || lower.includes('app')) response = this.responses.software;
    else if (lower.includes('contact') || lower.includes('reach') || lower.includes('phone') || lower.includes('email')) response = this.responses.contact;
    else if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing')) response = this.responses.pricing;
    else if (lower.includes('support') || lower.includes('help') || lower.includes('issue')) response = this.responses.support;
    this.addMessage(response, 'bot');
  }
};

// ---- SCROLL TO TOP ----
const ScrollTop = {
  init() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// ---- CONTACT FORM ----
const ContactForm = {
  init() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
        form.reset();
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      }, 1500);
    });
  }
};

// ---- HERO CHART ANIMATION ----
const HeroChart = {
  init() {
    const bars = document.querySelectorAll('.chart-bar');
    const heights = [60, 80, 45, 90, 70, 85, 55, 75, 95, 65, 88, 72];
    bars.forEach((bar, i) => {
      bar.style.height = heights[i % heights.length] + '%';
      bar.style.animationDelay = (i * 0.1) + 's';
    });
  }
};

// ---- SMOOTH HOVER TILT ----
const CardTilt = {
  init() {
    document.querySelectorAll('.card-tilt').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => card.style.transition = '', 500);
      });
    });
  }
};

// ---- TESTIMONIALS SLIDER ----
const TestimonialSlider = {
  current: 0,
  init() {
    // Simple auto-highlight on mobile
    const cards = document.querySelectorAll('.testimonial-card');
    if (!cards.length || window.innerWidth > 768) return;
  }
};

// ---- NOTIFICATION TOAST ----
const Toast = {
  show(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
      background: ${type === 'success' ? '#10B981' : '#EF4444'};
      color: white; padding: 14px 24px; border-radius: 12px;
      font-size: 0.875rem; font-weight: 600; z-index: 9999;
      box-shadow: 0 8px 30px rgba(0,0,0,0.2);
      animation: fadeInUp 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
};

// ---- PAGE TRANSITION ----
const PageTransition = {
  init() {
    document.querySelectorAll('a[href$=".html"], a[href="index.html"], a[href="./"]').forEach(link => {
      if (link.hostname === window.location.hostname && !link.getAttribute('target')) {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href && !href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('tel')) {
            e.preventDefault();
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.25s ease';
            setTimeout(() => window.location.href = href, 250);
          }
        });
      }
    });
  }
};

// ---- INIT ALL ----
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Navbar.init();
  ScrollReveal.init();
  CounterAnimation.init();
  ProgressBars.init();
  FAQ.init();
  ChatWidget.init();
  ScrollTop.init();
  ContactForm.init();
  HeroChart.init();
  CardTilt.init();
  PageTransition.init();

  // Fade in on load
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

  // Attach theme toggle
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => ThemeManager.toggle());
  });
});
