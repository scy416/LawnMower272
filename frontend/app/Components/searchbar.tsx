import React, { useState, useEffect } from 'react';

interface GenericSearchProps {
  placeholder: string;
  buttonText: string;
  onSelect: (value: string) => void;
  fetchSuggestions: (query: string) => Promise<string[]>;
  containerClassName?: string;
  formClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

export default function GenericSearch({ 
  placeholder, 
  buttonText, 
  onSelect, 
  fetchSuggestions,
  containerClassName = "",
  formClassName = "",
  inputClassName = "",
  buttonClassName = ""
}: GenericSearchProps) {
  
  const [inputValue, setInputValue] = useState<string>('');
  const [results, setResults] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!inputValue.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const data = await fetchSuggestions(inputValue);
        setResults(data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, fetchSuggestions]);

  const handleSelect = (item: string) => {
    setInputValue(item);
    setShowDropdown(false);
  };

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSelect(inputValue.trim());
      setInputValue(''); 
    }
  };

  return (
    <div className={containerClassName} style={{ position: 'relative', width: '100%', maxWidth: '400px', marginLeft: 'auto' }}>
      <form onSubmit={submitForm} className={formClassName}>
        <input 
          type="text" 
          placeholder={placeholder} 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)} 
          required 
          className={inputClassName}
        />
        <button type="submit" className={buttonClassName}>
          {buttonText}
        </button>
      </form>
      
      {showDropdown && results.length > 0 && (
        <ul style={{
          position: 'absolute', top: '100%', left: 0, right: '100px',
          backgroundColor: 'white', border: '1px solid #e2e8f0',
          borderRadius: '6px', listStyle: 'none', padding: 0, margin: '4px 0 0 0',
          maxHeight: '200px', overflowY: 'auto', zIndex: 10,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
          {results.map(item => (
            <li
              key={item}
              onMouseDown={() => handleSelect(item)}
              style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', color: 'black' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}