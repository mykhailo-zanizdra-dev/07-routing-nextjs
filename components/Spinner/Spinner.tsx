import css from './Spinner.module.css';
import clsx from 'clsx';

type Size = 'small' | 'medium' | 'large';

interface SizeProps {
  size?: Size;
  className?: string;
}

function Spinner({ size = 'medium', className = '' }: SizeProps) {
  const spinnerClassName = clsx(css.loader, {
    [css.small]: size === 'small',
    [css.medium]: size === 'medium',
    [css.large]: size === 'large',
    [className]: !!className,
  });

  return <span className={spinnerClassName}></span>;
}
export default Spinner;
