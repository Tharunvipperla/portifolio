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

const workShowcaseImage = document.getElementById('work-showcase-image');

if (workShowcaseImage) {
    const workShowcaseTitle = document.getElementById('work-showcase-title');
    const workShowcaseDescription = document.getElementById('work-showcase-description');
    const workCounter = document.getElementById('work-counter');
    const workDots = document.getElementById('work-dots');
    const previousWorkButton = document.querySelector('.prev-work');
    const nextWorkButton = document.querySelector('.next-work');
    const workShowcaseCard = document.querySelector('.work-showcase-card');
    const reduceMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

    const workSlides = [
        {
            src: 'assets/Images/Blood_Moon.png',
            alt: 'Blood Moon Unreal Engine 5 environment showcase',
            title: 'Blood Moon',
            description: 'Atmospheric environment still focused on mood, contrast, and a strong night-scene read.'
        },
        {
            src: 'assets/Images/Star_War_scene.png',
            alt: 'Star War Scene Unreal Engine 5 environment showcase',
            title: 'Star War Scene',
            description: 'Cinematic sci-fi composition framed to present scale, lighting intensity, and world detail.'
        },
        {
            src: 'assets/Images/Bamboo_House.png',
            alt: 'Bamboo House Unreal Engine 5 environment showcase',
            title: 'Bamboo House',
            description: 'Architectural environment study balancing structure, foliage, and material presence.'
        },
        {
            src: 'assets/Images/Matrix_Scene.png',
            alt: 'Matrix Scene Unreal Engine 5 environment showcase',
            title: 'Matrix Scene',
            description: 'Stylized environment render with a cleaner sci-fi tone and controlled visual rhythm.'
        },
        {
            src: 'assets/Images/door_tree.png',
            alt: 'Door Tree Unreal Engine 5 environment showcase',
            title: 'Door Tree',
            description: 'A surreal focal-point composition designed to emphasize silhouette, depth, and atmosphere.'
        },
        {
            src: 'assets/Images/Trees.png',
            alt: 'Trees Unreal Engine 5 environment showcase',
            title: 'Trees',
            description: 'Wide environment capture built around foliage density, terrain depth, and natural composition.'
        }
    ];

    let activeWorkIndex = 0;
    let workAutoplayInterval;
    const preloadedWorkImages = new Set();

    function formatWorkIndex(index) {
        return String(index + 1).padStart(2, '0');
    }

    function preloadWorkImage(index) {
        const slide = workSlides[index];

        if (!slide || preloadedWorkImages.has(slide.src)) {
            return;
        }

        const image = new Image();
        image.src = slide.src;
        preloadedWorkImages.add(slide.src);
    }

    function updateWorkDots() {
        workDots.querySelectorAll('.work-dot').forEach((dot, index) => {
            const isActive = index === activeWorkIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    function swapWorkImage(slide) {
        workShowcaseImage.src = slide.src;
        workShowcaseImage.alt = slide.alt;
        requestAnimationFrame(() => {
            workShowcaseImage.classList.remove('is-transitioning');
        });

        preloadWorkImage((activeWorkIndex + 1) % workSlides.length);
        preloadWorkImage((activeWorkIndex + 2) % workSlides.length);
    }

    function renderWorkSlide(index, immediate = false) {
        activeWorkIndex = (index + workSlides.length) % workSlides.length;

        const slide = workSlides[activeWorkIndex];
        workShowcaseTitle.textContent = slide.title;
        workShowcaseDescription.textContent = slide.description;
        workCounter.textContent = `${formatWorkIndex(activeWorkIndex)} / ${String(workSlides.length).padStart(2, '0')}`;
        updateWorkDots();

        if (immediate || workShowcaseImage.getAttribute('src') === slide.src) {
            swapWorkImage(slide);
            return;
        }

        workShowcaseImage.classList.add('is-transitioning');

        const nextImage = new Image();
        nextImage.src = slide.src;

        if (nextImage.complete) {
            swapWorkImage(slide);
            return;
        }

        nextImage.onload = () => swapWorkImage(slide);
        nextImage.onerror = () => swapWorkImage(slide);
    }

    function stopWorkAutoplay() {
        if (workAutoplayInterval) {
            clearInterval(workAutoplayInterval);
            workAutoplayInterval = undefined;
        }
    }

    function startWorkAutoplay() {
        stopWorkAutoplay();

        if (reduceMotionPreference.matches) {
            return;
        }

        workAutoplayInterval = window.setInterval(() => {
            renderWorkSlide(activeWorkIndex + 1);
        }, 5000);
    }

    function restartWorkAutoplay() {
        startWorkAutoplay();
    }

    workSlides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'work-dot';
        dot.setAttribute('aria-label', `Show ${slide.title}`);
        dot.addEventListener('click', () => {
            renderWorkSlide(index);
            restartWorkAutoplay();
        });
        workDots.appendChild(dot);
    });

    previousWorkButton.addEventListener('click', () => {
        renderWorkSlide(activeWorkIndex - 1);
        restartWorkAutoplay();
    });

    nextWorkButton.addEventListener('click', () => {
        renderWorkSlide(activeWorkIndex + 1);
        restartWorkAutoplay();
    });

    workShowcaseCard.addEventListener('mouseenter', stopWorkAutoplay);
    workShowcaseCard.addEventListener('mouseleave', startWorkAutoplay);
    workShowcaseCard.addEventListener('focusin', stopWorkAutoplay);
    workShowcaseCard.addEventListener('focusout', startWorkAutoplay);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopWorkAutoplay();
            return;
        }

        startWorkAutoplay();
    });

    renderWorkSlide(0, true);
    startWorkAutoplay();
}

