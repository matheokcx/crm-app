import Link from "next/link";
import styles from "./projects-page.module.css";
import { Plus } from "@phosphor-icons/react/ssr";
import {getAllUserProjects} from "@/services/projectService";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth/next";
import { Project } from "@/types";
import ProjectCard from "@/components/UI/Cards/ProjectCard";

// ==============================================

const ProjectListPage = async () => {
    const session = await getServerSession(authOptions);

    if(!session?.user?.id) {
        return <p>Vous n'êtes pas connecté...</p>
    }

    const projects: Project[] = await getAllUserProjects({}, Number(session.user.id), false);

    return (
        <section className={styles.pageSection}>
            <div className={styles.pageHeader}>
                <h1>Répertoire de vos projets</h1>
                <button>
                    <Plus size={24} weight="bold" />
                    <Link href="/projects/create">Créer</Link>
                </button>
            </div>

            <div className={styles.projectList}>
                {projects.map((project: Project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
};

export default ProjectListPage;
