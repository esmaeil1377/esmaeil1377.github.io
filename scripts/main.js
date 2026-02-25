(function() {
  "use strict";

  // ============================
  // Page Loader
  // ============================
  window.addEventListener('load', function() {
    var loader = document.getElementById('page-loader');
    if (loader) {
      loader.classList.add('loaded');
      setTimeout(function() { loader.style.display = 'none'; }, 500);
    }
    on_page_load();
  });

  // ============================
  // AOS Initialization
  // ============================
  function on_page_load() {
    AOS.init({
      anchorPlacement: 'top-left',
      duration: 600,
      easing: "ease-out",
      once: true,
      mirror: false,
      disable: 'mobile'
    });
  }

  // ============================
  // Scroll Progress Bar
  // ============================
  var progressBar = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = scrollPercent + '%';
    }
  }

  // ============================
  // Navbar + Scroll to Top
  // ============================
  var navbar = document.getElementById('header-nav');
  var body = document.body;
  var scrollTopEl = document.getElementById('scrolltop');

  function handleScroll() {
    // Navbar fixed on scroll
    if (window.scrollY > 0) {
      navbar.classList.add('fixed-top', 'shadow-sm');
      body.style.paddingTop = navbar.offsetHeight + 'px';
    } else {
      navbar.classList.remove('fixed-top', 'shadow-sm');
      body.style.paddingTop = '0px';
    }

    // Scroll to top button with smooth reveal
    if (window.scrollY > 300) {
      scrollTopEl.classList.add('visible');
    } else {
      scrollTopEl.classList.remove('visible');
    }

    // Update scroll progress
    updateScrollProgress();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ============================
  // Scroll-Spy (Active Nav Highlighting)
  // ============================
  var sections = document.querySelectorAll('.section[id]');
  var navItems = document.querySelectorAll('#nav-links .nav-item');

  var observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  var sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navItems.forEach(function(item) {
          item.classList.remove('active');
          var link = item.querySelector('.nav-link');
          if (link && link.getAttribute('href') === '#' + id) {
            item.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(function(section) {
    sectionObserver.observe(section);
  });

  // ============================
  // Typing Animation
  // ============================
  var typedElement = document.getElementById('typed-text');
  var phrases = [
    'Frontend Engineer',
    'React Developer',
    'UI Enthusiast',
    'Problem Solver'
  ];
  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var typeSpeed = 80;

  function typeEffect() {
    if (!typedElement) return;

    var current = phrases[phraseIndex];

    if (isDeleting) {
      typedElement.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedElement.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    var delay = typeSpeed;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400; // Pause before next word
    } else if (isDeleting) {
      delay = 40; // Faster deletion
    }

    setTimeout(typeEffect, delay);
  }

  // Start typing after a short delay
  setTimeout(typeEffect, 1000);

  // ============================
  // Button Ripple Effect
  // ============================
  document.querySelectorAll('.btn-primary, .btn-outline-secondary').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(function() { ripple.remove(); }, 600);
    });
  });

  // ============================
  // Magnetic Hover on Social Icons
  // ============================
  document.querySelectorAll('.social-nav .nav-link').forEach(function(link) {
    link.addEventListener('mousemove', function(e) {
      var rect = link.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      link.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
    });

    link.addEventListener('mouseleave', function() {
      link.style.transform = 'translate(0, 0)';
    });
  });

  // ============================
  // Theme Toggle with Animation
  // ============================
  var themeToggle = document.getElementById('theme-toggle');
  var htmlEl = document.documentElement;

  function getPreferredTheme() {
    var saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlEl.setAttribute('data-theme', 'dark');
    } else {
      htmlEl.removeAttribute('data-theme');
    }
  }

  // Apply theme on load
  applyTheme(getPreferredTheme());

  // Toggle on click with rotation animation
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      var current = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      var next = current === 'dark' ? 'light' : 'dark';

      // Trigger rotation animation
      themeToggle.classList.add('animate');
      setTimeout(function() { themeToggle.classList.remove('animate'); }, 500);

      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  }

  // Listen for OS theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ============================
  // Contact Form Validation
  // ============================
  var contactForm = document.getElementById('contact-form');

  var validators = {
    name: function(value) {
      if (!value.trim()) return 'Please enter your name.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
    email: function(value) {
      if (!value.trim()) return 'Please enter your email.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address.';
      return '';
    },
    message: function(value) {
      if (!value.trim()) return 'Please enter a message.';
      if (value.trim().length < 10) return 'Message must be at least 10 characters.';
      return '';
    }
  };

  function validateField(field) {
    var name = field.name === '_replyto' ? 'email' : field.name;
    var validator = validators[name];
    if (!validator) return true;

    var errorMsg = validator(field.value);
    var errorEl = document.getElementById(name + '-error');

    if (errorMsg) {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      if (errorEl) errorEl.textContent = errorMsg;
      return false;
    } else {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  if (contactForm) {
    // Validate on blur
    contactForm.querySelectorAll('.form-control').forEach(function(field) {
      field.addEventListener('blur', function() {
        validateField(field);
      });

      // Clear invalid state on input
      field.addEventListener('input', function() {
        if (field.classList.contains('is-invalid')) {
          validateField(field);
        }
      });
    });

    // Form submission with validation
    contactForm.addEventListener('submit', function(e) {
      var fields = contactForm.querySelectorAll('.form-control');
      var allValid = true;

      fields.forEach(function(field) {
        if (!validateField(field)) {
          allValid = false;
        }
      });

      if (!allValid) {
        e.preventDefault();
        return;
      }

      // If using Formspree, handle with fetch for toast feedback
      e.preventDefault();
      var formData = new FormData(contactForm);
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function(response) {
        if (response.ok) {
          showToast('Message sent successfully!', 'success');
          contactForm.reset();
          contactForm.querySelectorAll('.form-control').forEach(function(f) {
            f.classList.remove('is-valid', 'is-invalid');
          });
        } else {
          showToast('Something went wrong. Please try again.', 'error');
        }
      }).catch(function() {
        showToast('Network error. Please try again.', 'error');
      }).finally(function() {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  }

  // ============================
  // Toast Notification
  // ============================
  function showToast(message, type) {
    var toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = 'toast-notification show';
    if (type) toast.classList.add('toast-' + type);

    setTimeout(function() {
      toast.classList.remove('show');
    }, 3500);
  }

  // ============================
  // Masonry Grid
  // ============================
  var elem = document.querySelector('.grid');
  if (elem) {
    imagesLoaded(elem, function() {
      new Masonry(elem, {
        itemSelector: '.grid-item',
        percentPosition: true,
        horizontalOrder: true
      });
    });
  }

  // ============================
  // Big Picture Popup for images and videos
  // ============================
  document.querySelectorAll("[data-bigpicture]").forEach(function(e) {
    e.addEventListener("click", function(t) {
      t.preventDefault();
      var data = JSON.parse(e.dataset.bigpicture);
      BigPicture({
        el: t.target,
        ...data
      });
    });
  });

  // ============================
  // Big Picture Popup for Photo Gallery
  // ============================
  document.querySelectorAll(".bp-gallery a").forEach(function(e) {
    var caption = e.querySelector('figcaption');
    var img = e.querySelector('img');
    img.dataset.caption = '<a class="link-light" target="_blank" href="' + e.href + '">' + caption.innerHTML + '</a>';
    e.addEventListener("click", function(t) {
      t.preventDefault();
      BigPicture({
        el: t.target,
        gallery: '.bp-gallery',
      });
    });
  });

})();
