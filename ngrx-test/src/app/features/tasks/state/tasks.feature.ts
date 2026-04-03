import { createFeature } from '@ngrx/store';
import { tasksReducer } from './tasks.reducer';
import { taskAdapter } from './task.model';

export const tasksFeature = createFeature({
  name: 'tasks',
  reducer: tasksReducer,
  extraSelectors: ({ selectTasksState }) => {
    const { selectIds, selectEntities, selectAll, selectTotal } =
      taskAdapter.getSelectors(selectTasksState);
    return {
      selectTaskIds: selectIds,
      selectTaskEntities: selectEntities,
      selectAllTasks: selectAll,
      selectTaskTotal: selectTotal,
    };
  },
});
