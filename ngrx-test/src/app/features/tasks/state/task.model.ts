import { createEntityAdapter, EntityState } from '@ngrx/entity';

export type TaskStatus = 'todo' | 'done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  ownerId: string;
  updatedAt: string;
}

export interface TasksState extends EntityState<Task> {
  loading: boolean;
  error: string | null;
}

function compareByUpdatedAt(a: Task, b: Task): number {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

export const taskAdapter = createEntityAdapter<Task>({
  sortComparer: compareByUpdatedAt,
});

export const tasksInitialState: TasksState = taskAdapter.getInitialState({
  loading: false,
  error: null,
});
