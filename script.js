const articleSpan = document.querySelector('.article');
const professionSpan = document.querySelector('.profession');
const professions = ['Software Developer', 'Game Developer', 'Tech Enthusiast', 'Artist'];
const articles = ['a ', 'a ', 'a ', 'an '];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100; // ms per character

function typeWriter() {
    const currentProfession = professions[wordIndex];
    const currentArticle = articles[wordIndex];
    const currentChar = currentProfession.substring(0, charIndex);

    articleSpan.textContent = currentArticle;
    professionSpan.textContent = currentChar;

    if (!isDeleting && charIndex < currentProfession.length) {
        // Typing
        charIndex++;
        setTimeout(typeWriter, typingSpeed);
    } else if (isDeleting && charIndex > 0) {
        // Deleting
        charIndex--;
        setTimeout(typeWriter, typingSpeed / 2); // Faster when deleting
    } else {
        // Word complete, move to next
        isDeleting = !isDeleting;
        if (!isDeleting) {
            wordIndex = (wordIndex + 1) % professions.length;
        }
        setTimeout(typeWriter, 1000); // Pause before next action
    }
}

// Start the animation
typeWriter();

// Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Update active class
        document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
        this.classList.add('active');

        // Close mobile menu
        document.querySelector('nav').classList.remove('active');
        document.querySelector('.hamburger').classList.remove('active');
    });
});

// Hamburger menu toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('nav').classList.toggle('active');
    document.querySelector('.hamburger').classList.toggle('active');
});

// Close menu on close button click
document.querySelector('.close-btn').addEventListener('click', () => {
    document.querySelector('nav').classList.remove('active');
    document.querySelector('.hamburger').classList.remove('active');
});

// Scroll to top on page load/reload
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    // Remove hash from URL to prevent scrolling to sections on reload
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    }
});

// Update active nav on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let current = '';
    
    // We calculate based on the middle of the viewport
    const scrollPosition = window.scrollY + (window.innerHeight / 3);

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        // Check if the link's href matches the current section ID
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

const observerOptions = {
    threshold: 0.05, // Trigger very early
    rootMargin: "-8% 0px 0px 0px" // Triggers when the section is 10% from the top
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add a tiny random delay so multiple sections don't jump at once
            setTimeout(() => {
                entry.target.classList.add('show-animate');
            }, 50); 
            
            // Once it spawns, it stays part of the page layout
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

let snowInterval;
let hasSnowed = false;

const logo = document.querySelector('.logo');

// Helper function to check if we are in "Snow Season" (Nov 25 - Jan 31)
function isSnowSeason() {
    const now = new Date();
    const month = now.getMonth(); // Jan is 0, Nov is 10, Dec is 11
    const day = now.getDate();

    // Check November (starting from the 25th)
    const isLateNov = (month === 10 && day >= 25);
    // Check December (all month)
    const isDec = (month === 11);
    // Check January (all month)
    const isJan = (month === 0);

    return isLateNov || isDec || isJan;
}

function triggerSnowfall() {
    if (isSnowSeason() && !hasSnowed) {
        snowInterval = setInterval(createSnowflake, 50);
    }
}

function stopSnowfall() {
    if (snowInterval) {
        clearInterval(snowInterval);
        hasSnowed = true;
        console.log("Seasonal snowfall finished.");
    }
}

// Check if device supports touch
if ('ontouchstart' in window) {
    // Mobile: click to start snowfall for 3 seconds
    logo.addEventListener('click', () => {
        triggerSnowfall();
        setTimeout(stopSnowfall, 3000);
    });
} else {
    // Desktop: hover to start, leave to stop
    logo.addEventListener('mouseenter', triggerSnowfall);
    logo.addEventListener('mouseleave', stopSnowfall);
}

function createSnowflake() {
    const flake = document.createElement('div');
    flake.classList.add('snowflake');
    
    const isSmallScreen = window.innerWidth < 768;
    const size = isSmallScreen ? Math.random() * 3 + 1 : Math.random() * 5 + 2;
    const sizePx = size + 'px';
    const left = Math.random() * window.innerWidth + 'px';
    const durationValue = Math.random() * 3 + 2; 
    const initialOpacity = Math.random() * 0.7 + 0.3;

    flake.style.width = sizePx;
    flake.style.height = sizePx;
    flake.style.left = left;
    flake.style.opacity = initialOpacity;
    flake.style.animationDuration = durationValue + 's';

    document.body.appendChild(flake);

    // Fade and remove
    setTimeout(() => {
        flake.remove();
    }, durationValue * 1000);
}