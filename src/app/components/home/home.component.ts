import { Component, ElementRef, OnInit, ViewChild, OnDestroy, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add RouterModule here
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms cubic-bezier(0.215, 0.61, 0.355, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('600ms cubic-bezier(0.215, 0.61, 0.355, 1)', 
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('artistsScroll') artistsScroll!: ElementRef;
  @ViewChild('reviewsScroll') reviewsScroll!: ElementRef;
  
  artists = [
    {
      name: 'Leonardo de Vinci',
      style: 'Abstract Expressionism',
      image: './artist1.jpg'
    },
    {
      name: 'Vincent van Gogh',
      style: 'Contemporary Realism',
      image: './artist2.jpg'
    },
    {
      name: 'Claude Monet',
      style: 'Mixed Media',
      image: './artist3.jpg'
    },
    {
      name: 'Salvator Dali',
      style: 'Mixed Media',
      image: './artist4.jpg'
    },
    {
      name: 'Gustav Klimt',
      style: 'Mixed Media',
      image: './artist5.jpg'
    },
    {
      name: 'Juan Gris',
      style: 'Mixed Media',
      image: './artist6.jpg'
    }
  ];

  reviews = [
    {
      name: 'Sophie Martin',
      location: 'Paris, France',
      image: '/avatar1.jpg',
      rating: 4.5,
      text: 'The artwork I purchased exceeded my expectations. The colors are even more vibrant in person and it has become the centerpiece of my living room. The delivery was carefully handled and arrived right on time.',
      date: '15 May 2023'
    },
    {
      name: 'James Wilson',
      location: 'London, UK',
      image: '/avatar2.jpg',
      rating: 5,
      text: 'As a first-time art buyer, I was nervous about the process, but the gallery team guided me perfectly. The artist even included a personalized note with the painting. Absolutely thrilled with my purchase!',
      date: '22 April 2023'
    },
    {
      name: 'Emma Johnson',
      location: 'New York, USA',
      image: '/avatar3.jpg',
      rating: 4,
      text: 'Beautiful collection of contemporary pieces. Found exactly what I was looking for after months of searching. The framing options were excellent quality and reasonably priced.',
      date: '10 June 2023'
    },
    {
      name: 'Luca Bianchi',
      location: 'Milan, Italy',
      image: '/avater4.jpg',
      rating: 5,
      text: 'The curated selection from emerging artists is outstanding. I\'ve purchased three pieces already and each one gets compliments daily. The certificate of authenticity with each work gives me confidence in my investments.',
      date: '3 May 2023'
    },
    {
      name: 'Olivia Chen',
      location: 'Shanghai, China',
      image: '/avatar5.jpg',
      rating: 4.5,
      text: 'International shipping was flawless. The artwork was packed with extreme care and arrived in perfect condition. The artist\'s story included with the piece makes it even more special to me.',
      date: '18 March 2023'
    }
  ];

  isBrowser: boolean;
  private resizeObserver: ResizeObserver | null = null;
  autoSlideInterval: ReturnType<typeof setTimeout> | null = null; // Fixed initialization


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.setupCarousels();
    }
  }


  ngOnDestroy() {
    if (this.isBrowser) {
      if (this.autoSlideInterval) {
        clearInterval(this.autoSlideInterval);
      }
      this.cleanUp();
    }
  }
  private setupCarousels() {
    // Use ResizeObserver for better performance
    this.resizeObserver = new ResizeObserver(() => {
      // Handle resize if needed
    });
    
    if (this.reviewsScroll?.nativeElement) {
      this.resizeObserver.observe(this.reviewsScroll.nativeElement);
    }
    if (this.artistsScroll?.nativeElement) {
      this.resizeObserver.observe(this.artistsScroll.nativeElement);
    }
  }

  private cleanUp() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
 
  // Artist carousel methods
  scrollLeft() {
    if (this.isBrowser && this.artistsScroll?.nativeElement) {
      this.artistsScroll.nativeElement.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  }

  scrollRight() {
    if (this.isBrowser && this.artistsScroll?.nativeElement) {
      this.artistsScroll.nativeElement.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  }

  // Reviews carousel methods
  scrollReviewsLeft() {
    if (this.isBrowser && this.reviewsScroll?.nativeElement) {
      this.reviewsScroll.nativeElement.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  }

  scrollReviewsRight() {
    if (this.isBrowser && this.reviewsScroll?.nativeElement) {
      this.reviewsScroll.nativeElement.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  }

  startAutoSlide() {
    if (!this.isBrowser) return;

    this.autoSlideInterval = setInterval(() => {
      this.scrollReviewsRight();
    }, 5000);
  }

  getStarRating(rating: number): number {
    return Math.floor(rating);
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 > 0;
  }
}