import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { Order } from '../../core/models/object-model';

@Component({
  selector: 'app-order-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './order-modal.component.html',
  styleUrl: './order-modal.component.css',
})
export class OrderModalComponent {
  @Output() updateSelectedStatus = new EventEmitter();
  orderForm!: NgForm;
  order!: Order;
  statusVal=1;
  orderStatus = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'On working' },
    { id: 3, name: 'Delivered' },
  ];

  constructor(public bsModalRef: BsModalRef) {}
  updateStatus(statusId: any) {

    this.updateSelectedStatus.emit(statusId);
    this.bsModalRef.hide();
  }
}
