import { createReducer, on } from '@ngrx/store';
import { TasksActions } from './tasks.actions';
import { taskAdapter, tasksInitialState } from './task.model';

export const tasksReducer = createReducer(
  tasksInitialState,
  on(TasksActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TasksActions.loadTasksSuccess, (state, { tasks }) =>
    taskAdapter.setAll(tasks, {
      ...state,
      loading: false,
      error: null,
    }),
  ),
  on(TasksActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TasksActions.addTask, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TasksActions.addTaskSuccess, (state, { task }) =>
    taskAdapter.addOne(task, {
      ...state,
      loading: false,
      error: null,
    }),
  ),
  on(TasksActions.addTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TasksActions.updateTask, (state, { update }) =>
    taskAdapter.updateOne(update, {
      ...state,
      error: null,
    }),
  ),
  on(TasksActions.updateTaskSuccess, (state, { task }) =>
    taskAdapter.updateOne(
      { id: task.id, changes: task },
      { ...state, error: null },
    ),
  ),
  on(TasksActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(TasksActions.deleteTask, (state, { task }) =>
    taskAdapter.removeOne(task.id, state),
  ),
  on(TasksActions.undoDeleteTask, (state, { task }) =>
    taskAdapter.addOne(task, {
      ...state,
      error: 'Delete failed — task restored.',
    }),
  ),
);
