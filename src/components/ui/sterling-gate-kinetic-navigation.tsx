import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

// Register GSAP Plugins safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

const MENU_ITEMS = [
  { label: "DASHBOARD", path: "/dashboard", shape: "1" },
  { label: "ABOUT US", path: "/about", shape: "2" },
  { label: "LEGAL STUFF", path: "/privacy", shape: "3" },
];

export function SterlingGateKineticNavigation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Initial Setup & Hover Effects
  useEffect(() => {
    if (!containerRef.current) return;

    try {
        if (!gsap.parseEase("main")) {
            CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
            gsap.defaults({ ease: "main", duration: 0.7 });
        }
    } catch (e) {
        gsap.defaults({ ease: "power2.out", duration: 0.7 });
    }

    const ctx = gsap.context(() => {
      const menuItems = containerRef.current!.querySelectorAll(".menu-list-item[data-shape]");
      const shapesContainer = containerRef.current!.querySelector(".ambient-background-shapes");
      
      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        const shape = shapesContainer ? shapesContainer.querySelector(`.bg-shape-${shapeIndex}`) : null;
        
        if (!shape) return;
        const shapeEls = shape.querySelectorAll(".shape-element");

        const onEnter = () => {
             if (shapesContainer) {
                 shapesContainer.querySelectorAll(".bg-shape").forEach((s) => s.classList.remove("active"));
             }
             shape.classList.add("active");
             
             gsap.fromTo(shapeEls, 
                { scale: 0.5, opacity: 0, rotation: -10 },
                { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.7)", overwrite: "auto" }
             );
        };
        
        const onLeave = () => {
            gsap.to(shapeEls, {
                scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
                onComplete: () => shape.classList.remove("active"),
                overwrite: "auto"
            });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        
        (item as any)._cleanup = () => {
            item.removeEventListener("mouseenter", onEnter);
            item.removeEventListener("mouseleave", onLeave);
        };
      });
      
    }, containerRef);

    return () => {
        ctx.revert();
        if (containerRef.current) {
            const items = containerRef.current.querySelectorAll(".menu-list-item[data-shape]");
            items.forEach((item: any) => item._cleanup && item._cleanup());
        }
    };
  }, []);

  // Menu Open/Close Animation Effect
  useEffect(() => {
      if (!containerRef.current) return;
      
      const ctx = gsap.context(() => {
        const navWrap = containerRef.current!.querySelector(".nav-overlay-wrapper");
        const menu = containerRef.current!.querySelector(".menu-content");
        const overlay = containerRef.current!.querySelector(".overlay");
        const bgPanels = containerRef.current!.querySelectorAll(".backdrop-layer");
        const menuLinks = containerRef.current!.querySelectorAll(".nav-link");
        const fadeTargets = containerRef.current!.querySelectorAll("[data-menu-fade]");
        
        const menuButton = containerRef.current!.querySelector(".nav-close-btn");
        const menuButtonTexts = menuButton?.querySelectorAll("p");
        const menuButtonIcon = menuButton?.querySelector(".menu-button-icon");

        const tl = gsap.timeline();
        
        if (isMenuOpen) {
            if (navWrap) navWrap.setAttribute("data-nav", "open");
            
            tl.set(navWrap, { display: "block" })
              .set(menu, { xPercent: 0 }, "<")
              .fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
              .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315 }, "<")
              
              .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
              .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
              .fromTo(menuLinks, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35");
              
            if (fadeTargets.length) {
                tl.fromTo(fadeTargets, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04, clearProps: "all" }, "<+=0.2");
            }

        } else {
            if (navWrap) navWrap.setAttribute("data-nav", "closed");

            tl.to(overlay, { autoAlpha: 0 })
              .to(menu, { xPercent: 120 }, "<")
              .to(menuButtonTexts, { yPercent: 0 }, "<")
              .to(menuButtonIcon, { rotate: 0 }, "<")
              .set(navWrap, { display: "none" });
        }

      }, containerRef);
      
      return () => ctx.revert();
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div ref={containerRef} className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
        <div className="site-header-wrapper pointer-events-auto">
          <header className="header bg-transparent">
            <div className="container is--full mx-auto px-4 py-6">
              <nav className="flex items-center justify-between">
                <Link 
                  to="/" 
                  className="text-2xl font-black tracking-widest uppercase"
                  onClick={(e) => {
                    if (window.location.pathname === "/") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                >
                  Aqora<span className="text-accent">.</span>
                </Link>
                <div className="flex items-center gap-6">
                  <button role="button" className="nav-close-btn flex items-center gap-3 border-brutal bg-background px-5 py-2 text-xs font-black uppercase shadow-brutal hover:-translate-y-0.5" onClick={toggleMenu} style={{ pointerEvents: 'auto' }}>
                    <div className="menu-button-text h-4 overflow-hidden relative">
                      <p className="leading-none">Menu</p>
                      <p className="leading-none">Close</p>
                    </div>
                    <div className="icon-wrap">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="menu-button-icon"
                      >
                        <path
                          d="M7.33333 16L7.33333 0L8.66667 0L8.66667 16L7.33333 16Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M16 8.66667L0 8.66667L0 7.33333L16 7.33333L16 8.66667Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </button>
                </div>
              </nav>
            </div>
          </header>
        </div>

      <section className="fullscreen-menu-container pointer-events-auto">
        <div data-nav="closed" className="nav-overlay-wrapper fixed inset-0 hidden">
          <div className="overlay absolute inset-0 bg-background/40 backdrop-blur-sm" onClick={closeMenu}></div>
          <nav className="menu-content absolute top-0 right-0 h-full w-full md:w-[60vw] lg:w-[40vw] flex flex-col">
            <div className="menu-bg absolute inset-0 -z-10 bg-foreground overflow-hidden">
              <div className="backdrop-layer first absolute inset-0 bg-accent translate-x-full"></div>
              <div className="backdrop-layer second absolute inset-0 bg-secondary translate-x-full"></div>
              <div className="backdrop-layer absolute inset-0 bg-foreground translate-x-full"></div>
            </div>

            <div className="menu-content-wrapper flex-1 flex flex-col p-12 overflow-y-auto">
              {/* Close button for mobile */}
              <div className="flex justify-end mb-8 md:hidden">
                <button
                  onClick={closeMenu}
                  className="p-3 border-4 border-background bg-accent text-accent-foreground shadow-brutal hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                  aria-label="Close menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <ul className="menu-list flex flex-col gap-8 w-full flex-1 justify-center">
                {MENU_ITEMS.map((item) => (
                  <li key={item.label} className="menu-list-item" data-shape={item.shape}>
                    <Link to={item.path} className="nav-link block relative group overflow-hidden" onClick={closeMenu}>
                      <p className="nav-link-text text-5xl md:text-7xl font-black text-background uppercase tracking-tighter leading-none relative z-10 transition-transform hover:scale-105 origin-left">
                        {item.label}
                      </p>
                      <div className="nav-link-hover-bg absolute inset-0 bg-accent -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-12 border-t-2 border-background/20 mt-auto">
                <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-black uppercase text-accent tracking-[0.3em]">SOCIALS</span>
                    <div className="flex gap-8">
                        {[
                          { name: 'TWITTER', url: 'https://twitter.com/Aqora_build' },
                          { name: 'GITHUB', url: 'https://github.com/Aqora-build' },
                          { name: 'DISCORD', url: 'https://discord.gg/Aqora' }
                        ].map(s => (
                            <a 
                              key={s.name} 
                              href={s.url} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-black text-background uppercase tracking-widest hover:text-accent transition-colors"
                            >
                              {s.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
