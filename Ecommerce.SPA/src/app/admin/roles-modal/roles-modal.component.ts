import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { User } from '../../core/models/object-model';
import { Form, FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-roles-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles-modal.component.html',
  styleUrl: './roles-modal.component.css',
})
export class RolesModalComponent {
  @Output() updateSelectedRoles = new EventEmitter();
  user!: User;
  roles: any[] = [];
  rolesForm!: any;
  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {}
  updateRoles() {
    this.updateSelectedRoles.emit(this.roles);
    this.bsModalRef.hide();
  }
}
