import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent {
  readonly name = input.required<string>();
  readonly headline = input.required<string>();
  readonly location = input.required<string>();
  readonly linkedinUrl = input.required<string>();
}
