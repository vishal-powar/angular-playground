import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './features/auth/state/auth.actions';
import { authFeature } from './features/auth/state/auth.feature';
import { selectProjectStatistics } from './features/project/project.selectors';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly store = inject(Store);

  protected readonly user = this.store.selectSignal(authFeature.selectUser);
  protected readonly stats = this.store.selectSignal(selectProjectStatistics);

  protected login(): void {
    this.store.dispatch(
      AuthActions.login({ email: 'demo-user@protask.local' }),
    );
  }

  protected logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
