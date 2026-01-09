import { Component, OnInit } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { UserManagementComponent } from '../user-management/user-management.component';
import { PhotoManagementComponent } from '../photo-management/photo-management.component';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';
import { ProductManagementComponent } from '../product-management/product-management.component';
import { OrderManagementComponent } from '../order-management/order-management.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    TabsModule,
    UserManagementComponent,
    OrderManagementComponent,
    ProductManagementComponent,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent implements OnInit {
  activeTab = 1;
  ngOnInit() {
    const savedTab = localStorage.getItem('activeTab');
    console.log(savedTab);

    if (savedTab !== null) {
      setTimeout(() => {
        this.activeTab = +savedTab;
      });
    }
  }
  setActiveTab(index: number) {
    this.activeTab = index;
    localStorage.setItem('activeTab', index.toString());
  }
}
