import { Component, inject } from '@angular/core';
import { Order } from '../../core/models/object-model';
import { AdminService } from '../admin.service';
import { CommonModule, DatePipe } from '@angular/common';
import { PaymentWayPipe } from '../../shared/pipes/payment-way.pipe';
import { OrderStatusPipe } from '../../shared/pipes/order-status.pipe';
import {
  BsModalRef,
  BsModalService,
  ModalModule,
  ModalOptions,
} from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { OrderModalComponent } from '../order-modal/order-modal.component';
import { AlertifyService } from '../../shared/services/alertify.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    DatePipe,
    PaymentWayPipe,
    OrderStatusPipe,
    ModalModule,
    CommonModule,
    FormsModule,
  ],
  providers: [BsModalService],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css',
})
export class OrderManagementComponent {
  bsModalRef?: BsModalRef;
  adminService = inject(AdminService);
  alertifyService=inject(AlertifyService);
  orders: Order[] = [];

  constructor(private modalService: BsModalService) {
    this.getAllOrders();
  }
  getAllOrders() {
    this.adminService.getAllOrders().subscribe((data) => {
      this.orders = data;
    });
  }

  updateOrderStatus(order: Order) {
    const initialState: ModalOptions = {
      initialState: {
        order,
      },
    };

  
    
    this.bsModalRef = this.modalService.show(OrderModalComponent, initialState);

    this.bsModalRef.content.updateSelectedStatus.subscribe((value: number) => {
      let status = {
        OrderStatusId: value,
      };


      

      this.adminService.editOrderStatus(order.id, status).subscribe(
        () => {
          this.alertifyService.success('Order status updated successfully');
          order.orderStatusId=status.OrderStatusId;
        },
        (error) => {
          this.alertifyService.error('error update Order');
        }
      );
    });

    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
