/* =========================================================
   script.js – small bits of interactivity for the portfolio
   1. Tell the CSS that JavaScript is running
   2. Mobile menu (open and close)
   3. Fade sections in when they scroll into view
   4. Show which section you are reading in the navigation
   5. Put the current year in the footer
   6. Light/dark mode button (remembers the visitor's choice)
   Smooth scrolling itself is done in CSS (scroll-behavior: smooth).
   ========================================================= */


/* ===== 1. MARK THAT JAVASCRIPT IS ON =====
   Adds the class "js" to <html>. The CSS only hides the fade-in
   sections when this class exists, so the page still works without JS. */
document.documentElement.classList.add('js');


/* ===== 2. MOBILE MENU ===== */
const navToggleButton = document.getElementById('navToggle');
const navLinksList = document.getElementById('navLinks');

// Opens or closes the menu, and updates the button for screen readers
function setMenuOpen(menuShouldBeOpen) {
  if (menuShouldBeOpen) {
    navLinksList.classList.add('open');
    navToggleButton.setAttribute('aria-label', 'Close menu');
  } else {
    navLinksList.classList.remove('open');
    navToggleButton.setAttribute('aria-label', 'Open menu');
  }
  navToggleButton.setAttribute('aria-expanded', menuShouldBeOpen);
}

// When the menu button is tapped, flip between open and closed
navToggleButton.addEventListener('click', function () {
  const menuIsOpen = navLinksList.classList.contains('open');
  setMenuOpen(!menuIsOpen);
});

// Close the menu after a link is tapped, so it doesn't cover the page
const allNavLinks = navLinksList.querySelectorAll('a');

allNavLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    setMenuOpen(false);
  });
});

// Close the menu when the Escape key is pressed (helpful for keyboard users)
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && navLinksList.classList.contains('open')) {
    setMenuOpen(false);
    navToggleButton.focus();
  }
});


/* ===== 3. FADE-IN ON SCROLL =====
   An IntersectionObserver watches elements and tells us when
   they become visible on screen. */
const fadeInSections = document.querySelectorAll('.fade-in');

const sectionObserver = new IntersectionObserver(function (entries, observer) {
  entries.forEach(function (entry) {
    // isIntersecting is true when the section is (partly) on screen
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');   // the CSS fades it in
      observer.unobserve(entry.target);        // only animate once
    }
  });
}, {
  threshold: 0.1   // start when about 10% of the section is visible
});

// Start watching each section
fadeInSections.forEach(function (section) {
  sectionObserver.observe(section);
});


/* ===== 4. CURRENT SECTION IN THE NAVIGATION =====
   A second observer watches the sections that have a nav link.
   When a section reaches the middle of the screen, its nav link gets
   aria-current="true": the CSS highlights it, and screen readers
   announce it as the current item. */
const sectionsWithNavLinks = document.querySelectorAll('#about, #skills, #projects, #contact');

function highlightNavLink(sectionId) {
  allNavLinks.forEach(function (link) {
    if (link.getAttribute('href') === '#' + sectionId) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

const navObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      highlightNavLink(entry.target.id);
    }
  });
}, {
  // Shrinks the "watch area" to a thin line across the middle of the screen,
  // so only one section counts as current at a time
  rootMargin: '-50% 0px -50% 0px'
});

sectionsWithNavLinks.forEach(function (section) {
  navObserver.observe(section);
});

// Back at the hero (the top of the page), no nav link is current
const heroSection = document.getElementById('home');

const heroObserver = new IntersectionObserver(function (entries) {
  if (entries[0].isIntersecting) {
    highlightNavLink('');
  }
}, {
  rootMargin: '-50% 0px -50% 0px'
});

heroObserver.observe(heroSection);


/* ===== 5. FOOTER YEAR =====
   Saves you updating the copyright year by hand every January. */
document.getElementById('currentYear').textContent = new Date().getFullYear();


/* ===== 6. LIGHT/DARK MODE BUTTON =====
   The small script in the <head> of index.html already picked the
   starting theme. This part handles clicks on the button and saves
   the choice so it is remembered next time. */
const themeToggleButton = document.getElementById('themeToggle');

// Applies a theme ("light" or "dark") and updates the button for screen readers
function applyTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  themeToggleButton.setAttribute('aria-pressed', themeName === 'dark');
}

// Make the button match the theme the page started with
applyTheme(document.documentElement.getAttribute('data-theme') || 'light');

themeToggleButton.addEventListener('click', function () {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);

  // Save the choice in the browser. try/catch avoids errors if
  // the browser blocks storage (for example in some private windows).
  try {
    localStorage.setItem('theme', newTheme);
  } catch (error) {
    // Nothing to do: the toggle still works, it just won't be remembered
  }
});
