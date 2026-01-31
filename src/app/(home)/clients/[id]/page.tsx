import {getClient} from "@/services/clientService";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth/next";
import {Client, ClientNote} from "@/types";
import styles from "./client-detail-page.module.css";
import Chip from "@/components/UI/Chip";
import {$Enums, ClientStatus} from "@/generated/prisma";
import {statusColors} from "@/lib/statusColors";
import {Envelope, GenderFemale, GenderMale, Phone} from "@phosphor-icons/react/ssr";
import Separator from "@/components/UI/Separator";
import Avatar from "@/components/UI/Avatar";
import BackButton from "@/components/UI/Buttons/BackButton";
import {getClientNotes} from "@/services/clientNoteService";
import ClientNotesSection from "@/components/Layout/Client/ClientNotesSection";
import {getTranslations} from "next-intl/server";
import GENDER = $Enums.GENDER;

// ==============================================

const ClientDetailsPage = async ({params}: {params: Promise<{id: string}>}) => {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const t = await getTranslations();

    if(!session?.user?.id){
        return <p>Vous n'êtes pas connecté ...</p>
    }

    const client: Client | null = await getClient(Number(id), Number(session.user.id));

    if(!client){
        return <p>Client non trouvé ...</p>
    }

    const clientNotes: ClientNote[] = await getClientNotes(client.id, Number(session.user.id));

    const calculateAge = (birthdate: Date): number => {
        const today: Date = new Date();
        let age: number = today.getFullYear() - birthdate.getFullYear();
        const monthDifference: number = today.getMonth() - birthdate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
            age--;
        }

        return age;
    };

    return (
        <main className={styles.page}>
            <BackButton />
            <div className={styles.pageHeader}>
                <Avatar firstName={client.firstName} lastName={client.lastName} image={client.image}/>
                <div>
                    <h2>{client.firstName} {client.lastName}</h2>
                    <p>{client.job}</p>
                    <Chip text={t(`clients.status.${client.status}`)} color={statusColors[client.status as ClientStatus]} />
                </div>
            </div>
            <Separator widthPercent={100} />
            <div className={styles.infos}>
                <div className={styles.contactInformation}>
                    <h3><u>{t("information")}:</u></h3>
                    {client.gender === GENDER.MALE ?
                        (<span className={styles.contactLine}>
                        <GenderMale size={24} />
                        <p>{t('MALE')}</p>
                    </span>)
                        : (<span className={styles.contactLine}>
                        <GenderFemale size={24} />
                        <p>{t('FEMALE')}</p>
                    </span>)
                    }
                    {client.birthdate && (
                        <p>{client.birthdate.toISOString().split("T")[0]} ({calculateAge(client.birthdate)} {t("years")})</p>
                    )}
                </div>
                {(client.mail || client.phone) && (
                    <div className={styles.contactInformation}>
                        <h3><u>{t("contacts")}:</u></h3>
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
                    </div>
                )}
            </div>

            {client.links.length > 0 && (
                <div className={styles.contactInformation}>
                    <h3><u>{t("links.links")}:</u></h3>
                    {client.links.map((link: string, index: number) => (
                        <a key={index} href={link} target="_blank">
                            {link}
                        </a>
                    ))}
                </div>
            )}
            <ClientNotesSection clientNotes={clientNotes} />
        </main>
    );
};

export default ClientDetailsPage;
