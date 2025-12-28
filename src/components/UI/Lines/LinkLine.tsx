import { JSX } from "react";
import { useRouter } from "next/navigation";

// ==============================================


type LinkLineProps = {
    icon: JSX.Element
    title: string;
    link: string;
};

const LinkLine = ({icon, title, link}: LinkLineProps) => {
    const router = useRouter();

    return (
        <div onClick={e => router.push(link)}
             style={{
                 display: "flex",
                 gap: "10px",
                 alignItems: "center",
        }}>
            {icon}
            <p>{title}</p>
        </div>
    );
};

export default LinkLine;
