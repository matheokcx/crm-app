export type InputProps = {
    type: "text" | "number" | "password" | "mail" | "tel" | "date" | "file" | "hidden";
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    defaultValue?: any;
};

const Input = ({type, name, label, placeholder, required = true, defaultValue}: InputProps) => {
    const isHidden: boolean = type === "hidden";

    return (
        <div style={{ display: "grid", width: "100%", gap: "6px" }}>
            {!isHidden && <label htmlFor={name}>{label}{required && "*"}</label>}
            <input type={type}
                   name={name}
                   id={name}
                   placeholder={placeholder}
                   required={required}
                   defaultValue={defaultValue}
                   style={{ width: "100%" }}
            />
        </div>
    );
};

export default Input;
