import css from './SearchBox.module.css';

interface SearchBoxProps {
  searchQuery: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function SearchBox({ searchQuery, handleChange }: SearchBoxProps) {
  return (
    <input
      defaultValue={searchQuery}
      onChange={handleChange}
      className={css.input}
      type="text"
      placeholder="Search notes"
    />
  );
}

export default SearchBox;
