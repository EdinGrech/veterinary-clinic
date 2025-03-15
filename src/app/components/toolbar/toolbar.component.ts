import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service.service';
import { Roles } from '../../models/auth.models';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule, MatButtonModule, RouterModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  constructor(private readonly authService: AuthService) {}

  role: Roles = Roles[localStorage.getItem('role') as keyof typeof Roles];
  Roles = Roles;

  logout() {
    this.authService.logout();
  }
}
