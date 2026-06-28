import styles from "./searchBar.module.css";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className={styles.container}>
      <div className={styles['input-wrapper']}>
        <span className={styles.icon}>🔍</span>
        <input
          type="text"
          placeholder="Search by name or major..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.input}
        />
      </div>
    </div>
  );
}