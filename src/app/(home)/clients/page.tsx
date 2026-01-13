import styles from "./clients-page.module.css";
import { Client } from "@/types";
import ClientCard from "@/components/UI/Cards/Client/ClientCard";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react/ssr";
import { getAllUserClients } from "@/services/clientService";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

// ==============================================

const ClientsPage = async () => {
    const session = await getServerSession(authOptions);

    if(!session?.user?.id){
        return <p>Vous n'êtes pas connecté ...</p>
    }

    const clients: Client[] = await getAllUserClients({}, Number(session.user.id));

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
