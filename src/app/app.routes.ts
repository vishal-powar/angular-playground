import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/pages/task-list.component').then(
        (m) => m.TaskListComponent,
      ),
  },
  {
    path: 'tasks/:id',
    loadComponent: () =>
      import('./features/tasks/pages/task-detail.component').then(
        (m) => m.TaskDetailComponent,
      ),
  },
];
