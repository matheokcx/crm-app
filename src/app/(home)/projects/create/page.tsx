import {createProject} from "@/app/(home)/projects/create/action";
import styles from "./project-create-page.module.css";
import Input, {InputProps} from "@/components/UI/Input";
import {Client} from "@/types";
import {getAllUserClients} from "@/services/clientService";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import {ProjectDifficulty} from "@/generated/prisma";
import {getTranslations} from "next-intl/server";
import Separator from "@/components/UI/Separator";



const ProjectCreatePage = async () => {
    const today: string = new Date().toISOString().split("T")[0];
    const tomorrow: string = (new Date(Date.now() + 86400)).toISOString().split("T")[0];
    const session = await getServerSession(authOptions);
    const t = await getTranslations();
    const inputsData: InputProps[] = [
        {type: "text", name: "title", label: t('title'), placeholder: "Projet de refonte site web", required: true},
        {type: "text", name: "description", label: t('description'), placeholder: "Projet de restructuration des sections de la page...", required: true},
        {type: "number", name: "cost", label: t('gain'), placeholder: "1000", required: true},
        {type: "date", name: "startDate", label: t('startDate'), defaultValue: today, required: true},
        {type: "date", name: "endDate", label: t('endDate'), defaultValue: tomorrow, required: true},
        {type: "file", name: "cover", label: t('cover'), required: false},
        {type: "hidden", name: "parentProjectId", label: t('projects.parentProject'), required: false}
    ];

    if(!session?.user){
        return <p>Vous devez être connecté</p>;
    }

    const userClients: Client[] = await getAllUserClients({}, Number(session.user.id));

    return (
        <form action={createProject} className={styles.projectForm}>
            <h1>{t('projects.createPage.title')}</h1>
            <Separator widthPercent={30} />
            <i className={styles.requiredInfoText}>* : {t('required')}</i>

            {inputsData.map((input: InputProps) => <Input key={input.name} {...input} />)}

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

            <button className={styles.validateFormButton} type="submit">{t('create')}</button>
        </form>
    );
};

export default ProjectCreatePage;
