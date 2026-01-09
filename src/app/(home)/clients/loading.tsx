import Skeleton from "@/components/UI/Skeleton";
import styles from "@/app/(home)/clients/clients-page.module.css";

// ==============================================

const Loading = () => {
    return (
         <section className={styles.clientsPage}>
            <h1 style={{paddingBottom: "24px"}}>Liste de vos clients:</h1>
            <div className={styles.clientsList}>
                {Array.from({length: 12}).map((_, index: number) => (
                    <Skeleton key={index} width="30%" height="250px"/>
                ))}
            </div>
        </section>
    );
};

export default Loading;
