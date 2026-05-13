import { Navbar } from '@/components/sections/navbar';
import { HeroSection } from '@/components/sections/hero';
import { FeaturesSection } from '@/components/sections/features';
import { HowItWorksSection } from '@/components/sections/how-it-works/section';
import { AfricanAdvantageSection } from '@/components/sections/african-advantage';
import { TrustSection } from '@/components/sections/trust';
import { TestimonialsCarousel } from '@/components/sections/testimonials';
import { PricingSection } from '@/components/sections/pricing';
import { FinalCTASection } from '@/components/sections/final-cta';
import { Footer } from '@/components/sections/footer';
import { ScrollToTopButton } from '@/components/sections/scroll-to-top';

export const metadata = {
  title: 'SmartSchool Pro - School Management Made Simple',
  description:
    'Digital school management platform for African schools. Manage students, fees, attendance, and more. Built for offline, supports MTN MoMo & Airtel Money.',
  keywords:
    'school management, student management, fee tracking, attendance, African schools, Uganda, Kenya, Tanzania',
  authors: [{ name: 'SmartSchool Pro' }],
  openGraph: {
    title: 'SmartSchool Pro - School Management Made Simple',
    description:
      'Digital school management platform for African schools with offline support and mobile money integration.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartSchool Pro',
    description: 'School management made simple for African schools',
  },
};

const styles = `
.realistic-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.realistic-bg .sky {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #87CEEB 0%, #B0E0E6 40%, #E0F4FF 70%, #F0F8FF 100%);
}

.realistic-bg .sun {
  position: absolute;
  top: 40px;
  right: 80px;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, #FFD700 0%, #FFA500 40%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 60px rgba(255, 215, 0, 0.4), 0 0 120px rgba(255, 215, 0, 0.2);
}

.realistic-bg .cloud {
  position: absolute;
  background: rgba(255,255,255,0.8);
  border-radius: 50px;
}

.realistic-bg .cloud-1 { top: 60px; left: 10%; width: 180px; height: 40px; box-shadow: 20px -15px 0 10px rgba(255,255,255,0.7); }
.realistic-bg .cloud-2 { top: 100px; right: 15%; width: 220px; height: 35px; box-shadow: 25px -10px 0 8px rgba(255,255,255,0.6); animation-delay: 3s; }
.realistic-bg .cloud-3 { top: 30px; left: 40%; width: 150px; height: 30px; box-shadow: 15px -12px 0 6px rgba(255,255,255,0.5); animation-delay: 6s; }

.realistic-bg .ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 45%;
  background: linear-gradient(180deg, #90EE90 0%, #7CCD7C 20%, #228B22 50%, #1a6b1a 100%);
  border-radius: 40% 60% 0 0 / 20% 30% 0 0;
}

.realistic-bg .ground-far {
  position: absolute;
  bottom: 42%;
  left: 0;
  right: 0;
  height: 8%;
  background: linear-gradient(180deg, #a8e6a8 0%, #90EE90 100%);
}

.realistic-bg .school-building {
  position: absolute;
  bottom: 40%;
  left: 50%;
  transform: translateX(-50%);
  width: 420px;
  height: 300px;
}

.realistic-bg .school-body {
  position: absolute;
  bottom: 0;
  left: 10px;
  right: 10px;
  height: 220px;
  background: linear-gradient(180deg, #f5deb3 0%, #deb887 100%);
  border-radius: 4px 4px 0 0;
  border: 2px solid #c4a265;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
}

.realistic-bg .school-roof {
  position: absolute;
  bottom: 210px;
  left: 0;
  right: 0;
  height: 0;
  border-left: 220px solid transparent;
  border-right: 220px solid transparent;
  border-bottom: 80px solid #b22222;
  z-index: 2;
}

.realistic-bg .school-roof-line {
  position: absolute;
  bottom: 215px;
  left: 10px;
  right: 10px;
  height: 8px;
  background: #8b0000;
  z-index: 3;
  border-radius: 2px;
}

.realistic-bg .school-window {
  position: absolute;
  width: 44px;
  height: 56px;
  background: linear-gradient(180deg, #b0e0e6 0%, #87ceeb 100%);
  border: 3px solid #c4a265;
  border-radius: 3px;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
}

.realistic-bg .school-window::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #c4a265;
}

.realistic-bg .window-r1 { bottom: 100px; }
.realistic-bg .window-r2 { bottom: 20px; }
.realistic-bg .w1 { left: 30px; }
.realistic-bg .w2 { left: 90px; }
.realistic-bg .w3 { left: 150px; }
.realistic-bg .w4 { left: 220px; }
.realistic-bg .w5 { left: 280px; }
.realistic-bg .w6 { left: 340px; }

.realistic-bg .school-door {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 80px;
  background: linear-gradient(180deg, #8b4513 0%, #654321 100%);
  border-radius: 25px 25px 0 0;
  border: 2px solid #5c3317;
  z-index: 4;
}

.realistic-bg .school-door::after {
  content: '';
  position: absolute;
  right: 8px;
  top: 50%;
  width: 6px;
  height: 6px;
  background: #FFD700;
  border-radius: 50%;
}

.realistic-bg .school-clock {
  position: absolute;
  bottom: 220px;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 36px;
  background: white;
  border: 3px solid #c4a265;
  border-radius: 50%;
  z-index: 5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.realistic-bg .school-clock::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 14px;
  width: 3px;
  height: 12px;
  background: #333;
  border-radius: 2px;
  transform-origin: bottom center;
  transform: rotate(30deg);
}

.realistic-bg .school-flag {
  position: absolute;
  bottom: 270px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 40px;
  background: #666;
  z-index: 6;
}

.realistic-bg .school-flag::after {
  content: '';
  position: absolute;
  top: 0;
  left: 2px;
  width: 24px;
  height: 14px;
  background: linear-gradient(90deg, #000 0%, #000 33%, #FFD700 33%, #FFD700 66%, #FF0000 66%, #FF0000 100%);
  border-radius: 0 3px 3px 0;
}

.realistic-bg .tree {
  position: absolute;
  bottom: 40%;
}

.realistic-bg .tree-trunk {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 50px;
  background: linear-gradient(180deg, #8B4513 0%, #654321 100%);
  border-radius: 3px;
}

.realistic-bg .tree-canopy {
  position: absolute;
  bottom: 35px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(ellipse at center, #2E8B57 0%, #228B22 50%, #1a6b1a 100%);
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.realistic-bg .tree-1 { left: 5%; }
.realistic-bg .tree-2 { left: 12%; }
.realistic-bg .tree-3 { right: 5%; }
.realistic-bg .tree-4 { right: 12%; }

.realistic-bg .child {
  position: absolute;
  bottom: 41%;
  width: 10px;
  z-index: 5;
}

.realistic-bg .child-head {
  width: 14px;
  height: 14px;
  background: #5c3d2e;
  border-radius: 50%;
  margin: 0 auto;
}

.realistic-bg .child-body {
  width: 10px;
  height: 18px;
  background: #1565C0;
  border-radius: 4px 4px 0 0;
  margin: 2px auto 0;
}

.realistic-bg .child-legs {
  width: 10px;
  height: 12px;
  background: #333;
  border-radius: 0 0 3px 3px;
  margin: 0 auto;
}

.realistic-bg .child-1 { left: 20%; }
.realistic-bg .child-2 { left: 25%; bottom: 42%; }
.realistic-bg .child-3 { right: 22%; }
.realistic-bg .child-4 { right: 28%; bottom: 42%; }

.realistic-bg .path {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60%;
  background: linear-gradient(180deg, #C4A265 0%, #B8956A 50%, #A0785C 100%);
  clip-path: polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%);
  opacity: 0.7;
}

.realistic-bg .fence {
  position: absolute;
  bottom: 40%;
  left: 0;
  right: 0;
  height: 30px;
  background: repeating-linear-gradient(
    90deg,
    transparent 0px,
    transparent 28px,
    #8B7355 28px,
    #8B7355 30px,
    transparent 30px,
    transparent 60px
  );
  border-bottom: 2px solid #8B7355;
}

.realistic-bg .fence::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  height: 2px;
  background: #8B7355;
}

.realistic-bg .fence::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: #8B7355;
}

@keyframes float {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(20px); }
}

.realistic-bg .cloud {
  animation: float 15s ease-in-out infinite;
}

@media (max-width: 768px) {
  .realistic-bg .school-building { display: none; }
  .realistic-bg .tree { display: none; }
  .realistic-bg .child { display: none; }
  .realistic-bg .fence { display: none; }
  .realistic-bg .path { display: none; }
}
`;

