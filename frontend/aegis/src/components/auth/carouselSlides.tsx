import { Activity, Brain, Heart, Shield } from "lucide-react";

export interface Slide {
  id: number;
  image: string;
  tag: string;
  title: string;
  description: string;
  bullets: string[];
  icon: React.ReactNode;
  overlay: string;
}

export const SLIDES: Slide[] = [
  {
    id: 1,
    image: "/images/auth-carousel-1.avif",
    tag: "Stroke Detection",
    title: "Detect the Signs Before It's Too Late",
    description:
      "Aegis monitors key neurological indicators in real time, catching early stroke warning signs before they become emergencies.",
    bullets: [
      "Real-time brain activity tracking",
      "FAST symptom detection",
      "Instant emergency alerts",
    ],
    icon: <Brain size={18} />,
    overlay: "from-teal-900/70 via-teal-800/60 to-teal-900/85",
  },
  {
    id: 2,
    image:
      "/images/auth-carousel-4.avif",
    tag: "24/7 Monitoring",
    title: "Round-the-Clock Stroke Prevention",
    description:
      "Aegis never sleeps. Our AI continuously watches your vitals and flags abnormal patterns linked to stroke risk.",
    bullets: [
      "Continuous vitals monitoring",
      "AI-powered risk scoring",
      "Automated caregiver alerts",
    ],
    icon: <Activity size={18} />,
    overlay: "from-teal-900/70 via-teal-800/60 to-teal-900/85",
  },
  {
    id: 3,
    image: "/images/auth-carousel-2.avif",
    tag: "Recovery Support",
    title: "With You Every Step of Recovery",
    description:
      "From the first alert to full rehabilitation, Aegis keeps your care team connected and your recovery on track.",
    bullets: [
      "Post-stroke recovery plans",
      "Care team coordination",
      "Progress tracking & reports",
    ],
    icon: <Heart size={18} />,
    overlay: "from-teal-900/70 via-teal-800/60 to-teal-900/85",
  },
  {
    id: 4,
    image: "/images/auth-carousel-3.avif",
    tag: "Trusted Protection",
    title: "Your Shield Against Stroke Risk",
    description:
      "Aegis was built for those who need it most — seniors and high-risk patients who deserve proactive, compassionate protection.",
    bullets: [
      "Designed for high-risk patients",
      "Family & caregiver dashboard",
      "24/7 emergency response",
    ],
    icon: <Shield size={18} />,
    overlay: "from-teal-900/70 via-teal-800/60 to-teal-900/85",
  },
];
