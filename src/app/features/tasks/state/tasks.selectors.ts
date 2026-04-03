import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterReducerState, getRouterSelectors } from '@ngrx/router-store';
import { tasksFeature } from './tasks.feature';

export const selectRouterState =
  createFeatureSelector<RouterReducerState>('router');

export const { selectRouteParam } = getRouterSelectors(selectRouterState);

export const selectTaskIdFromRoute = selectRouteParam('id');

export const selectCurrentTaskFromRoute = createSelector(
  tasksFeature.selectTaskEntities,
  selectTaskIdFromRoute,
  (entities, id) => (id ? entities[id] : undefined),
);
