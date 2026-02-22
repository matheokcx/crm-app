import styles from "@/app/(home)/projects/projects-page.module.css";
import projectStyles from "@/components/UI/Cards/Project/project-card.module.css";
import Skeleton from "@/components/UI/Skeleton/Skeleton";
import {Plus} from "@phosphor-icons/react/ssr";
import Link from "next/link";


const Loading = () => {
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
                {Array.from({ length: 6 }).map((_, index: number) => (
                    <div key={index} className={projectStyles.projectCard} style={{ background: "rgba(204,204,204,0.52)" }}>
                        <div className={projectStyles.title}>
                            <Skeleton width="30%" height="30px" />
                        </div>
                        <div>
                            <Skeleton width="80%" height="20px" />
                            <Skeleton width="40%" height="20px" />
                        </div>
                        <div className={projectStyles.dates}>
                            <Skeleton width="15%" height="20px" />
                            <Skeleton width="15%" height="20px" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
};

export default Loading;
