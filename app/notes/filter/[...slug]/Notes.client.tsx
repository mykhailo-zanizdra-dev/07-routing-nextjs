'use client';

import EmptyMessage from '@/components/EmptyMessage/EmptyMessage';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Loader from '@/components/Loader/Loader';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import QUERY_KEYS from '@/const/queryKeys';
import { fetchNotes } from '@/lib/api';
import { keepPreviousData } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import css from './Notes.module.css';

interface NotesClientProps {
  filter?: string;
}

const NotesClient = ({ filter }: NotesClientProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleChange = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const trimmedQuery = event.target.value.trim();
      if (trimmedQuery === searchQuery) {
        return;
      }
      setSearchQuery(trimmedQuery);
      setCurrentPage(1);
    },
    500
  );

  const queryKey = [
    QUERY_KEYS.NOTES,
    searchQuery,
    currentPage,
    ...(filter ? [filter] : []),
  ];

  const { data, isError, isFetching, error, isSuccess } = useQuery({
    queryKey,
    queryFn: () =>
      fetchNotes({ page: currentPage, search: searchQuery, tag: filter }),
    placeholderData: keepPreviousData,
    retry: 1,
    refetchOnMount: false,
  });

  const { notes, totalPages = 0 } = data || {};

  useEffect(() => {
    if (error) {
      toast.error(
        error?.message ? error.message : 'There was an error fetching notes'
      );
    }
  }, [isError, error]);

  return (
    <div className={css.container}>
      <Toaster position="top-center" reverseOrder={false} />
      <header className={css.toolbar}>
        <SearchBox searchQuery={searchQuery} handleChange={handleChange} />
        {totalPages > 1 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            setPage={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={() => setIsOpenModal(true)}>
          Create note +
        </button>
      </header>
      {!!notes?.length && <NoteList notes={notes} />}
      {isFetching && <Loader />}
      {isError && <ErrorMessage message={error.message} />}
      {isSuccess && !notes?.length && <EmptyMessage />}
      {isOpenModal && (
        <Modal handleClose={() => setIsOpenModal(false)}>
          <NoteForm handleClose={() => setIsOpenModal(false)} />
        </Modal>
      )}
    </div>
  );
};

export default NotesClient;
