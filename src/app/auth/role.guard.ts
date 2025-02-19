import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getUserRoles().pipe(
      switchMap((userRoles: string[]) => {
        const requiredRoles = route.data['roles'] as string[];

        if (!requiredRoles) {
          this.router.navigate(['/acesso-negado']);
          return of(false);
        }

        if (requiredRoles.some((role) => userRoles.includes(role))) {
          return of(true);
        } else {
          this.router.navigate(['/acesso-negado']);
          return of(false);
        }
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
