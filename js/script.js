/* =====================================================
   BRAJ PROPERTIES — JavaScript
   Interactions, Chatbot, Auth, Animations
   ===================================================== */

/* ── Navbar Scroll Effect ── */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar-braj');
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }
});

/* ── Scroll Fade-In Animation ── */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in-up');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* ── Price Range Slider ── */
function initPriceSlider() {
  const slider = document.getElementById('priceSlider');
  const display = document.getElementById('priceDisplay');
  if (slider && display) {
    slider.addEventListener('input', function () {
      const val = parseInt(this.value).toLocaleString('en-IN');
      display.textContent = '₹ ' + val;
    });
  }
}

/* ── Favourite Toggle ── */
function initFavourites() {
  document.querySelectorAll('.prop-fav').forEach(btn => {
    btn.addEventListener('click', function () {
      this.classList.toggle('active');
      this.textContent = this.classList.contains('active') ? '❤️' : '🤍';
    });
  });
}

/* ── Chatbot ── */
const CHAT_RESPONSES = {
  'pricing':   '💰 Our properties start from ₹12 Lakh for plots and ₹25 Lakh for flats in Mathura & Vrindavan. Premium villas are available from ₹85 Lakh onwards.',
  'booking':   '📅 You can book a site visit by calling us at +91 9876543210 or clicking the "Schedule Visit" button. We offer free guided tours every weekend!',
  'location':  '📍 We have properties across Mathura, Vrindavan, Barsana, Govardhan, and Nandgaon — all in the sacred Braj Bhumi region of Uttar Pradesh.',
  'default':   '🙏 Thank you for your query! Our expert will get back to you shortly. You can also reach us on WhatsApp for instant support.'
};

function initChatbot() {
  const btn    = document.getElementById('chatFloatBtn');
  const win    = document.getElementById('chatWindow');
  const close  = document.getElementById('chatClose');
  const input  = document.getElementById('chatInput');
  const sendBtn= document.getElementById('chatSend');
  const msgs   = document.getElementById('chatMessages');
  const qBtns  = document.querySelectorAll('.chat-quick-btn');

  if (!btn) return;

  btn.addEventListener('click', () => {
  win.classList.add('open');
  btn.classList.add('hidden');
});

function closeChat() {
  win.classList.remove('open');
  btn.classList.remove('hidden');
}

close?.addEventListener('click', closeChat);

// Bahar click karne par band ho
document.addEventListener('click', (e) => {
  if (win.classList.contains('open') && !win.contains(e.target) && !btn.contains(e.target)) {
    closeChat();
  }
});

  function addMsg(text, type) {
    const d = document.createElement('div');
    d.className = 'chat-msg ' + type;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function respond(key) {
    setTimeout(() => addMsg(CHAT_RESPONSES[key] || CHAT_RESPONSES['default'], 'bot'), 600);
  }

  qBtns.forEach(b => {
    b.addEventListener('click', function () {
      const key = this.dataset.key;
      addMsg(this.textContent, 'user');
      respond(key);
    });
  });

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, 'user');
    input.value = '';
    const lower = text.toLowerCase();
    let key = 'default';
    if (lower.includes('pric') || lower.includes('cost') || lower.includes('rate')) key = 'pricing';
    else if (lower.includes('book') || lower.includes('visit') || lower.includes('schedule')) key = 'booking';
    else if (lower.includes('locat') || lower.includes('where') || lower.includes('mathura') || lower.includes('vrindavan')) key = 'location';
    respond(key);
  }

  sendBtn?.addEventListener('click', sendMessage);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
}

/* ── Auth Modal ── */
function initAuth() {
  const loginBtn    = document.getElementById('loginBtn');
  const signupBtn   = document.getElementById('signupBtn');
  const toggleBtns  = document.querySelectorAll('.auth-toggle-btn');
  const loginForm   = document.getElementById('loginForm');
  const signupForm  = document.getElementById('signupForm');
  const submitLogin = document.getElementById('submitLogin');
  const submitSignup= document.getElementById('submitSignup');
  const userGreet   = document.getElementById('userGreet');
  const logoutBtn   = document.getElementById('logoutBtn');

  // Check stored session
  const storedUser = localStorage.getItem('brajUser');
  if (storedUser) showUser(storedUser);

  function showUser(name) {
    document.querySelectorAll('.auth-nav-btns').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.user-nav').forEach(el => el.style.display = 'flex');
    document.querySelectorAll('.user-name').forEach(el => el.textContent = name);
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      toggleBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const mode = this.dataset.mode;
      if (loginForm)  loginForm.style.display  = mode === 'login'  ? 'block' : 'none';
      if (signupForm) signupForm.style.display = mode === 'signup' ? 'block' : 'none';
    });
  });

  submitLogin?.addEventListener('click', function () {
    const email = document.getElementById('loginEmail').value;
    if (!email) { alert('Please enter your email.'); return; }
    const name = email.split('@')[0];
    localStorage.setItem('brajUser', name);
    showUser(name);
    const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
    modal?.hide();
  });

  submitSignup?.addEventListener('click', function () {
    const name  = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    if (!name || !email) { alert('Please fill all fields.'); return; }
    localStorage.setItem('brajUser', name);
    showUser(name);
    const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
    modal?.hide();
  });

  logoutBtn?.addEventListener('click', function () {
    localStorage.removeItem('brajUser');
    document.querySelectorAll('.auth-nav-btns').forEach(el => el.style.display = 'flex');
    document.querySelectorAll('.user-nav').forEach(el => el.style.display = 'none');
  });
}

