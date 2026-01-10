import { createClient } from "@/app/(home)/clients/create/action";
import styles from "./client-create-page.module.css";
import { GENDER, ClientStatus } from "@/generated/prisma";
import { Gender } from "@/types";
import Separator from "@/components/UI/Separator";

// ==============================================

const ClientCreatePage = () => {
    return (
        <form action={createClient} className={styles.page}>
            <h1>Ajout d'un client</h1>
            <Separator widthPercent={30} />
            <label htmlFor="firstName">Prénom: (*)</label>
            <input type="text" name="firstName" id="firstName" placeholder="Alex" required />

            <label htmlFor="lastName">Nom: (*)</label>
            <input type="text" name="lastName" id="lastName" placeholder="Dubois" required />

            <label htmlFor="job">Poste: (*)</label>
            <input type="text" name="job" id="job" placeholder="CEO de l'entreprise" required />

            <label htmlFor="birthdate">Date de naissance: </label>
            <input type="date" name="birthdate" id="birthdate" defaultValue={new Date().toISOString().split("T")[0]} />

            <label htmlFor="mail">Mail: </label>
            <input type="mail" name="mail" id="mail" placeholder="alex.dubois@example.com" />

            <label htmlFor="phone">Téléphone: </label>
            <input type="phone" name="phone" id="phone" placeholder="0707070707" />

            <label htmlFor="image">Photo: </label>
            <input type="file" name="image" id="image" />
            <label htmlFor="image"><i>uniquement png, webp et jpeg</i></label>

            <label htmlFor="gender">Sex: (*)</label>
            <select name="gender" id="gender" required>
                {Object.values(GENDER).map((gender: Gender) => (
                    <option key={gender} value={gender}>
                        {gender}
                    </option>
                ))}
            </select>

            <label htmlFor="status">Status: </label>
            <select name="status" id="status">
                {Object.values(ClientStatus).map((status: ClientStatus) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>

                <button style={{width: "fit-content", background: "var(--primary)"}} type="submit">Créer</button>
        </form>
    );
};

export default ClientCreatePage;
