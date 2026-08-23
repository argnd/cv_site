import { Component } from '@angular/core';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';

type Experience = {
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
};

type Education = {
  degree: string;
  school: string;
  period: string;
  details: string;
};

type ShootingStarConfig = {
  top: number;
  left: number;
  delay: number;
  duration: number;
  /** Direction of travel in degrees (CSS rotate convention: 0 = right, 90 = down). */
  angle: number;
  /** Flight distance in pixels. */
  distance: number;
};

type ShootingStar = ShootingStarConfig & {
  dx: number;
  dy: number;
  trailAngle: number;
};

/**
 * Derives the flight vector (dx/dy) and the comet trail's rotation from a single
 * direction of travel, so the trail always points exactly opposite the way the
 * star is actually moving, however it's angled.
 */
function createShootingStar(config: ShootingStarConfig): ShootingStar {
  const radians = (config.angle * Math.PI) / 180;
  return {
    ...config,
    dx: Math.cos(radians) * config.distance,
    dy: Math.sin(radians) * config.distance,
    trailAngle: config.angle + 180,
  };
}

@Component({
  selector: 'app-root',
  imports: [HeroSectionComponent],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly profile = {
    name: 'Armel Gandour',
    headline: 'Software Engineer',
    location: 'Paris, France',
    email: 'armel.gandour@example.com',
    linkedin: 'https://www.linkedin.com/in/armel-gandour/',
    about:
      'Curious and product-focused engineer with a strong interest in building elegant, reliable web experiences. This page is intentionally structured to map directly to LinkedIn data and can be updated quickly.',
  };

  protected readonly experiences: Experience[] = [
    {
      role: 'Frontend Engineer',
      company: 'Company A',
      period: '2024 - Present',
      location: 'Paris, France',
      highlights: [
        'Built responsive interfaces with Angular and TypeScript.',
        'Improved Core Web Vitals and usability across key pages.',
        'Collaborated with product and design to deliver new features.',
      ],
    },
    {
      role: 'Full Stack Developer',
      company: 'Company B',
      period: '2022 - 2024',
      location: 'Remote',
      highlights: [
        'Delivered APIs and UI features for customer-facing products.',
        'Implemented testing strategy to reduce regressions.',
        'Contributed to CI/CD improvements and release stability.',
      ],
    },
    {
      role: 'Software Developer Intern',
      company: 'Company C',
      period: '2021 - 2022',
      location: 'Lyon, France',
      highlights: [
        'Developed internal tools that streamlined team workflows.',
        'Created reusable UI components and technical documentation.',
        'Participated in code reviews and sprint planning.',
      ],
    },
  ];

  protected readonly education: Education[] = [
    {
      degree: 'Master in Computer Science',
      school: 'University 1',
      period: '2020 - 2022',
      details: 'Specialization in software engineering and distributed systems.',
    },
    {
      degree: 'Bachelor in Information Technology',
      school: 'University 2',
      period: '2017 - 2020',
      details: 'Foundations in web development, algorithms, and databases.',
    },
    {
      degree: 'Technical Diploma',
      school: 'Institute 3',
      period: '2015 - 2017',
      details: 'Applied programming, networking, and software project methods.',
    },
  ];

  protected readonly skills = ['Angular', 'TypeScript', 'JavaScript', 'Node.js', 'REST APIs', 'SQL', 'Git'];

  protected readonly heroStars = [
    { top: 8, left: 14, size: 2, delay: 0, duration: 4.6 },
    { top: 16, left: 78, size: 3, delay: 0.6, duration: 5.2 },
    { top: 28, left: 46, size: 2, delay: 1.2, duration: 3.8 },
    { top: 11, left: 60, size: 2, delay: 1.8, duration: 4.9 },
    { top: 38, left: 22, size: 3, delay: 0.3, duration: 5.6 },
    { top: 5, left: 36, size: 2, delay: 2.1, duration: 4.2 },
    { top: 21, left: 90, size: 2, delay: 1.4, duration: 3.6 },
    { top: 46, left: 70, size: 2, delay: 0.9, duration: 5.0 },
    { top: 14, left: 5, size: 3, delay: 2.6, duration: 4.4 },
    { top: 33, left: 55, size: 2, delay: 1.6, duration: 3.9 },
    { top: 3, left: 85, size: 2, delay: 0.4, duration: 4.7 },
    { top: 24, left: 30, size: 2, delay: 2.0, duration: 5.4 },
  ];

  protected readonly shootingStars: ShootingStar[] = [
    createShootingStar({ top: 14, left: 82, delay: 0, duration: 10, angle: 145, distance: 260 }),
    createShootingStar({ top: 26, left: 48, delay: 4.5, duration: 12, angle: 155, distance: 230 }),
    createShootingStar({ top: 7, left: 62, delay: 9, duration: 11, angle: 138, distance: 280 }),
  ];

  protected readonly birds = [
    { top: 18, delay: 0, duration: 26 },
    { top: 30, delay: 15, duration: 23 },
  ];

  protected readonly clouds = [
    { top: 10, scale: 1, delay: 0, duration: 115 },
    { top: 23, scale: 0.68, delay: 34, duration: 145 },
    { top: 5, scale: 0.8, delay: 70, duration: 130 },
  ];

  protected isNight = true;

  protected toggleTheme(): void {
    this.isNight = !this.isNight;
  }

  protected selectedExperience = 0;

  protected selectExperience(index: number): void {
    this.selectedExperience = index;
  }

  protected get currentYear(): number {
    return new Date().getFullYear();
  }
}
