import './style.css';

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
}, { passive: true });

// ===== MOBILE MENU =====
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      
      counter.textContent = current.toLocaleString('ru-RU');
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        // Add + suffix for large numbers
        if (target >= 100) {
          counter.textContent = target.toLocaleString('ru-RU') + '+';
        }
      }
    }
    
    requestAnimationFrame(updateCount);
  });
}

// Observe hero stats for counter animation
const heroStats = document.querySelector('.hero__stats');
if (heroStats) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(heroStats);
}

// ===== REVEAL ON SCROLL =====
function initReveal() {
  const revealElements = document.querySelectorAll(
    '.about__card--main, .about__feature, .service-card, .result-card, .review-card, .contact-item, .cta-block'
  );
  
  revealElements.forEach(el => el.classList.add('reveal'));
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  revealElements.forEach(el => observer.observe(el));
}

initReveal();

// ===== REVIEWS CAROUSEL =====
const carousel = document.getElementById('reviews-carousel');
const prevBtn = document.getElementById('prev-review');
const nextBtn = document.getElementById('next-review');
const dotsContainer = document.getElementById('review-dots');

if (carousel && prevBtn && nextBtn && dotsContainer) {
  const cards = carousel.querySelectorAll('.review-card');
  let currentIndex = 0;
  let cardsPerView = window.innerWidth > 768 ? 2 : 1;
  const totalSlides = Math.ceil(cards.length / cardsPerView);
  
  // Create dots
  function createDots() {
    dotsContainer.innerHTML = '';
    const totalDots = Math.ceil(cards.length / cardsPerView);
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }
  
  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 24; // card width + gap
    const offset = currentIndex * cardWidth * cardsPerView;
    carousel.scrollTo({ left: offset, behavior: 'smooth' });
    
    // Update dots
    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }
  
  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
    updateCarousel();
  }
  
  prevBtn.addEventListener('click', () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : totalSlides - 1;
    updateCarousel();
  });
  
  nextBtn.addEventListener('click', () => {
    currentIndex = currentIndex < totalSlides - 1 ? currentIndex + 1 : 0;
    updateCarousel();
  });
  
  // Handle resize
  window.addEventListener('resize', () => {
    cardsPerView = window.innerWidth > 768 ? 2 : 1;
    createDots();
    updateCarousel();
  });
  
  createDots();
  
  // Auto-play carousel
  let autoPlay = setInterval(() => {
    currentIndex = currentIndex < totalSlides - 1 ? currentIndex + 1 : 0;
    updateCarousel();
  }, 5000);
  
  carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
  carousel.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => {
      currentIndex = currentIndex < totalSlides - 1 ? currentIndex + 1 : 0;
      updateCarousel();
    }, 5000);
  });
}

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinksList = document.querySelectorAll('.navbar__link');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navLinksList.forEach(link => {
    link.style.color = '';
    link.style.background = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--clr-primary)';
      link.style.background = 'var(--clr-bg-alt)';
    }
  });
}, { passive: true });

// ===== PARALLAX SHAPES =====
window.addEventListener('mousemove', (e) => {
  const shapes = document.querySelectorAll('.hero__shape');
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  
  shapes.forEach((shape, i) => {
    const speed = (i + 1) * 8;
    shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
}, { passive: true });
