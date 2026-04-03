import { createSelector } from '@ngrx/store';
import { authFeature } from '../auth/state/auth.feature';
import { User } from '../auth/state/auth.model';
import { Task } from '../tasks/state/task.model';
import { tasksFeature } from '../tasks/state/tasks.feature';

export const selectProjectStatistics = createSelector(
  authFeature.selectUser,
  tasksFeature.selectAllTasks,
  (user: User | null, tasks: Task[]) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const currentUserId = user?.id ?? null;
    const tasksForCurrentUser = user
      ? tasks.filter((t) => t.ownerId === user.id).length
      : 0;
    return {
      totalTasks,
      completedTasks,
      openTasks: totalTasks - completedTasks,
      currentUserId,
      tasksForCurrentUser,
      isAuthenticated: user !== null,
    };
  },
);
