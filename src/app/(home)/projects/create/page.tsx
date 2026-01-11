import { createProject } from "@/app/(home)/projects/create/action";
import styles from "./project-create-page.module.css";
import Input from "@/components/UI/Input";

// ==============================================

const ProjectCreatePage = () => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = (new Date(Date.now() + 86400)).toISOString().split("T")[0];

    return (
        <form action={createProject}>
            <Input type="text" label="Titre" name="title" placeholder="Application de tri des mails" />
            <Input type="text" label="Description" name="description" placeholder="Une application permettant ..." />
            <Input type="number" label="Coût" name="cost" placeholder="5000" />
            <Input type="date" label="Titre" name="title" placeholder="Application de tri des mails" defaultValue={today} />
            <Input type="date" label="Titre" name="title" placeholder="Application de tri des mails" defaultValue={tomorrow} />

            <button type="submit">Créer</button>
        </form>
    );
};

export default ProjectCreatePage;
