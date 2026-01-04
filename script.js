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
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Adjust for header height
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

const observerOptions = {
    threshold: 0.05, // Trigger very early
    rootMargin: "0px 0px -10% 0px" // Triggers when the section is 10% from the bottom
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