/* 
* Ceylon Stay - Main JavaScript
*/

$(document).ready(function () {
    console.log("Ceylon Stay Frontend Loaded");

    // Initialize Tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Theme Management
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const html = document.documentElement;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;
    const mobileIcon = mobileThemeToggle ? mobileThemeToggle.querySelector('i') : null;

    // Check Local Storage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        html.setAttribute('data-theme', currentTheme);
        updateIcons(currentTheme);
    }

    function updateIcons(theme) {
        if (theme === 'dark') {
            if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
            if (mobileIcon) { mobileIcon.classList.remove('fa-moon'); mobileIcon.classList.add('fa-sun'); mobileThemeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode'; }
        } else {
            if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
            if (mobileIcon) { mobileIcon.classList.remove('fa-sun'); mobileIcon.classList.add('fa-moon'); mobileThemeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode'; }
        }
    }

    function toggleTheme() {
        let theme = html.getAttribute('data-theme');
        if (theme === 'dark') {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            updateIcons('light');
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateIcons('dark');
        }
    }

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);


    // Navbar Scroll Effect
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('shadow-sm');
        } else {
            $('.navbar').removeClass('shadow-sm');
        }
    });

    // Simple Filter Interaction (Mock)
    $('form').on('submit', function (e) {
        // Prevent actual submission for demo purposes unless it's login/register
        if (!$(this).closest('.card-body').length && !$(this).closest('.hero-search-box').length) {
            // Let login/register forms submit normally (or handle via AJAX in real app)
            // Let search forms submit normally
            return;
        }

        if ($(this).closest('.card-body').find('.card-title').text().includes('Filters')) {
            e.preventDefault();
            const btn = $(this).find('button[type="submit"]');
            const originalText = btn.text();

            btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Applying...');

            setTimeout(function () {
                btn.text(originalText);
                alert('Filters applied! (This is a frontend demo)');
            }, 1000);
        }
    });

    // Login/Register Form Demo
    $('form').on('submit', function (e) {
        const isAuthForm = $(this).closest('.card').length > 0 &&
            ($(this).find('input[type="email"]').length > 0 ||
                $(this).find('input[type="password"]').length > 0);

        if (isAuthForm) {
            e.preventDefault();
            const btn = $(this).find('button[type="submit"]');
            const originalText = btn.text();

            btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Processing...');

            setTimeout(function () {
                btn.text(originalText);
                // Redirect to dashboard or home based on context (Mock)
                if (window.location.href.includes('login.html')) {
                    window.location.href = '../index.html';
                } else if (window.location.href.includes('register.html')) {
                    window.location.href = 'login.html';
                }
            }, 1500);
        }
    });

    // Scroll Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .zoom-in');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Language Selector (Mock)
    window.changeLang = function (lang) {
        const langMap = {
            'en': 'English',
            'si': 'Sinhala',
            'ta': 'Tamil'
        };
        const currentLangSpan = document.getElementById('currentLang');
        if (currentLangSpan) currentLangSpan.innerText = langMap[lang];
        // Here you would implement actual translation logic or redirection
        console.log("Language changed to: " + langMap[lang]);
    };
});
