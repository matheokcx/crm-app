import {InputHTMLAttributes, JSX} from "react";

export type InputProps = {
    label: string;
    icon?: JSX.Element;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({type, name, label, placeholder, required = true, defaultValue, icon}: InputProps) => {
    const isHidden: boolean = type === "hidden";

    return (
        <div style={{ display: "grid", width: "100%", gap: "10px" }}>
            {!isHidden && (
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    {icon && icon}
                    <label htmlFor={name}>{label}{required && "*"}</label>
                </div>

            )}
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
