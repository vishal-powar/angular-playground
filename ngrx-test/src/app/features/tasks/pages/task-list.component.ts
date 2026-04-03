import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { AuthActions } from '../../auth/state/auth.actions';
import { authFeature } from '../../auth/state/auth.feature';
import { TasksActions } from '../state/tasks.actions';
import { tasksFeature } from '../state/tasks.feature';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="panel">
      <h1>Tasks</h1>
      @if (loading()) {
        <p class="muted">Loading tasks…</p>
      }
      @if (error(); as err) {
        @if (err) {
          <p class="error">{{ err }}</p>
        }
      }
      <ul class="task-list">
        @for (task of allTasks(); track task.id) {
          <li>
            <a [routerLink]="['/tasks', task.id]">{{ task.title }}</a>
            <span class="badge" [class.done]="task.status === 'done'">{{
              task.status
            }}</span>
            <button
              type="button"
              class="link"
              (click)="toggle(task.id, task.status)"
            >
              Toggle
            </button>
            <button
              type="button"
              class="danger"
              (click)="remove(task)"
            >
              Delete
            </button>
          </li>
        } @empty {
          @if (!loading()) {
            <li class="muted">No tasks yet.</li>
          }
        }
      </ul>
      <form class="add-form" (ngSubmit)="add()">
        <input
          name="title"
          [(ngModel)]="newTitle"
          placeholder="New task title"
          required
        />
        <button type="submit">Add task</button>
      </form>
    </section>
  `,
  styles: `
    .panel {
      max-width: 42rem;
    }
    .task-list {
      list-style: none;
      padding: 0;
      margin: 0 0 1rem;
    }
    .task-list li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e5e5e5;
    }
    .badge {
      font-size: 0.75rem;
      text-transform: uppercase;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      background: #f0f0f0;
    }
    .badge.done {
      background: #d4edda;
    }
    .muted {
      color: #666;
    }
    .error {
      color: #b00020;
    }
    button.link {
      background: none;
      border: none;
      color: #1565c0;
      cursor: pointer;
      text-decoration: underline;
      padding: 0;
    }
    button.danger {
      background: #fdecea;
      border: 1px solid #f5c6cb;
      color: #721c24;
      border-radius: 4px;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
    }
    .add-form {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    input {
      flex: 1;
      min-width: 12rem;
      padding: 0.35rem 0.5rem;
    }
  `,
})
export class TaskListComponent implements OnInit {
  protected readonly store = inject(Store);
  protected readonly allTasks = this.store.selectSignal(
    tasksFeature.selectAllTasks,
  );
  protected readonly loading = this.store.selectSignal(tasksFeature.selectLoading);
  protected readonly error = this.store.selectSignal(tasksFeature.selectError);

  protected newTitle = '';

  ngOnInit(): void {
    this.store.dispatch(TasksActions.loadTasks());
    this.store.dispatch(AuthActions.login({ email: 'demo-user@protask.local' }));
  }

  protected add(): void {
    const title = this.newTitle.trim();
    if (!title) return;
    const owner =
      this.store.selectSignal(authFeature.selectUser)() ?? null;
    const ownerId = owner?.id ?? 'demo-user';
    this.store.dispatch(TasksActions.addTask({ title, ownerId }));
    this.newTitle = '';
  }

  protected toggle(id: string, status: string): void {
    const next = status === 'done' ? 'todo' : 'done';
    this.store.dispatch(
      TasksActions.updateTask({
        update: { id, changes: { status: next } },
      }),
    );
  }

  protected remove(task: import('../state/task.model').Task): void {
    this.store.dispatch(TasksActions.deleteTask({ task }));
  }
}
