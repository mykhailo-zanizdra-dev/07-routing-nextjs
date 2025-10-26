'use client';

import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

type Props = {
  error: Error;
  reset: () => void;
};

const Error = ({ error, reset }: Props) => {
  return <ErrorMessage message={error.message} handleReset={reset} />;
};

export default Error;
