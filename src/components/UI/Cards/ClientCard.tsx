"use client"
import styles from "./client-card.module.css";
import { Client } from "@/types";
import { Pencil, Eye } from "@phosphor-icons/react/ssr";
import Chip from "@/components/UI/Chip";
import { useRouter } from "next/navigation";
import Separator from "@/components/UI/Separator";

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
        <h3 className={styles.clientCardAvatar}>{lastName.slice(0, 2)} {firstName.slice(0, 1)}.</h3>
    );
};

const ClientCard = ({ client }: ClientCard) => {
    const router = useRouter();

    return (
        <div className={styles.clientCard}>
            <div className={styles.cardHeader}>
                {
                    client.image ? <img src={client.image} alt="Image du client" className={styles.clientCardAvatar} />
                        : <Avatar firstName={client.firstName} lastName={client.lastName} />
                }
                <div className={styles.mainInformation}>
                    <div className={styles.clientInformation}>
                        <h3>{client.firstName} {client.lastName}</h3>
                        <label style={{textOverflow: "ellipsis", textWrap: "nowrap" }}>{client.job}</label>
                    </div>
                    <Chip text={client.status} color="var(--background-light)" width="20%"/>
                </div>
            </div>
            <Separator widthPercent={100} />
            <div className={styles.buttonsDiv}>
                <button style={{width: "100%", background: "var(--secondary)", borderWidth: 0}}>
                    <Pencil size={24} />
                    Modifier
                </button>
                <button style={{width: "100%", background: "var(--primary)", borderWidth: 0}}
                        onClick={() => router.push(`/clients/${client.id}`)}
                >
                    <Eye size={24} />
                    Détails
                </button>
            </div>
        </div>
    );
};

export default ClientCard;
