import { getClient } from "@/services/clientService";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { Client } from "@/types";
import styles from "./client-detail-page.module.css";
import Chip from "@/components/UI/Chip";
import {$Enums, ClientStatus} from "@/generated/prisma";
import GENDER = $Enums.GENDER;
import {Envelope, GenderFemale, GenderMale, Phone} from "@phosphor-icons/react/ssr";

// ==============================================

const calculateAge = (birthdate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }

    return age;
};

const ClientDetailsPage = async ({params}: {params: Promise<{id: string}>}) => {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if(!session?.user?.id){
        return <p>Vous n'êtes pas connecté ...</p>
    }

    const client: Client | null = await getClient(Number(id), Number(session.user.id));

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

    if(!client){
        return <p>Client non trouvé ...</p>
    }

    return (
        <main className={styles.page}>
            {client.image && <img src={client.image} alt="Client image" style={{ width: "10%", borderRadius: "12px" }} />}
            <h2>
                {client.firstName}
                {client.lastName}
                {client.gender === GENDER.MALE ? <GenderMale /> : <GenderFemale />}
            </h2>
            <p>{client.job}</p>
            <Chip text={client.status} color={getStatusColor(client.status)} />
            {client.birthdate && <p>{calculateAge(client.birthdate)} ans</p>}
            <div className={styles.contactInformation}>
                {client.mail && <p><Envelope />{client.mail}</p>}
                {client.phone && <p><Phone />{client.phone}</p>}
                {client.links.map((link: string, index: number) => <a key={index} href={link}>{link}</a>)}
            </div>
        </main>
    );
};

export default ClientDetailsPage;
