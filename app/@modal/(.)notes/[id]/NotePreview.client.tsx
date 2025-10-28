'use client';
import QUERY_KEYS from '@/const/queryKeys';
import { fetchNoteById } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Modal from '../../../../components/Modal/Modal';
import css from './NotePreview.module.css';
import Loader from '@/components/Loader/Loader';

function NotePreviewClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: note,
    error,
    isFetching,
  } = useQuery({
    queryKey: [QUERY_KEYS.NOTE, id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (error) {
    toast.error('Failed to load note preview.');
    return null;
  }

  if (!note && !error && !isFetching) {
    toast.error('Sorry, note was not found.');
    return null;
  }

  return (
    <Modal handleClose={() => router.back()} className={css.modal}>
      <button
        type="button"
        onClick={() => router.back()}
        className={css.backBtn}
      >
        ✕
      </button>
      {isFetching && <Loader />}
      {!!note && (
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.content}>{note.content}</p>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.date}>{`Created at: ${note.createdAt}`}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default NotePreviewClient;
