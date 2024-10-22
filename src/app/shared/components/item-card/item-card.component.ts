import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'item-card',
  standalone: true,
  imports: [
    CommonModule,
    TruncatePipe
  ],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css'
})
export class ItemCardComponent {

  @Input() cardDesign: string = '';
  @Input() cardHeight: string = '';
  @Input() headerClass: string = '';
  @Input() headerStyle: string = '';
  @Input() headerTxt: string = '';
  @Input() productImg: string = '';
  @Input() productShortName: string = '';
  @Input() iconClass: string = '';
  @Input() cardBodyClass: string= '';
  @Input() headerTxtClass: string= '';
  @Input() productPrice: number = 0;
  @Input() quantity: number = 1;
  @Input() isShowCardHeader: boolean = false;
  @Input() isLoading: boolean = false;
  
  @Output() incrementQuantity = new EventEmitter<void>();
  @Output() decrementQuantity = new EventEmitter<void>();
  @Output() addProductToCart = new EventEmitter<void>();

  addToCart() {
    this.addProductToCart.emit();
  }
  increment() {
    this.incrementQuantity.emit();
  }
  decrement() {
    this.decrementQuantity.emit();
  }
}
