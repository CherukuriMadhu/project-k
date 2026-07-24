document.addEventListener('DOMContentLoaded', () => {

    // --- Mini Game 1: Catch the Hearts ---
    const catchGameArea = document.getElementById('catch-game-area');
    const basket = document.getElementById('basket');
    const catchScoreEl = document.getElementById('catch-score');
    const catchTimeEl = document.getElementById('catch-time');
    const btnNext3 = document.getElementById('btn-next-3');

    let catchScore = 0;
    let catchTime = 30;
    let catchInterval;
    let spawnInterval;
    let isCatchGameActive = false;

    // Start game when section is active
    const observer3 = new MutationObserver(mutations => {
        mutations.forEach(m => {
            if (m.target.classList.contains('active') && !isCatchGameActive) {
                startCatchGame();
            }
        });
    });
    observer3.observe(document.getElementById('s3-catch'), { attributes: true, attributeFilter: ['class'] });

    function startCatchGame() {
        isCatchGameActive = true;
        catchScore = 0;
        catchTime = 30;
        catchScoreEl.innerText = catchScore;
        catchTimeEl.innerText = catchTime;
        btnNext3.classList.add('hidden');

        catchInterval = setInterval(() => {
            catchTime--;
            catchTimeEl.innerText = catchTime;
            if (catchTime <= 0) {
                endCatchGame();
            }
        }, 1000);

        spawnInterval = setInterval(spawnHeart, 800);
    }

    function spawnHeart() {
        if (!isCatchGameActive) return;
        const heart = document.createElement('div');
        heart.classList.add('falling-heart');
        heart.innerText = ['💖', '💕', '💗', '💓'][Math.floor(Math.random() * 4)];
        heart.style.left = Math.random() * (catchGameArea.offsetWidth - 30) + 'px';
        catchGameArea.appendChild(heart);

        let top = -30;
        const fallSpeed = 2 + Math.random() * 3;
        
        const fall = setInterval(() => {
            if (!isCatchGameActive) {
                clearInterval(fall);
                heart.remove();
                return;
            }
            top += fallSpeed;
            heart.style.top = top + 'px';

            // Check collision
            const heartRect = heart.getBoundingClientRect();
            const basketRect = basket.getBoundingClientRect();

            if (
                heartRect.bottom >= basketRect.top &&
                heartRect.top <= basketRect.bottom &&
                heartRect.right >= basketRect.left &&
                heartRect.left <= basketRect.right
            ) {
                catchScore++;
                catchScoreEl.innerText = catchScore;
                clearInterval(fall);
                heart.remove();
                // small pop effect
                basket.style.transform = 'translateX(-50%) scale(1.2)';
                setTimeout(() => basket.style.transform = 'translateX(-50%) scale(1)', 100);
            } else if (top > catchGameArea.offsetHeight) {
                clearInterval(fall);
                heart.remove();
            }
        }, 20);
    }

    function endCatchGame() {
        isCatchGameActive = false;
        clearInterval(catchInterval);
        clearInterval(spawnInterval);
        
        let rank = "Cute";
        if (catchScore > 10) rank = "Beautiful";
        if (catchScore > 20) rank = "Gorgeous";
        if (catchScore >= 30) rank = "Queen of Hearts";

        catchGameArea.innerHTML = `<h3 style="margin-top: 50%; color: var(--primary-color);">Time's Up!</h3><p>You are my ${rank}!</p><p>You caught my heart already, Kutty. 🥰</p>`;
        btnNext3.classList.remove('hidden');
        if(window.Effects) window.Effects.sparkleBurst();
    }

    // Basket dragging (Mouse & Touch)
    let isDragging = false;
    const moveBasket = (e) => {
        if (!isDragging || !isCatchGameActive) return;
        const rect = catchGameArea.getBoundingClientRect();
        let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        let x = clientX - rect.left;
        x = Math.max(20, Math.min(x, rect.width - 20));
        basket.style.left = x + 'px';
    };

    catchGameArea.addEventListener('mousedown', () => isDragging = true);
    catchGameArea.addEventListener('touchstart', () => isDragging = true, {passive: true});
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('mousemove', moveBasket);
    window.addEventListener('touchmove', moveBasket, {passive: true});


    // --- Mini Game 2: Memory Match ---
    const memoryBoard = document.getElementById('memory-board');
    const btnNext4 = document.getElementById('btn-next-4');
    const icons = ['💖', '🧸', '🎂', '🌹', '🍫', '🌙', '⭐', '👑'];
    let cards = [...icons, ...icons];
    let flippedCards = [];
    let matchedCount = 0;
    let isBoardLocked = false;

    // Shuffle
    cards.sort(() => 0.5 - Math.random());

    cards.forEach((icon, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.icon = icon;
        card.dataset.index = index;
        card.innerHTML = `<span class="icon">${icon}</span>`;
        
        card.addEventListener('click', () => {
            if (isBoardLocked || card.classList.contains('flipped') || flippedCards.length === 2) return;
            
            card.classList.add('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                isBoardLocked = true;
                setTimeout(checkMatch, 1000);
            }
        });

        memoryBoard.appendChild(card);
    });

    function checkMatch() {
        const [c1, c2] = flippedCards;
        if (c1.dataset.icon === c2.dataset.icon) {
            matchedCount += 2;
            c1.style.background = 'var(--accent-color)';
            c2.style.background = 'var(--accent-color)';
            if (matchedCount === cards.length) {
                setTimeout(() => {
                    memoryBoard.innerHTML = `<h3 style="color: var(--primary-color); grid-column: span 4;">Your memory is as beautiful as your smile. 🥰</h3>`;
                    btnNext4.classList.remove('hidden');
                    if(window.Effects) window.Effects.sparkleBurst();
                }, 500);
            }
        } else {
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
        }
        flippedCards = [];
        isBoardLocked = false;
    }


    // --- Mini Game 3: Birthday Quiz ---
    const quizContainer = document.getElementById('quiz-container');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const btnNext5 = document.getElementById('btn-next-5');

    const questions = [
        { q: "Which flower is the prettiest?", opts: ["Rose", "Tulip", "Sunflower", "Kutty"], ans: 3, reply: "Obviously, you are! 🌸" },
        { q: "Who deserves the biggest birthday hug?", opts: ["A Teddy Bear", "A Puppy", "A Kitten", "Kutty"], ans: 3, reply: "Coming right up! 🤗" },
        { q: "Which star shines the brightest?", opts: ["Sirius", "Vega", "The Sun", "Kutty's Smile"], ans: 3, reply: "It brightens my whole world. ✨" }
    ];
    let currentQ = 0;

    function loadQuestion() {
        if (currentQ >= questions.length) {
            quizContainer.innerHTML = `<h3 style="color: var(--primary-color);">You scored 100% in being amazing! ❤️</h3>`;
            btnNext5.classList.remove('hidden');
            return;
        }
        const q = questions[currentQ];
        questionText.innerText = q.q;
        optionsContainer.innerHTML = '';
        q.opts.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.classList.add('quiz-option');
            btn.innerText = opt;
            btn.addEventListener('click', () => {
                if (idx === q.ans) {
                    alert(q.reply); // Simple alert for now, can be improved
                    currentQ++;
                    loadQuestion();
                } else {
                    alert("Nope, try again! Hint: Choose the cutest option 😉");
                }
            });
            optionsContainer.appendChild(btn);
        });
    }
    loadQuestion();

    // --- Section 6: Scratch Card ---
    const scratchCanvas = document.getElementById('scratch-canvas');
    if (scratchCanvas) {
        const ctx = scratchCanvas.getContext('2d');
        let isScratching = false;

        // Initialize Canvas
        const initScratch = () => {
            scratchCanvas.width = scratchCanvas.parentElement.offsetWidth;
            scratchCanvas.height = scratchCanvas.parentElement.offsetHeight;
            ctx.fillStyle = '#cccccc'; // Silver scratch cover
            ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
            // Add some text over the cover
            ctx.font = "20px 'Inter'";
            ctx.fillStyle = "#666666";
            ctx.textAlign = "center";
            ctx.fillText("Scratch Here!", scratchCanvas.width/2, scratchCanvas.height/2);
            ctx.globalCompositeOperation = 'destination-out';
        };
        
        // Use ResizeObserver to handle container size changes
        const resizeObserver = new ResizeObserver(() => {
            // Only re-init if not already scratched significantly
            // For simplicity, we just initialize once when the section becomes active
        });
        resizeObserver.observe(scratchCanvas.parentElement);

        const observer6 = new MutationObserver(mutations => {
            mutations.forEach(m => {
                if (m.target.classList.contains('active')) {
                    initScratch();
                }
            });
        });
        observer6.observe(document.getElementById('s6-scratch'), { attributes: true, attributeFilter: ['class'] });

        const scratch = (e) => {
            if (!isScratching) return;
            const rect = scratchCanvas.getBoundingClientRect();
            let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            let clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();

            // Simple check to reveal button (if enough is scratched)
            // Just doing it probabilistically for simplicity without heavy pixel data processing
            if(Math.random() < 0.05) {
               document.getElementById('btn-next-6').classList.remove('hidden');
            }
        };

        scratchCanvas.addEventListener('mousedown', () => isScratching = true);
        scratchCanvas.addEventListener('touchstart', () => isScratching = true, {passive: true});
        window.addEventListener('mouseup', () => isScratching = false);
        window.addEventListener('touchend', () => isScratching = false);
        scratchCanvas.addEventListener('mousemove', scratch);
        scratchCanvas.addEventListener('touchmove', scratch, {passive: true});
    }

    // --- Section 7: Love Meter ---
    const btnCalculate = document.getElementById('btn-calculate');
    const meterResults = document.getElementById('meter-results');
    const btnNext7 = document.getElementById('btn-next-7');
    
    btnCalculate.addEventListener('click', () => {
        btnCalculate.innerText = "Calculating...";
        setTimeout(() => {
            btnCalculate.classList.add('hidden');
            meterResults.classList.remove('hidden');
            
            // Trigger animations
            setTimeout(() => {
                document.querySelector('.fill.happiness').style.width = '100%';
                document.querySelector('.fill.cuteness').style.width = '100%';
                document.querySelector('.fill.smile').style.width = '100%';
                document.querySelector('.fill.magic').style.width = '100%';
            }, 100);

            setTimeout(() => {
                btnNext7.classList.remove('hidden');
            }, 2500);

        }, 1500);
    });

    // --- Section 11: Cake Cutting ---
    const btnLight = document.getElementById('btn-light');
    const btnBlow = document.getElementById('btn-blow');
    const btnCut = document.getElementById('btn-cut');
    const cakeWish = document.getElementById('cake-wish');
    const btnNext11 = document.getElementById('btn-next-11');
    const candles = document.querySelectorAll('.candle');
    const cakeVisual = document.getElementById('cake-visual');

    btnLight.addEventListener('click', () => {
        candles.forEach(c => c.classList.add('lit'));
        btnLight.classList.add('hidden');
        cakeWish.classList.remove('hidden');
        setTimeout(() => {
            btnBlow.classList.remove('hidden');
        }, 1000);
    });

    btnBlow.addEventListener('click', () => {
        candles.forEach(c => {
            c.classList.remove('lit');
            c.classList.add('blown');
        });
        btnBlow.classList.add('hidden');
        cakeWish.classList.add('hidden');
        setTimeout(() => {
            btnCut.classList.remove('hidden');
        }, 1000);
    });

    btnCut.addEventListener('click', () => {
        btnCut.classList.add('hidden');
        // Simple slice animation
        cakeVisual.style.transform = 'scale(1.1)';
        setTimeout(() => {
            cakeVisual.style.transform = 'scale(1)';
            cakeVisual.innerHTML += `<div style="position:absolute; top: 50%; left: 0; width: 100%; height: 5px; background: #fff; transform: rotate(-10deg);"></div>`;
            if(window.Effects) window.Effects.sparkleBurst();
            setTimeout(() => {
                btnNext11.classList.remove('hidden');
            }, 1500);
        }, 300);
    });

});
