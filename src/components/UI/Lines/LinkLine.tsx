import {JSX} from "react";
import {useRouter} from "next/navigation";
import styles from "./link-line.module.css";

// ==============================================


type LinkLineProps = {
    icon: JSX.Element
    title: string;
    link: string;
};

const LinkLine = ({icon, title, link}: LinkLineProps) => {
    const router = useRouter();

    return (
        <div onClick={e => router.push(link)} className={styles.linkLine}>
            {icon}
            <p>{title}</p>
        </div>
    );
};

export default LinkLine;
