import { ClientNote } from "@/types";
import styles from "./client-note-section.module.css";

// ==============================================

type ClientNotesSectionProps = {
    clientNotes: ClientNote[];
};

const ClientNotesSection = ({clientNotes}: ClientNotesSectionProps) => {
    return (
        <section className={styles.clientNotesSection}>
            <h3>Vos notes à propos:</h3>
            {clientNotes.map((clientNote) => (
                <div key={clientNote.id} className={styles.clientNoteCard}>
                    <p>{clientNote.text}</p>
                    <p style={{opacity: "50%"}}>Le {clientNote.createdAt.toISOString().split("T")[0]}</p>
                </div>
            ))}
        </section>
    );
};

export default ClientNotesSection;
