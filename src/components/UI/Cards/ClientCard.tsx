"use client"
import styles from "./client-card.module.css";
import { Client } from "@/types";
import {Envelope, Pencil, Phone, Eye} from "@phosphor-icons/react/ssr";
import Chip from "@/components/UI/Chip";
import {ClientStatus} from "@/generated/prisma";
import {useRouter} from "next/navigation";

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

    const getStatusColor = (status: ClientStatus): string => {
        switch (status) {
            case ClientStatus.LEAD :
                return "hsl(27,100%,71%)";
            case ClientStatus.SIGNED :
                return "hsl(116,100%,78%)";
            case ClientStatus.ARCHIVED :
                return "hsl(0, 0%, 76%)";
            case ClientStatus.LOST :
                return "hsl(0, 100%, 70%)";
            default:
                return "hsl(0, 0%, 100%)";
        }
    };

    return (
        <div className={styles.clientCard}>
            <div style={{width: "100%", display: 'flex', gap: '5px'}}>
                {
                    client.image ? <img src={client.image}
                                        alt="Image du client"
                                        className={styles.clientCardAvatar}
                    /> : <Avatar firstName={client.firstName} lastName={client.lastName} />
                }
                <div className={styles.mainInformation}>
                    <h3>{client.firstName} {client.lastName}</h3>
                    <label style={{
                        textOverflow: "ellipsis", textWrap: "nowrap" }}>{client.job}</label>
                    <Chip text={client.status} color={getStatusColor(client.status)} />
                </div>
            </div>
            <hr/>
            <div className={styles.clientInformation}>
                { client.mail && <span className={styles.contactLine}><Envelope size={24} /><p>{client.mail}</p></span>}
                { client.phone && <span className={styles.contactLine}><Phone size={24} /><p>{client.phone}</p></span>}
            </div>
            <div className={styles.buttonsDiv}>
                <button style={{background: "var(--secondary)", borderWidth: 0}}><Pencil size={24} /> Modifier</button>
                <button style={{background: "var(--primary)", borderWidth: 0}} onClick={() => router.push(`/clients/${client.id}`)}><Eye size={24} /> Détails</button>
            </div>
        </div>
    );
};

export default ClientCard;
