import { Component, Input, ViewEncapsulation } from '@angular/core';
import { IconPosition } from './models/section-title.entity';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'neo-section-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-title.component.html',
  styleUrl: './section-title.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SectionTitleComponent {

  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() iconPosition: IconPosition = 'left';
  @Input() iconSize: string = '0.85rem';
  @Input() iconNoColor: boolean = false;
  @Input() hideLine: boolean = false;

}
