// ===== TYPING EFFECT =====
document.addEventListener('DOMContentLoaded', function() {
    const typingText = document.getElementById('typing-text');
    const words = [
        "Full Stack Developer",
        "AI/ML Specialist",
        "Blockchain Developer",
        "Problem Solver",
        "Software Engineer"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isEnd = false;

    function type() {
        const currentWord = words[wordIndex];
        const currentChar = currentWord.substring(0, charIndex);
        
        typingText.textContent = currentChar;
        
        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(type, 100);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(type, 50);
        } else {
            isDeleting = !isDeleting;
            
            if (!isDeleting) {
                wordIndex = (wordIndex + 1) % words.length;
            }
            
            setTimeout(type, 1500);
        }
    }

    setTimeout(type, 1000);

    // ===== NAVBAR SCROLL EFFECT =====
    const nav = document.querySelector('nav');
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
            backToTop.classList.add('active');
        } else {
            nav.classList.remove('scrolled');
            backToTop.classList.remove('active');
        }
    });

    // ===== MOBILE MENU TOGGLE =====
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // ===== CLOSE MOBILE MENU ON LINK CLICK =====
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });

    // ===== ACTIVE LINK ON SCROLL =====
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').substring(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // ===== FORM SUBMISSION =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            console.log('Form submitted:', { name, email, subject, message });
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            
            contactForm.reset();
        });
    }

    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
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

    // ===== ANIMATION ON SCROLL (REVEAL EFFECT) =====
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.tech-card, .project-card, .cert-card, .edu-card, .achievement-card');
        
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const revealTop = reveal.getBoundingClientRect().top;
            const revealPoint = 150;
            
            if (revealTop < windowHeight - revealPoint) {
                reveal.style.opacity = '1';
                reveal.style.transform = 'translateY(0)';
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    
    // Call once on load
    setTimeout(revealOnScroll, 100);

    // ===== EDUCATION CARDS ANIMATION =====
    const eduCards = document.querySelectorAll(".edu-card");
    const eduObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.3 });

    eduCards.forEach(card => {
        eduObserver.observe(card);
    });
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const numParticles = 80;

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.radius = 2.5;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;

        // bounce effect
        if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;
    }

   draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    // Bright neon green
    ctx.fillStyle = "#00ff99";

    // Strong glow
    ctx.shadowBlur = 22;
    ctx.shadowColor = "#00ffcc";

    ctx.fill();

    ctx.shadowBlur = 0;
}
}

// Create particles
for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
}

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {

            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 130) {

                let opacity = 1 - (distance / 130);

                ctx.beginPath();

                // 🔥 Bright neon green lines
                ctx.strokeStyle = `rgba(0, 255, 150, ${opacity * 0.8})`;
                ctx.lineWidth = 1.5;

                // 🔥 Strong glow
                ctx.shadowBlur = 15;
                ctx.shadowColor = "#00ff99";

                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();

                ctx.shadowBlur = 0;
            }
        }
    }
}
// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.move();
        p.draw();
    });

    connectParticles();

    requestAnimationFrame(animate);
}

animate();

// Responsive canvas
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
    // ===== BACK TO TOP BUTTON =====
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== WHOAMI TERMINAL EFFECT =====
    const terminal = document.getElementById("whoami-terminal");
    if (terminal) {
        const lines = [
            'Name: <span class="highlight">Tanmay Jirekar</span>',
            'Role: <span class="highlight">Full Stack Developer, AI/ML Engineer, Blockchain Developer</span>',
            'Location: <span class="highlight">Nagpur, Maharashtra, India</span>',
            'Experience: <span class="highlight">Full Stack Development, AI/ML, Blockchain Systems</span>'
        ];

        let lineIndex = 0;
        let charIndex = 0;
        let currentLine = "";
        let currentP = null;

        function typeLine() {
            if (lineIndex >= lines.length) {
                const cursorLine = document.createElement("p");
                cursorLine.innerHTML = '<span class="command">$ _</span><span class="cursor-blink">|</span>';
                terminal.appendChild(cursorLine);
                return;
            }

            if (!currentP) {
                currentP = document.createElement("p");
                terminal.appendChild(currentP);
            }

            currentLine += lines[lineIndex][charIndex];
            currentP.innerHTML = currentLine + '<span class="cursor-blink">|</span>';
            charIndex++;

            if (charIndex === lines[lineIndex].length) {
                currentP.innerHTML = currentLine;
                currentLine = "";
                charIndex = 0;
                lineIndex++;
                currentP = null;
                setTimeout(typeLine, 500);
            } else {
                setTimeout(typeLine, 25);
            }
        }

        setTimeout(typeLine, 700);
    }

    // ===== PROJECT CARDS STAGGER ANIMATION =====
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = `all 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // ===== ACHIEVEMENT CARDS ANIMATION =====
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        card.style.transition = `all 0.4s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, index * 100);
    });

    // ===== CERT CARDS ANIMATION =====
    const certCards = document.querySelectorAll('.cert-card');
    certCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        card.style.transition = `all 0.4s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        }, index * 100);
    });

    // ===== TECH CARDS VISIBILITY CHECK =====
    const techCards = document.querySelectorAll('.tech-card');
    const techObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.1 });

    techCards.forEach(card => {
        techObserver.observe(card);
    });

    // ===== SKILL PROGRESS BARS ANIMATION =====
    const skillLevels = document.querySelectorAll('.skill-level');
    const skillObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percent = entry.target.getAttribute('data-percent') || '100';
                entry.target.style.width = percent + '%';
            }
        });
    }, { threshold: 0.5 });

    skillLevels.forEach(skill => {
        skillObserver.observe(skill);
    });
});

// ===== PARTICLES BACKGROUND (if particles.js is loaded) =====
window.addEventListener('load', function() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#00ff9d"
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    }
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#00ff9d",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
});

// ===== PARALLAX EFFECT (Optional) =====
window.addEventListener('mousemove', function(e) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-parallax') || 5;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        element.style.transform = `translate(${x}px, ${y}px)`;
    });
});
