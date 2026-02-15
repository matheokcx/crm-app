type SeparatorProps = {
    widthPercent?: number;
};

const Separator = ({widthPercent = 50} : SeparatorProps) => {
    return (
        <>
            <hr style={{
                borderWidth: "2px",
                width: `${widthPercent}%`,
                color: "hsla(0, 0%, 70%, 50%)",
                marginBlock: "20px",
                borderRadius: "12px"
            }}/>
        </>
    );
};

export default Separator;
