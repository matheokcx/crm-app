import styles from "./project-card.module.css";
import { Project } from "@/types";
import {CalendarDot, CalendarCheck, ArrowRight} from "@phosphor-icons/react/ssr";

// ==============================================

type ProjectCardProps = {
    project: Project;
};

const ProjectCard = ({project}: ProjectCardProps) => {
    return (
        <div className={styles.projectCard}>
            <span className={styles.title}>
                <h3>{project.title}</h3>
                <p>({project.cost}€)</p>
            </span>
            <p>{project.description}</p>
            <div className={styles.dates}>
                <CalendarDot size={24} />
                <p>{project.startDate.toISOString().split("T")[0]}</p>
                <ArrowRight />
                <CalendarCheck size={24} />
                <p>{project.endDate.toISOString().split("T")[0]}</p>
            </div>
        </div>
    );
};

export default ProjectCard;
