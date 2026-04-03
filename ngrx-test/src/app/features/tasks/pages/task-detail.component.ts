import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TasksActions } from '../state/tasks.actions';
import { selectCurrentTaskFromRoute } from '../state/tasks.selectors';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="panel">
      <a routerLink="/tasks" class="back">← All tasks</a>
      @if (task(); as t) {
        <h1>{{ t.title }}</h1>
        <p class="meta">
          <span class="badge" [class.done]="t.status === 'done'">{{
            t.status
          }}</span>
          <span class="muted">Owner: {{ t.ownerId }}</span>
        </p>
        <p class="muted">Updated {{ t.updatedAt | date: 'medium' }}</p>
      } @else {
        <p class="warn">No task for this URL (id from router + entity map).</p>
      }
    </section>
  `,
  styles: `
    .panel {
      max-width: 42rem;
    }
    .back {
      display: inline-block;
      margin-bottom: 1rem;
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
    .meta {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .muted {
      color: #666;
    }
    .warn {
      color: #856404;
    }
  `,
})
export class TaskDetailComponent implements OnInit {
  private readonly store = inject(Store);
  protected readonly task = this.store.selectSignal(selectCurrentTaskFromRoute);

  ngOnInit(): void {
    this.store.dispatch(TasksActions.loadTasks());
  }
}
