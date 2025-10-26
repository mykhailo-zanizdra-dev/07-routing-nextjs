import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import Link from 'next/link';
import type { Note } from '../../types/note';
import Spinner from '../Spinner/Spinner';
import css from './NoteList.module.css';
import QUERY_KEYS from '@/const/queryKeys';
import { deleteNote } from '@/lib/api';

interface NoteListProps {
  notes: Note[];
}

function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const { mutate: deleteNoteRequest, isPending: isDeletingNote } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success('Note deleted successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTES] });
    },
    onError: () => {
      toast.error('There was an error deleting the note');
    },
    onMutate: (id: string) => {
      setDeletingNoteId(id);
    },
    onSettled: () => {
      setDeletingNoteId(null);
    },
  });

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            <Link
              href={isDeletingNote ? '#' : `/notes/${id}`}
              className={clsx(css.button, css.buttonDetails)}
            >
              View details
            </Link>
            {isDeletingNote && deletingNoteId === id ? (
              <Spinner size="small" className={css.spinner} />
            ) : (
              <button
                disabled={isDeletingNote}
                className={clsx(css.button, css.buttonDelete)}
                onClick={() => deleteNoteRequest(id)}
              >
                Delete
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
