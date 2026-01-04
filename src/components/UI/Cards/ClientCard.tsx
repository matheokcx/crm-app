import styles from "./client-card.module.css";
import { Client } from "@/types";

// ==============================================

type AvatarProps = {
    firstName: string;
    lastName: string;
};

type ClientCard = {
    client: Client;
};

const Avatar = ({ firstName, lastName }: AvatarProps) => {
    return (
        <h2 className={styles.clientCardAvatar}>{lastName.slice(0, 2)} {firstName.slice(0, 1)}.</h2>
    );
};

const ClientCard = ({ client }: ClientCard) => {
    return (
        <div className={styles.clientCard}>
            {
                client.image ? <img src="" alt="Image du client" /> : <Avatar firstName={client.firstName} lastName={client.lastName} />
            }
            <div className={styles.clientInformation}>
                <h2>{client.firstName} {client.lastName}</h2>
                <label>{client.job}</label>
            </div>

        </div>
    );
};

export default ClientCard;
