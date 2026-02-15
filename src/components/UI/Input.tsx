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
        <>
            {!isHidden && <label htmlFor={name}>{label}{required && "*"}</label>}
            <input type={type}
                   name={name}
                   id={name}
                   placeholder={placeholder}
                   required={required}
                   defaultValue={defaultValue}
            />
        </>
    );
};

export default Input;
