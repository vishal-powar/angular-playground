import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from './auth.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    login: props<{ email: string }>(),
    loginSuccess: props<{ user: User }>(),
    loginFailure: props<{ error: string }>(),
    logout: emptyProps(),
  },
});
