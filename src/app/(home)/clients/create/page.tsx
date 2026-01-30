import {createClient} from "@/app/(home)/clients/create/action";
import styles from "./client-create-page.module.css";
import {ClientStatus, GENDER} from "@/generated/prisma";
import {Gender} from "@/types";
import Separator from "@/components/UI/Separator";
import Input, {InputProps} from "@/components/UI/Input";
import {getTranslations} from "next-intl/server";

// ==============================================

const ClientCreatePage = async () => {
    const t = await getTranslations();
    const inputs: InputProps[] = [
        { type: "text", name: "firstName", label: t("firstName"), placeholder: "Alex" },
        { type: "text", name: "lastName", label: t("lastName"), placeholder: "Dubois" },
        { type: "text", name: "job", label: t("job"), placeholder: "CEO de l'entreprise" },
        { type: "date", name: "birthdate", label: t("birthdate"), defaultValue: new Date().toISOString().split("T")[0], required: false },
        { type: "mail", name: "mail", label: "Mail", placeholder: "alex.dubois@example.com", required: false },
        { type: "tel", name: "phone", label: t("phone"), placeholder: "0707070707", required: false }
    ];

    return (
        <form action={createClient} className={styles.page}>
            <h1>{t('clients.createPage.title')}</h1>
            <Separator widthPercent={30} />
            <i style={{opacity: 50, color: "orange"}}>* : {t('required')}</i>

            {inputs.map((input: InputProps) => (
                <Input key={input.name} {...input} />
            ))}

            <label htmlFor="image">{t("photo")}: </label>
            <input type="file" name="image" id="image" />
            <label htmlFor="image" style={{opacity: 50}}><i>{t("clients.createPage.fileRequirements")}</i></label>

            <label htmlFor="gender">Sex: (*)</label>
            <select name="gender" id="gender" required>
                {Object.values(GENDER).map((gender: Gender) => (
                    <option key={gender} value={gender}>
                        {t(gender)}
                    </option>
                ))}
            </select>

            <label htmlFor="status">{t("status")}: </label>
            <select name="status" id="status">
                {Object.values(ClientStatus).map((status: ClientStatus) => (
                    <option key={status} value={status}>
                        {t(`clients.status.${status}`)}
                    </option>
                ))}
            </select>

            <button style={{width: "fit-content", background: "var(--primary)"}} type="submit">{t('create')}</button>
        </form>
    );
};

export default ClientCreatePage;
