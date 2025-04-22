document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMenuBtn = document.getElementById('closeMenuBtn');

    function openMenu() {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileMenuToggle.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);
    mobileMenuOverlay.addEventListener('click', closeMenu);

    // Close menu when clicking on links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Theme Toggle
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn, .mobile-theme-toggle');
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Hero Text Animation
    const changingText = document.querySelector('.changing-text');
    if (changingText) {
        const words = JSON.parse(changingText.getAttribute('data-words'));
        let currentWordIndex = 0;
        let isDeleting = false;
        let text = '';
        let typingSpeed = 150;
        let pauseBetweenWords = 2000;
        let pauseBetweenCycles = 500;

        function type() {
            const currentWord = words[currentWordIndex];
            
            if (isDeleting) {
                text = currentWord.substring(0, text.length - 1);
            } else {
                text = currentWord.substring(0, text.length + 1);
            }

            changingText.textContent = text;

            if (!isDeleting && text === currentWord) {
                isDeleting = true;
                typingSpeed = pauseBetweenWords;
            } else if (isDeleting && text === '') {
                isDeleting = false;
                currentWordIndex = (currentWordIndex + 1) % words.length;
                typingSpeed = pauseBetweenCycles;
            } else {
                typingSpeed = isDeleting ? 50 : 150;
            }

            setTimeout(type, typingSpeed);
        }

        setTimeout(type, 1000);
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            const formMessage = document.getElementById('formMessage');
            formMessage.style.display = 'none';

            // Collect form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Send email using mailto (fallback)
            const mailtoLink = `mailto:abrahamefe307@gmail.com?subject=${encodeURIComponent(formObject.subject)}&body=${encodeURIComponent(
                `Name: ${formObject.name}\nEmail: ${formObject.email}\n\nMessage: ${formObject.message}`
            )}`;

            // Try to open default email client
            window.location.href = mailtoLink;

            // Show success message (even though we can't confirm actual sending)
            formMessage.className = 'form-submission-message success';
            formMessage.innerHTML = '<i class="fas fa-check-circle"></i> Opening your email client to send message...';
            formMessage.style.display = 'block';

            // Reset form
            contactForm.reset();
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            // Remove message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        });
    }

    // Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav a');

    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

});