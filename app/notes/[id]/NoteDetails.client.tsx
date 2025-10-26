'use client';

import { fetchNoteById } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import css from './NoteDetails.module.css';
import QUERY_KEYS from '@/const/queryKeys';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import EmptyMessage from '@/components/EmptyMessage/EmptyMessage';

const NoteDetailsClient = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.NOTE, id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <>
      {isLoading && <Loader />}
      {error && (
        <ErrorMessage
          message={error?.message ? error.message : 'Something went wrong...'}
        />
      )}
      {!error && !isLoading && !note && (
        <EmptyMessage message="🧐 The note is missing" />
      )}
      {!!note && (
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{note.createdAt}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteDetailsClient;