export default function Home() {
  return (
    <main className="bg-background relative">
      <style>{styles}</style>
      <div className="realistic-bg">
        <div className="sky" />
        <div className="sun" />
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
        <div className="ground-far" />
        <div className="ground" />
        
        {/* School Building */}
        <div className="school-building">
          <div className="school-body" />
          <div className="school-roof" />
          <div className="school-roof-line" />
          <div className="school-clock" />
          <div className="school-flag" />
          {/* Windows Row 1 */}
          <div className="school-window window-r1 w1" />
          <div className="school-window window-r1 w2" />
          <div className="school-window window-r1 w3" />
          <div className="school-window window-r1 w4" />
          <div className="school-window window-r1 w5" />
          <div className="school-window window-r1 w6" />
          {/* Windows Row 2 */}
          <div className="school-window window-r2 w1" />
          <div className="school-window window-r2 w2" />
          <div className="school-window window-r2 w3" />
          <div className="school-window window-r2 w4" />
          <div className="school-window window-r2 w5" />
          <div className="school-window window-r2 w6" />
          {/* Door */}
          <div className="school-door" />
        </div>
        
        {/* Trees */}
        <div className="tree tree-1"><div className="tree-trunk" /><div className="tree-canopy" /></div>
        <div className="tree tree-2"><div className="tree-trunk" /><div className="tree-canopy" /></div>
        <div className="tree tree-3"><div className="tree-trunk" /><div className="tree-canopy" /></div>
        <div className="tree tree-4"><div className="tree-trunk" /><div className="tree-canopy" /></div>
        
        {/* Children */}
        <div className="child child-1"><div className="child-head" /><div className="child-body" /><div className="child-legs" /></div>
        <div className="child child-2"><div className="child-head" /><div className="child-body" /><div className="child-legs" /></div>
        <div className="child child-3"><div className="child-head" /><div className="child-body" /><div className="child-legs" /></div>
        <div className="child child-4"><div className="child-head" /><div className="child-body" /><div className="child-legs" /></div>
        
        {/* Path */}
        <div className="path" />
        
        {/* Fence */}
        <div className="fence" />
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AfricanAdvantageSection />
        <TrustSection />
        <TestimonialsCarousel />
        <PricingSection />
        <FinalCTASection />
        <Footer />
        <ScrollToTopButton />
      </div>
    </main>
  );
}
