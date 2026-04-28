import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminPanelBase } from '../admin-layout/admin-layout.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../admin-layout/admin-layout.component.html',
  styleUrls: ['../admin-layout/admin-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent extends AdminPanelBase implements OnInit, OnDestroy {
  ngOnInit(): void {
    this.initAdminPanel();
    this.setInitialSection('dashboard');
  }

  ngOnDestroy(): void {
    this.destroyAdminPanel();
  }
}
