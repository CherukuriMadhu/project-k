document.addEventListener('DOMContentLoaded', () => {
    // --- State & Navigation ---
    let currentSectionIndex = 1;
    const totalSections = 12;

    const showSection = (index) => {
        // Hide all sections
        for (let i = 1; i <= totalSections; i++) {
            const section = document.getElementById(`s${i}-${getSectionName(i)}`);
            if (section) {
                section.classList.remove('active');
                section.classList.add('hidden');
            }
        }
        // Show target section
        const targetSection = document.getElementById(`s${index}-${getSectionName(index)}`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            // Slight delay for smooth CSS transition
            setTimeout(() => {
                targetSection.classList.add('active');
            }, 50);
        }
        currentSectionIndex = index;
        
        // Trigger specific animations based on section
        triggerSectionAnimations(index);
    };

    const getSectionName = (index) => {
        const names = {
            1: 'landing', 2: 'gift', 3: 'catch', 4: 'memory', 5: 'quiz', 6: 'scratch',
            7: 'meter', 8: 'timeline', 9: 'balloons', 10: 'gallery', 11: 'cake', 12: 'finale'
        };
        return names[index];
    };

    const nextSection = () => {
        if (currentSectionIndex < totalSections) {
            showSection(currentSectionIndex + 1);
        }
    };

    // Global next button listeners
    document.querySelectorAll('button[id^="btn-next-"]').forEach(btn => {
        btn.addEventListener('click', nextSection);
    });

    // --- Audio Control ---
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');
    let isMusicPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicBtn.textContent = '🎵 Play Music';
        } else {
            // Error handling for missing audio file since it's a placeholder
            bgMusic.play().catch(e => console.log("Audio play failed, likely missing source:", e));
            musicBtn.textContent = '⏸️ Pause Music';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // --- Section 1: Landing ---
    document.getElementById('btn-start').addEventListener('click', () => {
        // Start music automatically if user interacts (browsers require interaction)
        if (!isMusicPlaying) {
            bgMusic.play().catch(e => console.log("Audio play failed"));
            musicBtn.textContent = '⏸️ Pause Music';
            isMusicPlaying = true;
        }
        nextSection();
    });

    // --- Section 2: Secret Gift Box ---
    const giftBox = document.getElementById('gift-box');
    const giftMessage = document.getElementById('gift-message');
    const btnNext2 = document.getElementById('btn-next-2');

    giftBox.addEventListener('click', () => {
        giftBox.style.animation = 'none'; // Stop wiggle
        giftBox.style.transform = 'scale(1.2) rotate(5deg)';
        setTimeout(() => {
            giftBox.style.transform = 'scale(0)'; // Disappear
            setTimeout(() => {
                giftBox.classList.add('hidden');
                giftMessage.classList.remove('hidden');
                btnNext2.classList.remove('hidden');
                // Trigger particles
                if(window.Effects) window.Effects.sparkleBurst();
            }, 300);
        }, 500);
    });

    // Helper for timeline animation (Section 8)
    const triggerSectionAnimations = (index) => {
        if (index === 8) {
            const items = document.querySelectorAll('.time-item');
            items.forEach((item, i) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, i * 1000);
            });
            setTimeout(() => {
                document.getElementById('btn-next-8').classList.remove('hidden');
            }, items.length * 1000 + 500);
        }
    };
});
