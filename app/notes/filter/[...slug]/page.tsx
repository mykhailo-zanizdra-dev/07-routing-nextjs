interface FilteredNotesProps {
  params: Promise<{ slug: string[] }>;
}

import NotesClient from '@/components/NotesClient/Notes.client';
import QUERY_KEYS from '@/const/queryKeys';
import { fetchNotes } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

async function FilteredNotes({ params }: FilteredNotesProps) {
  const { slug: [initialFilter] = [] } = (await params) || {};
  const queryClient = new QueryClient();
  const filter = initialFilter && initialFilter !== 'all' ? initialFilter : '';

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.NOTES, '', 1, filter],
    queryFn: () => fetchNotes({ page: 1, search: '', tag: filter }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient filter={filter} />
    </HydrationBoundary>
  );
}

export default FilteredNotes;
