import {createProject} from "@/app/(home)/projects/create/action";
import styles from "./project-create-page.module.css";
import Input from "@/components/UI/Input";
import {Client} from "@/types";
import {getAllUserClients} from "@/services/clientService";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import {ProjectDifficulty} from "@/generated/prisma";
import {getTranslations} from "next-intl/server";

// ==============================================

const ProjectCreatePage = async () => {
    const today: string = new Date().toISOString().split("T")[0];
    const tomorrow: string = (new Date(Date.now() + 86400)).toISOString().split("T")[0];
    const session = await getServerSession(authOptions);
    const t = await getTranslations();

    if(!session?.user){
        return <p>Vous devez être connecté</p>;
    }

    const userClients: Client[] = await getAllUserClients({}, Number(session.user.id));

    return (
        <form action={createProject} className={styles.projectForm}>
            <Input type="text" label="Titre" name="title"/>
            <Input type="text" label="Description" name="description"/>
            <Input type="number" label="Coût" name="cost" placeholder="5000" />
            <Input type="date" label="Date début" name="startDate" defaultValue={today} />
            <Input type="date" label="Date fin" name="endDate" defaultValue={tomorrow} />
            <Input type="file" label="Couverture du projet" name="cover" required={false} />
            <Input type="hidden" label="Projet parent" name="parentProjectId" required={false} defaultValue={null} />

            <select name="clientId">
                {userClients.map((client: Client) => (
                    <option key={client.id} value={client.id}>{client.firstName} {client.lastName}</option>
                ))}
            </select>

            <select name="difficulty">
                {(Object.keys(ProjectDifficulty) as Array<keyof typeof ProjectDifficulty>).map((key) => (
                    <option key={key} value={key}>{t(`projects.difficulties.${key}`)}</option>
                ))}
            </select>

            <button type="submit">Créer</button>
        </form>
    );
};

export default ProjectCreatePage;
