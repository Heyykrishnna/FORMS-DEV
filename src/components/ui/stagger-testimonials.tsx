import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial: "TYPEFORM IS COOL IF YOU WANT TO PAY $50/MONTH TO SEE ONE QUESTION AT A TIME LIKE A 1990S POP QUIZ. I PREFER Aqora.",
    by: "SARAH K., UX DESIGNER",
    imgSrc: "https://i.pravatar.cc/150?img=1"
  },
  {
    tempId: 1,
    testimonial: "GOOGLE FORMS CALLED. THEY WANT THEIR SOULLESS 'BLUE HEADER 1' AND 2005 APATHY BACK. Aqora IS FOR PEOPLE WITH TASTE.",
    by: "MARCUS V., DEVREL",
    imgSrc: "https://i.pravatar.cc/150?img=2"
  },
  {
    tempId: 2,
    testimonial: "JOTFORM MAKES ME FEEL LIKE I'M FILLING OUT A TAX RETURN IN A FEVER DREAM. Aqora IS THE REVOLUTION WE DESERVE.",
    by: "ELENA R., STARTUP FOUNDER",
    imgSrc: "https://i.pravatar.cc/150?img=3"
  },
  {
    tempId: 3,
    testimonial: "TALLY IS CUTE, BUT I PREFER MY FORMS TO LOOK LIKE THEY WERE BORN IN A BASEMENT WITH LOUD TECHNO, NOT A MINIMALIST CAFE.",
    by: "ANDRE, HEAD OF DESIGN",
    imgSrc: "https://i.pravatar.cc/150?img=4"
  },
  {
    tempId: 4,
    testimonial: "SURVEYMONKEY? MORE LIKE SURVEY-STUCK-IN-THE-PAST. PAYING TO EXPORT MY OWN DATA? LOL. Aqora FOREVER.",
    by: "JEREMY, PRODUCT MANAGER",
    imgSrc: "https://i.pravatar.cc/150?img=5"
  },
  {
    tempId: 5,
    testimonial: "MICROSOFT FORMS FEELS LIKE EXCEL HAD A MIDLIFE CRISIS. Aqora FEELS LIKE THE FUTURE OF DATA COLLECTION.",
    by: "PAM, MARKETING DIRECTOR",
    imgSrc: "https://i.pravatar.cc/150?img=6"
  },
  {
  tempId: 6,
  testimonial: "TYPEFORM IS PRETTY, SURE. SO IS A $900 CHAIR. DOESN’T MEAN I’M PAYING FOR IT. Aqora JUST WORKS.",
  by: "NINA S., GROWTH LEAD",
  imgSrc: "https://i.pravatar.cc/150?img=7"
  },
  {
    tempId: 7,
    testimonial: "GOOGLE FORMS IS FINE IF YOUR BRAND STRATEGY IS 'DEFAULT SETTINGS'. Aqora IS WHAT HAPPENS WHEN YOU ACTUALLY CARE.",
    by: "ARJUN P., BRAND STRATEGIST",
    imgSrc: "https://i.pravatar.cc/150?img=8"
  },
  {
    tempId: 8,
    testimonial: "I TRIED BUILDING FORMS WITH NOTION. FELT LIKE ASSEMBLING IKEA FURNITURE WITHOUT THE MANUAL. Aqora SAVED MY SANITY.",
    by: "CLARA M., OPERATIONS MANAGER",
    imgSrc: "https://i.pravatar.cc/150?img=9"
  },
  {
    tempId: 9,
    testimonial: "SURVEY TOOLS THAT CHARGE EXTRA TO REMOVE THEIR LOGO? THAT’S CUTE. Aqora RESPECTS MY BRAND.",
    by: "DEV K., FOUNDER",
    imgSrc: "https://i.pravatar.cc/150?img=10"
  },
  {
    tempId: 10,
    testimonial: "JOTFORM HAS 8,000 FEATURES AND I USE THREE. Aqora DOESN’T MAKE ME DIG THROUGH SETTINGS LIKE I’M HUNTING TREASURE.",
    by: "LUCAS T., PRODUCT DESIGNER",
    imgSrc: "https://i.pravatar.cc/150?img=11"
  },
  {
    tempId: 11,
    testimonial: "MICROSOFT FORMS FEELS LIKE CORPORATE TRAINING DAY. Aqora FEELS LIKE LAUNCH DAY.",
    by: "SOFIA L., COMMUNITY MANAGER",
    imgSrc: "https://i.pravatar.cc/150?img=12"
  },
  {
    tempId: 12,
    testimonial: "TALLY IS MINIMAL. SO IS A BLANK PAGE. Aqora ACTUALLY MAKES PEOPLE WANT TO COMPLETE MY FORMS.",
    by: "RAHUL D., INDIE HACKER",
    imgSrc: "https://i.pravatar.cc/150?img=13"
  },
  {
    tempId: 13,
    testimonial: "PAYING EXTRA TO EXPORT CSV? THAT’S NOT A FEATURE, THAT’S A HOSTAGE SITUATION. Aqora DOESN’T PLAY GAMES.",
    by: "MAYA G., DATA ANALYST",
    imgSrc: "https://i.pravatar.cc/150?img=14"
  },
  {
    tempId: 14,
    testimonial: "IF YOUR FORM TOOL NEEDS A TUTORIAL SERIES, IT’S ALREADY FAILED. Aqora IS STRAIGHT TO THE POINT.",
    by: "ETHAN W., SOLOPRENEUR",
    imgSrc: "https://i.pravatar.cc/150?img=15"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-6 md:p-8 transition-all duration-500 ease-in-out flex flex-col",
        isCenter 
          ? "z-10 bg-[#ff4400] text-primary-foreground border-primary" 
          : "z-0 bg-card text-card-foreground border-border hover:border-primary/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px hsl(var(--border))" : "0px 0px 0px 0px transparent"
      }}
    >
      {isCenter && (
        <div className="absolute top-2 right-2 bg-foreground text-background px-2 py-0.5 text-[8px] font-black uppercase tracking-widest z-20">
          CERTIFIED ROAST
        </div>
      )}
      <span
        className="absolute block origin-top-right rotate-45 bg-border"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(',')[0]}`}
        className="mb-4 h-14 w-12 bg-muted object-cover object-top"
        style={{
          boxShadow: "3px 3px 0px hsl(var(--background))"
        }}
      />
      <h3 className={cn(
        "text-base sm:text-lg md:text-xl font-medium leading-tight mb-4",
        isCenter ? "text-primary-foreground" : "text-foreground"
      )}>
        "{testimonial.testimonial}"
      </h3>
      <p className={cn(
        "mt-auto text-xs sm:text-sm italic font-bold uppercase tracking-wide",
        isCenter ? "text-primary-foreground/80" : "text-muted-foreground"
      )}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(() => 
    typeof window !== 'undefined' && window.matchMedia("(min-width: 640px)").matches ? 365 : 280
  );
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 280);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-muted/20 border-x-2 border-foreground"
      style={{ height: 600 }}
    >
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length - 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};