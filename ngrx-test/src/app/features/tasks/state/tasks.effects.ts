import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { TaskService } from '../services/task.service';
import { TasksActions } from './tasks.actions';

@Injectable()
export class TasksEffects {
  private readonly actions$ = inject(Actions);
  private readonly tasksApi = inject(TaskService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTasks),
      switchMap(() =>
        this.tasksApi.getAll().pipe(
          map((tasks) => TasksActions.loadTasksSuccess({ tasks })),
          catchError((err: Error) =>
            of(TasksActions.loadTasksFailure({ error: err.message })),
          ),
        ),
      ),
    ),
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.addTask),
      switchMap(({ title, ownerId }) =>
        this.tasksApi
          .create({
            title,
            ownerId,
            status: 'todo',
          })
          .pipe(
            map((task) => TasksActions.addTaskSuccess({ task })),
            catchError((err: Error) =>
              of(TasksActions.addTaskFailure({ error: err.message })),
            ),
          ),
      ),
    ),
  );

  persistUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTask),
      switchMap(({ update }) =>
        this.tasksApi.applyUpdateToApi(update).pipe(
          map((task) => TasksActions.updateTaskSuccess({ task })),
          catchError((err: Error) =>
            of(TasksActions.updateTaskFailure({ error: err.message })),
          ),
        ),
      ),
    ),
  );

  optimisticDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTask),
      switchMap(({ task }) =>
        this.tasksApi.delete(task.id).pipe(
          mergeMap(() => EMPTY),
          catchError(() => of(TasksActions.undoDeleteTask({ task }))),
        ),
      ),
    ),
  );
}
