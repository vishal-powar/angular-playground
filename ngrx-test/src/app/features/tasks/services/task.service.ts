import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Update } from '@ngrx/entity';
import { Task } from '../state/task.model';

const API_BASE = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(`${API_BASE}/tasks`).pipe(
      delay(400),
      map((tasks) => tasks.map((t) => this.normalizeTask(t))),
    );
  }

  create(partial: Pick<Task, 'title' | 'status' | 'ownerId'>): Observable<Task> {
    const body = {
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    return this.http.post<Task>(`${API_BASE}/tasks`, body).pipe(
      delay(500),
      map((t) => this.normalizeTask(t)),
    );
  }

  update(id: string, changes: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${API_BASE}/tasks/${id}`, changes).pipe(
      delay(400),
      map((t) => this.normalizeTask(t)),
    );
  }

  delete(id: string): Observable<void> {
    if (id === 'force-fail-delete') {
      return throwError(() => new Error('Simulated network failure'));
    }
    return this.http.delete<void>(`${API_BASE}/tasks/${id}`).pipe(delay(500));
  }

  applyUpdateToApi(update: Update<Task>): Observable<Task> {
    const { id, changes } = update;
    const merged: Partial<Task> = {
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    return this.update(id as string, merged);
  }

  private normalizeTask(raw: Task): Task {
    return {
      id: String(raw.id),
      title: raw.title,
      status: raw.status,
      ownerId: raw.ownerId,
      updatedAt: raw.updatedAt,
    };
  }
}
