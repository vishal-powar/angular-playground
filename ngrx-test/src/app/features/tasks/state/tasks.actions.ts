import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Task } from './task.model';

export const TasksActions = createActionGroup({
  source: 'Tasks',
  events: {
    loadTasks: emptyProps(),
    loadTasksSuccess: props<{ tasks: Task[] }>(),
    loadTasksFailure: props<{ error: string }>(),

    addTask: props<{ title: string; ownerId: string }>(),
    addTaskSuccess: props<{ task: Task }>(),
    addTaskFailure: props<{ error: string }>(),

    updateTask: props<{ update: Update<Task> }>(),
    updateTaskSuccess: props<{ task: Task }>(),
    updateTaskFailure: props<{ error: string }>(),

    /** Reducer removes immediately; effect uses `task` for rollback on API failure */
    deleteTask: props<{ task: Task }>(),
    undoDeleteTask: props<{ task: Task }>(),
  },
});
