import { getClient } from "@/services/clientService";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { Client } from "@/types";
import styles from "./client-detail-page.module.css";
import Chip from "@/components/UI/Chip";
import { $Enums, ClientStatus } from "@/generated/prisma";
import GENDER = $Enums.GENDER;
import { Envelope, GenderFemale, GenderMale, Phone } from "@phosphor-icons/react/ssr";
import Separator from "@/components/UI/Separator";

// ==============================================

const ClientDetailsPage = async ({params}: {params: Promise<{id: string}>}) => {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if(!session?.user?.id){
        return <p>Vous n'êtes pas connecté ...</p>
    }

    const client: Client | null = await getClient(Number(id), Number(session.user.id));

    const calculateAge = (birthdate: Date): number => {
        const today: Date = new Date();
        let age: number = today.getFullYear() - birthdate.getFullYear();
        const monthDifference: number = today.getMonth() - birthdate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
            age--;
        }

        return age;
    };

    if(!client){
        return <p>Client non trouvé ...</p>
    }

    return (
        <main className={styles.page}>
            <div className={styles.pageHeader}>
                {client.image && <img src={client.image} alt="Client image" />}
                <div>
                    <h2>{client.firstName} {client.lastName}</h2>
                    <p>{client.job}</p>
                    <br/>
                    <Chip text={client.status} color="var(--background-light)" />
                </div>
            </div>
            <Separator widthPercent={100} />
            <div style={{ width: "100%", display: "flex", gap: "16px" }}>
                <div className={styles.contactInformation}>
                    <h3><u>Informations:</u></h3>
                    {client.gender === GENDER.MALE ?
                        (<span className={styles.contactLine}>
                        <GenderMale size={24} />
                        <p>Homme</p>
                    </span>)
                        : (<span className={styles.contactLine}>
                        <GenderFemale size={24} />
                        <p>Femme</p>
                    </span>)
                    }
                    {client.birthdate && (
                        <p>{client.birthdate.toISOString().split("T")[0]} ({calculateAge(client.birthdate)} ans)</p>
                    )}
                </div>
                {(client.mail || client.phone) && (<div className={styles.contactInformation}>
                    <h3><u>Contacts:</u></h3>
                    {client.mail && (
                        <span className={styles.contactLine}>
                        <Envelope size={24} />
                        <a href={`mailto:${client.mail}`}>{client.mail}</a>
                    </span>
                    )}
                    {client.phone && (
                        <span className={styles.contactLine}>
                        <Phone size={24} />
                        <a href={`tel:${client.phone}`}>{client.phone}</a>
                    </span>
                    )}
                </div>)}
            </div>

            {client.links.length > 0 && (
                <div className={styles.contactInformation}>
                    <h3><u>Liens:</u></h3>
                    {client.links.map((link: string, index: number) => (
                        <a key={index} href={link} target="_blank">
                            {link}
                        </a>
                    ))}
                </div>
            )}
        </main>
    );
};

export default ClientDetailsPage;
