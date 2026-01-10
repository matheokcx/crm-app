import styles from "./chip.module.css";

// ==============================================

type ChipProps = {
    text: string;
    color?: string;
    width?: string;
};

const Chip = ({ text, color = "hsl(140, 70%, 80%)", width = "fit-content" }: ChipProps) => {
    return (
        <div className={styles.chip} style={{ background: color, width: width }}>
            <p>{text}</p>
        </div>
    );
};

export default Chip;
