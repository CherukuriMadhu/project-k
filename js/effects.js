document.addEventListener('DOMContentLoaded', () => {

    // --- Background Particles ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedY = Math.random() * -1 - 0.5; // Float upwards
            this.speedX = (Math.random() - 0.5) * 1;
            // Pastel colors: pinks, lavenders, gold
            const colors = ['rgba(255, 182, 193, 0.6)', 'rgba(230, 230, 250, 0.6)', 'rgba(255, 215, 0, 0.4)', 'rgba(255, 255, 255, 0.5)'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y < 0 - this.size) {
                this.y = canvas.height + this.size;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const num = Math.min(window.innerWidth / 10, 100); // Responsive number of particles
        for (let i = 0; i < num; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Export effects for use in other files
    window.Effects = {
        sparkleBurst: () => {
            // A quick burst of extra particles (simplified as generating temporary fast particles)
            for (let i = 0; i < 30; i++) {
                const p = new Particle();
                p.x = canvas.width / 2;
                p.y = canvas.height / 2;
                p.speedY = (Math.random() - 0.5) * 10;
                p.speedX = (Math.random() - 0.5) * 10;
                p.size = Math.random() * 5 + 2;
                particles.push(p);
                // Remove them after a short time to keep array clean
                setTimeout(() => {
                    particles.shift(); 
                }, 2000);
            }
        }
    };


    // --- Section 9: Balloons ---
    const balloonContainer = document.getElementById('balloon-container');
    const balloonMessage = document.getElementById('balloon-message');
    const btnNext9 = document.getElementById('btn-next-9');
    
    const balloonMessages = [
        "You deserve the happiest year ever, my bangaram. ❤️",
        "Never stop smiling, kutty bangaram ummma! 😘",
        "You look prettier when you smile. 😍",
        "Sending you endless love, bangaram! 💌",
        "May all your wishes come true."
    ];
    let poppedCount = 0;

    const observer9 = new MutationObserver(mutations => {
        mutations.forEach(m => {
            if (m.target.classList.contains('active') && balloonContainer.children.length === 0) {
                createBalloons();
            }
        });
    });
    observer9.observe(document.getElementById('s9-balloons'), { attributes: true, attributeFilter: ['class'] });

    function createBalloons() {
        for (let i = 0; i < 5; i++) {
            const b = document.createElement('div');
            b.classList.add('balloon');
            b.innerText = ['🎈', '🎊', '🎉'][Math.floor(Math.random() * 3)];
            b.style.animationDelay = (Math.random() * 2) + 's';
            
            b.addEventListener('click', () => {
                b.style.opacity = '0';
                b.style.transform = 'scale(2)';
                b.style.pointerEvents = 'none';
                
                balloonMessage.innerText = balloonMessages[i];
                window.Effects.sparkleBurst();
                
                poppedCount++;
                if (poppedCount === 5) {
                    setTimeout(() => {
                        btnNext9.classList.remove('hidden');
                    }, 1000);
                }
            });
            balloonContainer.appendChild(b);
        }
    }


    // --- Section 10: Polaroid Gallery (Image Upload) ---
    const imageUpload = document.getElementById('image-upload');
    const polaroidContainer = document.getElementById('polaroid-container');

    imageUpload.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const src = event.target.result;
                    const polaroid = document.createElement('div');
                    polaroid.classList.add('polaroid');
                    
                    // Random tilt
                    const tilt = (Math.random() - 0.5) * 10;
                    polaroid.style.transform = `rotate(${tilt}deg)`;
                    
                    const imgDiv = document.createElement('div');
                    imgDiv.style.width = '100%';
                    imgDiv.style.height = '120px';
                    imgDiv.style.backgroundImage = `url(${src})`;
                    imgDiv.style.backgroundSize = 'cover';
                    imgDiv.style.backgroundPosition = 'center';
                    imgDiv.style.marginBottom = '10px';
                    
                    const p = document.createElement('p');
                    const captions = ["Gorgeous!", "My favourite.", "Wow 😍", "Perfect.", "Kutty ❤️", "Bangaram! ❤️", "Kutty Bangaram ummma! 😘"];
                    p.innerText = captions[Math.floor(Math.random() * captions.length)];
                    
                    polaroid.appendChild(imgDiv);
                    polaroid.appendChild(p);
                    
                    polaroidContainer.insertBefore(polaroid, polaroidContainer.firstChild);
                };
                reader.readAsDataURL(file);
            });
        }
    });

});
