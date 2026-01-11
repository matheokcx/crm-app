import styles from "@/components/UI/avatar.module.css";

// ==============================================

type AvatarProps = {
    firstName: string;
    lastName: string;
    image: string | null;
};

const Avatar = ({ firstName, lastName, image }: AvatarProps) => {
    return (
        <>
            {image ? <img src={image} alt="Image du client" className={styles.avatar} />
                : <h3 className={styles.avatar}>{lastName.slice(0, 2)} {firstName.slice(0, 1)}.</h3>
            }
        </>
    );
};

export default Avatar;
