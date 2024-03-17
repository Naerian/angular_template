import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { SpinnerPosition, SpinnerSize } from './models/spinner.entity';

@Component({
  selector: 'neo-spinner',
  templateUrl: './spinner.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {

  @Input() size: SpinnerSize = 'm';
  @Input() position: SpinnerPosition = 'absolute';
  @Input() overlay: boolean = false;
  @Input() labelSize: string = '0.8rem';
  @Input() labelColor: string = '';
  @Input() label: string = '';

}
