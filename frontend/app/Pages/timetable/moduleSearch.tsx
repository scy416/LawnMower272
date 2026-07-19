import React, { useState } from 'react';
import styles from './timetable.module.css';

interface ModuleSearchProps {
  onAddModule: (moduleCode: string) => void;
}

const AVAILABLE_MODULES = [
  "CS1010S", "CS1101S", "CS1231S", "CS2030S", "CS2040S",
  "CS2100", "CS2101", "CS2103T", "CS2105", "CS2106", 
  "CS2109S", "CS3230", "CS3243", "CS3244", "CS4231", 
  "IS1108", "IS2218", "IS3103", "BT1101", "BT2102", 
  "CP2106", "MA1521", "ST2334"
];

export default function ModuleSearch({ onAddModule }: ModuleSearchProps) {
  const [moduleInput, setModuleInput] = useState<string>('');
  const [filteredModules, setFilteredModules] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setModuleInput(userInput);

    if (userInput.trim() === '') {
      setFilteredModules([]);
      setShowDropdown(false);
    } else {
      const lowercasedInput = userInput.toLowerCase();
      const matches = AVAILABLE_MODULES.filter(mod =>
        mod.toLowerCase().includes(lowercasedInput)
      );
      setFilteredModules(matches);
      setShowDropdown(true);
    }
  };

  const handleSelectModule = (mod: string) => {
    setModuleInput(mod);
    setShowDropdown(false);
  };

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (moduleInput.trim()) {
      onAddModule(moduleInput.trim());
      setModuleInput('');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '400px', marginLeft: 'auto'}}>
      <form onSubmit={submitForm} className={styles['module-form']}>
        <input 
          type="text" 
          placeholder="Enter Module Code" 
          value={moduleInput} 
          onChange={handleInputChange} 
          onFocus={() => { if (moduleInput) setShowDropdown(true); }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)} 
          required 
          className={styles['module-input']}
        />
        <button type="submit" className={styles['btn-add']}>Add Module</button>
      </form>

      {showDropdown && filteredModules.length > 0 && (
        <ul style={{
          position: 'absolute', top: '100%', left: 0, right: '100px',
          backgroundColor: 'white', border: '1px solid #e2e8f0',
          borderRadius: '6px', listStyle: 'none', padding: 0, margin: '4px 0 0 0',
          maxHeight: '200px', overflowY: 'auto', zIndex: 10,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
          {filteredModules.map(mod => (
            <li
              key={mod}
              onMouseDown={() => handleSelectModule(mod)}
              style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', color: 'black' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {mod}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}