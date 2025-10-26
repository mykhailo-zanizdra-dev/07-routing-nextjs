'use client';
import css from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  handleReset?: () => void;
}

export default function ErrorMessage({
  message,
  handleReset,
}: ErrorMessageProps) {
  return (
    <div>
      <p className={css.text}>
        {message ? message : 'There was an error, please try again...'}
        {!!handleReset && (
          <button className={css.button} onClick={handleReset}>
            Try again
          </button>
        )}
      </p>
    </div>
  );
}
