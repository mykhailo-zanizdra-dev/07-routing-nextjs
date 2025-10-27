import endpoints from '../const/endpoints';
import type { NewNoteData, Note } from '../types/note';
import notehubApi from './axios';

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = '',
  tag,
}: FetchNotesParams = {}) {
  const response = await notehubApi.get<FetchNotesResponse>(endpoints.notes(), {
    params: {
      page,
      perPage,
      search,
      ...(!!tag && { tag }),
    },
  });
  return response.data;
}

export async function fetchNoteById(id: string) {
  const response = await notehubApi.get<Note>(endpoints.noteById(id));
  return response.data;
}

export async function createNote(newNote: NewNoteData) {
  const response = await notehubApi.post<Note>(endpoints.notes(), newNote);
  return response.data;
}

export async function deleteNote(id: string) {
  const response = await notehubApi.delete<Note>(endpoints.noteById(id));
  return response.data;
}
