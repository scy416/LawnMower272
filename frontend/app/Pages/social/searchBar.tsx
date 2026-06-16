import styles from "./searchBar.module.css";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedModule: string;
  setSelectedModule: (val: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery, selectedModule, setSelectedModule }: SearchBarProps) {
  return (
    <div className={styles.container}>
      <div className={styles['input-wrapper']}>
        <span className={styles.icon}>🔍</span>
        <input
          type="text"
          placeholder="Search by name, major, or module..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.input}
        />
      </div>
      <select 
        value={selectedModule} 
        onChange={(e) => setSelectedModule(e.target.value)}
        className={styles.select}
      >
        <option value="All">All modules</option>
        <option value="CS2030S">CS2030S</option>
        <option value="CS2040S">CS2040S</option>
      </select>
    </div>
  );
}