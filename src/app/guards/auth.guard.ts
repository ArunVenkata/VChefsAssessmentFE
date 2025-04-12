import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.getGoogleLoginDetails().pipe(
    map((res: any) => {
      console.log("AUTH GUARD")
      if (!res.success) {
        router.navigate(['/login']);
        return false;
      }
      console.log("DONE")
      return true;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
