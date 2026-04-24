import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminPanelBase } from '../panel/admin-panel.base';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../panel/panel-admin.html',
  styleUrls: ['../panel/panel-admin.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsuariosComponent extends AdminPanelBase implements OnInit, OnDestroy {
  ngOnInit(): void {
    this.initAdminPanel();
    this.setInitialSection('users');
  }

  ngOnDestroy(): void {
    this.destroyAdminPanel();
  }
}
