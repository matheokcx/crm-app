import styles from "./clients-page.module.css";
import { getAllClients } from "@/app/(home)/action";
import { Client } from "@/types";
import ClientCard from "@/components/UI/Cards/ClientCard";

// ==============================================

const ClientsPage = async () => {
    const clients: Client[] = await getAllClients();

    return (
      <section className={styles.clientsPage}>
        <h1 style={{paddingBottom: "24px"}}>Liste de vos clients:</h1>
        <div className={styles.clientsList}>
            {clients.map((client: Client, index: number) => <ClientCard key={index} client={client} />)}
        </div>
      </section>
    );
};

export default ClientsPage;