let seasonalInterval;
let hasPlayedEffect = false;

const logo = document.querySelector('.logo');

function getCurrentSeason() {
    const now = new Date();
    const month = now.getMonth(); // Jan=0, May=4, July=6

    if (month >= 4 && month <= 6) return 'summer'; // May to July
    if (month >= 2 && month <= 3) return 'spring'; // March to April
    if (month >= 8 && month <= 10) return 'autumn'; // Sept to Nov
    if (month === 11 || month === 0 || (month === 10 && now.getDate() >= 25)) return 'winter';
    return 'default';
}

function triggerEffect() {
    if (hasPlayedEffect) return;
    
    const season = getCurrentSeason();
    // season = "autumn"; // Uncomment to test

    if (season === 'winter') {
        seasonalInterval = setInterval(createSnowflake, 50);
    } else if (season === 'spring') {
        seasonalInterval = setInterval(() => {
            createPetal();
            if (Math.random() > 0.7) createFlower();
        }, 150); 
    } else if (season === 'autumn') {
        seasonalInterval = setInterval(createLeaf, 150);
    } else if (season === 'summer') {
        seasonalInterval = setInterval(createDryLeaf, 100);
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

function createLeaf() {
    const leaf = document.createElement('div');
    leaf.classList.add('leaf');
    
    const colors = ['#d35400', '#e67e22', '#c0392b', '#f39c12'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const size = Math.random() * 10 + 10 + 'px';
    const left = Math.random() * window.innerWidth + 'px';
    const duration = Math.random() * 4 + 5 + 's';

    leaf.style.backgroundColor = randomColor;
    leaf.style.width = size;
    leaf.style.height = size;
    leaf.style.left = left;
    leaf.style.animationDuration = duration + ', ' + (Math.random() * 2 + 2) + 's';

    document.body.appendChild(leaf);

    setTimeout(() => {
        leaf.remove();
    }, parseFloat(duration) * 1000);
}

function createDryLeaf() {
    const leaf = document.createElement('div');
    leaf.classList.add('dry-leaf');
    
    // Variety of dry colors
    const colors = ['#63412c', '#8b5a2b', '#a67b5b', '#4e3b31'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const size = Math.random() * 8 + 10; // Numeric value for calculations
    const left = Math.random() * window.innerWidth + 'px';
    const durationValue = Math.random() * 3 + 4; // 4s to 7s

    leaf.style.backgroundColor = randomColor;
    leaf.style.width = size + 'px';
    leaf.style.height = (size * 1.5) + 'px';
    leaf.style.left = left;
    
    // Set the duration directly here to ensure it overrides defaults
    leaf.style.animationDuration = durationValue + 's';

    document.body.appendChild(leaf);

    // Remove the element once it has finished falling
    setTimeout(() => {
        leaf.remove();
    }, durationValue * 1000);
}
