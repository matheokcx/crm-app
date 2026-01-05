import styles from "./chip.module.css";

// ==============================================

type ChipProps = {
    text: string;
    color?: string;
};

const Chip = ({ text, color = "hsl(140, 70%, 80%)" }: ChipProps) => {
    return (
        <div className={styles.chip} style={{ background: color }}>
            <p>{text}</p>
        </div>
    );
};

export default Chip;
