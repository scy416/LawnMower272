interface Props{
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    outerStyle?: string;
    innerStyle?: string;
}

export default function InputBox({ label, value, onChange, placeholder, type = "text", outerStyle, innerStyle}: Props) {
    return (
        <div className={outerStyle} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>{label}</label>
            <input
                className={innerStyle}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}