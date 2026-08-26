import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';

import { User } from '../services/user';

export const adminGuard: CanActivateFn = () => {
  const userService = inject(User);
  const router = inject(Router);

  return userService.getProfile().pipe(
    map((response: any) => {
      const user = response.user ? response.user : response;

      if (user && user.role === 'admin') {
        return true;
      }

      return router.createUrlTree(['/home']);
    }),
    catchError(() => {
      return of(router.createUrlTree(['/home']));
    })
  );
};