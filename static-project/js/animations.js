/**
 * COS 106 - Student Portfolio Animation Engine
 * Uses GreenSock (GSAP) to orchestrate staggered page-entry reveals.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is loaded from the CDN script
    if (typeof gsap === 'undefined') {
        console.warn("GSAP is not defined. Animations will fall back to standard static CSS layout rendering.");
        return;
    }

    // Initialize clean GSAP timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Reveal Header Navigation & Brand
    if (document.querySelector('.main-header')) {
        tl.fromTo('.main-header', 
            { y: -60, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1 }
        );
    }

    // 2. Reveal Glass Panel Structure
    if (document.querySelector('.glass-panel')) {
        tl.fromTo('.glass-panel',
            { scale: 0.97, opacity: 0, y: 30 },
            { scale: 1, opacity: 1, y: 0, duration: 0.8 },
            "-=0.6" // Slight overlap
        );
    }

    // 3. Staggered Entrance for Homepage Hero Prose
    if (document.querySelector('.hero-prose-column')) {
        tl.fromTo('.hero-glass-card',
            { scale: 0.96, opacity: 0, y: 30 },
            { scale: 1, opacity: 1, y: 0, duration: 0.8 },
            "-=0.6"
        );
        tl.fromTo('.welcome-badge, .hero-title, .hero-text, .cta-buttons a',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
            "-=0.4"
        );
    }

    // 4. Staggered Entrance for Avatar Visual
    if (document.querySelector('.lens-reveal-container')) {
        tl.fromTo('.lens-reveal-container',
            { opacity: 0, scale: 0.98 },
            { opacity: 1, scale: 1, duration: 1 },
            "-=0.6"
        );
    }

    // 5. Staggered Entrance for Projects CSS Grid Cards
    if (document.querySelectorAll('.project-card').length > 0) {
        tl.fromTo('.project-card',
            { opacity: 0, y: 35, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.15 },
            "-=0.4"
        );
    }

    // 6. Staggered Entrance for Academic History Timeline Table Rows
    if (document.querySelectorAll('.academic-table tbody tr').length > 0) {
        tl.fromTo('.academic-table tbody tr',
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.5, stagger: 0.12 },
            "-=0.3"
        );
    }

    // 7. Reveal Planner Split Columns
    if (document.querySelector('.planner-split-grid')) {
        tl.fromTo('.planner-form-panel, .planner-list-panel',
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 },
            "-=0.5"
        );
    }

    // 8. Staggered Entrance for Contact Form Fields & Footer
    if (document.querySelector('.contact-form-element')) {
        tl.fromTo('.form-group, .contact-form-element .btn, .secure-footer',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
            "-=0.5"
        );
    }

    // 9. Reveal Footer
    if (document.querySelector('.main-footer')) {
        gsap.fromTo('.main-footer',
            { opacity: 0 },
            { opacity: 1, duration: 1.2, delay: 0.5 }
        );
    }

    // 10. Interactive Cursor Spotlight Mask Reveal (Lando Norris Style)
    const lensContainer = document.querySelector('.lens-reveal-container');
    const imgOverlay = document.querySelector('.img-overlay');

    if (lensContainer && imgOverlay) {
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

        const handleRevealMove = (clientX, clientY) => {
            const rect = lensContainer.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            // Maintain a larger, smoother floating high-fidelity reveal lens
            gsap.to(imgOverlay, {
                clipPath: `circle(150px at ${x}px ${y}px)`,
                duration: 0.4,
                ease: 'power3.out',
                overwrite: 'auto'
            });
        };

        const handleReset = () => {
            gsap.to(imgOverlay, {
                clipPath: 'circle(0px at 0px 0px)',
                duration: 0.6,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        };

        if (!isTouchDevice) {
            // Track anywhere across the entire document viewport for immersive immediate feedback
            document.addEventListener('mousemove', (e) => {
                handleRevealMove(e.clientX, e.clientY);
            });

            document.addEventListener('mouseleave', handleReset);
        } else {
            // Smooth mobile touch reveal
            lensContainer.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches[0]) {
                    handleRevealMove(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });

            lensContainer.addEventListener('touchmove', (e) => {
                if (e.touches && e.touches[0]) {
                    handleRevealMove(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });

            lensContainer.addEventListener('touchend', handleReset);
        }
    }
});
