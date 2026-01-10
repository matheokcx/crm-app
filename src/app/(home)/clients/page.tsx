import styles from "./clients-page.module.css";
import { getAllClients } from "@/app/(home)/action";
import { Client } from "@/types";
import ClientCard from "@/components/UI/Cards/ClientCard";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react/ssr";

// ==============================================

const ClientsPage = async () => {
    const clients: Client[] = await getAllClients();

    return (
      <section className={styles.clientsPage}>
        <div className={styles.topPage}>
            <h1 style={{paddingBottom: "24px"}}>Liste de vos clients:</h1>
            <button className={styles.addButton}>
                <Plus size={24} />
                <Link href="/clients/create">Ajouter</Link>
            </button>
        </div>

        <div className={styles.clientsList}>
            {clients.map((client: Client, index: number) => <ClientCard key={index} client={client} />)}
        </div>
      </section>
    );
};

export default ClientsPage;
