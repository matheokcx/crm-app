import {getProject} from "@/services/projectService";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth/next";
import Input from "@/components/UI/Input";
import {updateProject} from "@/app/(home)/projects/[id]/actions";
import {getFormattedDate} from "@/utils/utils";
import styles from "./edit-project-page.module.css";
import {Client} from "@/types";
import {getAllUserClients} from "@/services/clientService";
import {ProjectDifficulty} from "@/generated/prisma";
import {getTranslations} from "next-intl/server";

const EditProjectPage = async ({ params }: { params: Promise<{ id: string}>}) => {
    const { id } = await params;
    const t = await getTranslations();
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return <p>Vous devez être connecté</p>;
    }

    const userClients: Client[] = await getAllUserClients({}, Number(session.user.id));
    const project = await getProject(Number(id), Number(session.user.id));

    if(!project){
        return <p>Projet non trouvé.</p>;
    }

    return (
        <form action={updateProject} className={styles.editForm}>
            <Input type="hidden" name="projectId" label="projectId" defaultValue={id} />

            <Input type="text" name="title" label="Titre" defaultValue={project.title} />
            <Input type="text" name="description" label="Description" defaultValue={project.description} />
            <Input type="number" name="earn" label="Gain" defaultValue={project.cost} />
            <Input type="date" name="startDate" label="Date de début" defaultValue={getFormattedDate(project.startDate)} />
            <Input type="date" name="endDate" label="Date de fin" defaultValue={getFormattedDate(project.endDate)} />

            <select name="clientId" defaultValue={project.clientId}>
                {userClients.map((client: Client) => <option key={client.firstName} value={client.id}>{client.firstName} {client.lastName}</option>)}
            </select>

            <select name="difficulty" defaultValue={project.difficulty}>
                {(Object.keys(ProjectDifficulty) as Array<keyof typeof ProjectDifficulty>).map((key) => (
                    <option key={key} value={key}>{t(`projects.difficulties.${key}`)}</option>
                ))}
            </select>
            
            <button type="submit">{t("edit")}</button>
        </form>
    );
};

export default EditProjectPage;