/* ── Property Filters (listing page) ── */
function initFilters() {
  const cards = document.querySelectorAll('[data-prop]');
  if (!cards.length) return;

  function applyFilters() {
    const checkedLocations = [...document.querySelectorAll('.filter-location:checked')].map(c => c.value);
    const checkedTypes     = [...document.querySelectorAll('.filter-type:checked')].map(c => c.value);
    const maxPrice         = parseInt(document.getElementById('priceSlider')?.value || 99999999);

    cards.forEach(card => {
      const loc   = card.dataset.location || '';
      const type  = card.dataset.type     || '';
      const price = parseInt(card.dataset.price || 0);
      const locOk  = !checkedLocations.length || checkedLocations.includes(loc);
      const typeOk = !checkedTypes.length    || checkedTypes.includes(type);
      const priceOk = price <= maxPrice;
      card.closest('.prop-col').style.display = (locOk && typeOk && priceOk) ? '' : 'none';
    });

    // Update count
    const visible = [...document.querySelectorAll('.prop-col')].filter(c => c.style.display !== 'none').length;
    const cnt = document.querySelector('.result-count span');
    if (cnt) cnt.textContent = visible;
  }

  document.querySelectorAll('.filter-location, .filter-type').forEach(cb => cb.addEventListener('change', applyFilters));
  document.getElementById('priceSlider')?.addEventListener('input', applyFilters);
  document.getElementById('clearFilters')?.addEventListener('click', () => {
    document.querySelectorAll('.filter-location, .filter-type').forEach(cb => cb.checked = false);
    const ps = document.getElementById('priceSlider');
    if (ps) { ps.value = ps.max; initPriceSlider(); }
    applyFilters();
  });
}

/* ── Thumbnail Gallery (details page) ── */
function initGallery() {
  const mainImg = document.getElementById('mainImg');
  const thumbs  = document.querySelectorAll('.detail-thumb');
  if (!mainImg || !thumbs.length) return;
  thumbs.forEach(t => {
    t.addEventListener('click', function () {
      mainImg.src = this.src;
      thumbs.forEach(th => th.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

/* ── Stat Counter Animation ── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.count);
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          e.target.textContent = current + (e.target.dataset.suffix || '');
          if (current >= target) clearInterval(timer);
        }, 20);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => io.observe(c));
}

/* ── Contact Form ── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('[type=submit]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '✅ Message Sent!';
      btn.style.background = '#22c55e';
      this.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}

/* ── Schedule Visit Form ── */
function initVisitForm() {
  const form = document.getElementById('visitForm');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('🙏 Thank you! Our team will contact you within 24 hours to confirm your site visit.');
    this.reset();
  });
}

/* ── Init All ── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initPriceSlider();
  initFavourites();
  initChatbot();
  initAuth();
  initFilters();
  initGallery();
  initCounters();
  initContactForm();
  initVisitForm();
});


/* ── Hamburger Toggle ── */
function initHamburger() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  // Open/close on button click
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
  });

  // Close when any link clicked
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      toggle.classList.remove('open');
      menu.classList.remove('open');
    }
  });
}

// ── Hamburger Icon Toggle ──
const navToggleBtn = document.getElementById('navToggleBtn');
const hamburgerIcon = document.getElementById('hamburgerIcon');
const navMenu = document.getElementById('navMenu');

if (navToggleBtn && hamburgerIcon && navMenu) {
  navMenu.addEventListener('show.bs.collapse', () => {
    hamburgerIcon.textContent = '✕';
  });
  navMenu.addEventListener('hide.bs.collapse', () => {
    hamburgerIcon.textContent = '☰';
  });
}