import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { UserRole } from './services/auth/enums';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const requiredRole = route.data['roles'] as UserRole;
    const userRole = UserRole[requiredRole];

    if (userRole === requiredRole[0]) {
      return true;
    } else {
      this.router.navigate(['/signin']);
      return false;
    }
  }
}
