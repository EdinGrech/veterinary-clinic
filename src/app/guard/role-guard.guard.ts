import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Roles } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles: Roles[] = route.data['roles'];
    const storedRole: string | null = localStorage.getItem('role');
    const role: Roles = Roles[storedRole as keyof typeof Roles];

    if (role && storedRole && requiredRoles.includes(role)) {
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }
}
