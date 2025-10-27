'use client';
import clsx from 'clsx';
import Link from 'next/link';
import css from './SidebarNotes.module.css';
import { noteTags } from '@/types/note';
import { useParams } from 'next/navigation';

function SidebarNotes() {
  const { slug: [tag] = [] } = useParams();
  const currentTag = (tag || 'all').toLowerCase();

  return (
    <ul className={css.menuList}>
      <li
        className={clsx(css.menuItem, {
          [css.menuLinkActive]: currentTag === 'all',
        })}
      >
        <Link href={`/notes/filter/all`} className={css.menuLink}>
          All notes
        </Link>
      </li>
      {noteTags.map(tag => (
        <li
          key={tag}
          className={clsx(css.menuItem, {
            [css.menuLinkActive]: currentTag === tag.toLowerCase(),
          })}
        >
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default SidebarNotes;
