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

let seasonalInterval;
let hasPlayedEffect = false;

const logo = document.querySelector('.logo');

function getCurrentSeason() {
    const now = new Date();
    const month = now.getMonth(); // Jan=0, March=2, May=4, Nov=10, Dec=11

    if (month >= 2 && month <= 4) return 'spring'; // March to May
    if (month === 11 || month === 0 || (month === 10 && now.getDate() >= 25)) return 'winter'; // Nov 25 - Jan
    return 'default';
}

function triggerEffect() {
    if (hasPlayedEffect) return;
    
    const season = getCurrentSeason();
    //season = "spring"; // For testing
    
    if (season === 'winter') {
        seasonalInterval = setInterval(createSnowflake, 50);
    } else if (season === 'spring') {
        // Create a mix: Petals spawn faster, Flowers spawn slower
        seasonalInterval = setInterval(() => {
            createPetal();
            if (Math.random() > 0.7) createFlower(); // 30% chance to spawn a full flower
        }, 150); 
    }
}

function stopEffect() {
    if (seasonalInterval) {
        clearInterval(seasonalInterval);
        hasPlayedEffect = true; // One-time effect per reload
    }
}

// Update Listeners
if ('ontouchstart' in window) {
    logo.addEventListener('click', () => {
        triggerEffect();
        setTimeout(stopEffect, 3000);
    });
} else {
    logo.addEventListener('mouseenter', triggerEffect);
    logo.addEventListener('mouseleave', stopEffect);
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

function createPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    // Randomize for a non-rigid look
    const size = Math.random() * 6 + 4; // Smaller size (4px to 10px)
    const left = Math.random() * window.innerWidth + 'px';
    const duration = Math.random() * 5 + 5 + 's'; // Slower fall
    const opacity = Math.random() * 0.6 + 0.4;

    petal.style.width = size + 'px';
    petal.style.height = (size * 1.5) + 'px'; // Longer than wide
    petal.style.left = left;
    petal.style.opacity = opacity;
    petal.style.animationDuration = duration + ', ' + (Math.random() * 2 + 2) + 's';

    document.body.appendChild(petal);
    setTimeout(() => { petal.remove(); }, parseFloat(duration) * 1000);
}

function createFlower() {
    const flower = document.createElement('div');
    flower.classList.add('sakura-flower');
    flower.innerHTML = '🌸'; // Sakura Emoji
    
    const left = Math.random() * window.innerWidth + 'px';
    const duration = Math.random() * 5 + 6 + 's';

    flower.style.left = left;
    flower.style.fontSize = Math.random() * 10 + 10 + 'px'; // Random flower size
    flower.style.animationDuration = duration + ', ' + (Math.random() * 2 + 3) + 's';

    document.body.appendChild(flower);
    setTimeout(() => { flower.remove(); }, parseFloat(duration) * 1000);
}