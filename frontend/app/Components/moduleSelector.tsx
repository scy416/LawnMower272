import styles from "~/Pages/userProfile/userProfile.module.css";
import SearchBox from "./searchBox";

interface ModuleSelectorProps {
    label: string;
    modules: string[];
    onAdd: (mod: string) => void;
    onRemove: (mod: string) => void;
    fetchSuggestions: (query: string) => Promise<string[]>;
}

export function ModuleSelector({ label, modules, onAdd, onRemove, fetchSuggestions }: ModuleSelectorProps) {
    return (
        <div className={styles["field"]}>
            <label className={styles["label"]}>{label}</label>
            <SearchBox 
                placeholder="Search to add a module..."
                buttonText="Add"
                fetchSuggestions={fetchSuggestions}
                onSelect={(val) => onAdd(val.toUpperCase())}
                
                containerClassName={styles["sb-container"]}
                formClassName={styles["sb-form"]}
                inputClassName={styles["input"]}
                buttonClassName={styles["save-btn"]}
            />
            <div className={styles["pill-container"]}>
                {modules.map(mod => (
                    <div key={mod} className={styles["pill"]}>
                        {mod}
                        <button 
                            className={styles["pill-remove"]}
                            onClick={() => onRemove(mod)}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}