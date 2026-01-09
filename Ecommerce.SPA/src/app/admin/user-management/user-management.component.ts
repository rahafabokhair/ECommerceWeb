import { Component, inject } from '@angular/core';
import { User } from '../../core/models/object-model';
import { AdminService } from '../admin.service';
import { CommonModule } from '@angular/common';
import {
  ModalModule,
  BsModalService,
  BsModalRef,
  ModalOptions,
} from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';
import { AlertifyService } from '../../shared/services/alertify.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ModalModule],
  providers: [BsModalService],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent {
  bsModalRef?: BsModalRef;
  users: User[] = [];
  userRoles: any = [];
  adminService = inject(AdminService);
  alertifyService = inject(AlertifyService);
  constructor(private modalService: BsModalService) {
    this.getAllUsers();
  }
  getAllUsers() {
    this.adminService.getAllUsersWithRoles().subscribe((data) => {
      this.users = data;
    });
  }

  editRolesModal(user: User) {
    const initialState: ModalOptions = {
      initialState: {
        user,
        roles: this.getRolesArray(user),
      },
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, initialState);
    this.bsModalRef.content.updateSelectedRoles.subscribe((values: any[]) => {
      const rolesToUpdate = {
        roleNames: [
          ...values.filter((el) => el.checked === true).map((el) => el.name),
        ],
      };
      if (rolesToUpdate) {
        this.adminService.edituserRoles(user, rolesToUpdate).subscribe(
          () => {
            user.roles = [...rolesToUpdate.roleNames];
          },
          (error) => {
            this.alertifyService.error('error');
          }
        );
      }
    });

    this.bsModalRef.content.closeBtnName = 'Close';
  }

  private getRolesArray(user: User) {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Moderator', value: 'Moderator' },
      { name: 'Member', value: 'Member' },
      { name: 'VIP', value: 'VIP' },
    ];
    for (let index = 0; index < availableRoles.length; index++) {
      let isMatch = false;
      for (let j = 0; j < userRoles.length; j++) {
        if (availableRoles[index].name === userRoles[j]) {
          isMatch = true;
          availableRoles[index].checked = true;
          roles.push(availableRoles[index]);
          break;
        }
      }
      if (!isMatch) {
        availableRoles[index].checked = false;
        roles.push(availableRoles[index]);
      }
    }
    return roles;
  }
}
