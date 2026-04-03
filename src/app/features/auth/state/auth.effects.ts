import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { AuthActions } from './auth.actions';
import { User } from './auth.model';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email }) =>
        of(email).pipe(
          delay(800),
          map((): User => {
            const id = email.split('@')[0] || 'demo-user';
            return {
              id,
              name: id === 'demo-user' ? 'Demo User' : id,
              email,
            };
          }),
          map((user) => AuthActions.loginSuccess({ user })),
          catchError((err: Error) =>
            of(AuthActions.loginFailure({ error: err.message })),
          ),
        ),
      ),
    ),
  );
}
