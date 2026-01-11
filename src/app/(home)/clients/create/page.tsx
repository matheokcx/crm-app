import { createClient } from "@/app/(home)/clients/create/action";
import styles from "./client-create-page.module.css";
import { GENDER, ClientStatus } from "@/generated/prisma";
import { Gender } from "@/types";
import Separator from "@/components/UI/Separator";
import Input, {InputProps} from "@/components/UI/Input";

// ==============================================

const ClientCreatePage = () => {
    const inputs: InputProps[] = [
        { type: "text", name: "firstName", label: "Prénom", placeholder: "Alex" },
        { type: "text", name: "lastName", label: "Nom", placeholder: "Dubois" },
        { type: "text", name: "job", label: "Poste", placeholder: "CEO de l'entreprise" },
        { type: "date", name: "birthdate", label: "Date de naissance", defaultValue: new Date().toISOString().split("T")[0], required: false },
        { type: "mail", name: "mail", label: "Mail", placeholder: "alex.dubois@example.com", required: false },
        { type: "tel", name: "phone", label: "Téléphone", placeholder: "0707070707", required: false }
    ];

    return (
        <form action={createClient} className={styles.page}>
            <h1>Ajout d'un client</h1>
            <Separator widthPercent={30} />
            <i style={{opacity: 50, color: "orange"}}>* : Requis</i>

            {inputs.map((input) => (
                <Input key={input.name} {...input} />
            ))}

            <label htmlFor="image">Photo: </label>
            <input type="file" name="image" id="image" />
            <label htmlFor="image" style={{opacity: 50}}><i>uniquement png, webp et jpeg</i></label>

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
