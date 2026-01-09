import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Form, FormsModule, NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Product } from '../../core/models/object-model';
import { PhotoManagementComponent } from "../photo-management/photo-management.component";

@Component({
  selector: 'app-products-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, PhotoManagementComponent],
  templateUrl: './products-modal.component.html',
  styleUrl: './products-modal.component.css',
})
export class ProductsModalComponent implements OnInit {
  @Output() updateProductValues = new EventEmitter();
  productForm!: NgForm;
  product!: any;
  isEdit = false;
  categoryList = [
    { id: 1, name: 'Women' },
    { id: 2, name: 'Men' },
    { id: 3, name: 'Kids' },
  ];

  //file
  selectedFile!: File;
  previewUrl: string | ArrayBuffer | null = null;
  constructor(public bsModalRef: BsModalRef) {}
  ngOnInit() {
    if (this.product == null) {
      this.product = {};
      this.isEdit = true;
    }
  
  }
  updateProduct() {
    this.product.photo
    this.updateProductValues.emit(
      this.product
    );

    this.bsModalRef.hide();
  }

}
