"use server";
import {updateClient} from "@/app/(home)/clients/[id]/update/action";
import {prismaClient} from "@/lib/prisma";
import Input, {InputProps} from "@/components/UI/Input";
import {getTranslations} from "next-intl/server";
import styles from "./update-client-page.module.css";
import Separator from "@/components/UI/Separator";
import {ClientStatus, GENDER} from "@/generated/prisma";
import {Gender} from "@/types";

const UpdateClientPage = async ({ params }: { params: Promise<{ id: string}>}) => {
    const { id } = await params;
    const t = await getTranslations();
    const client = await prismaClient.client.findUnique({
        where: {
            id: Number(id)
        }
    })

    if(!client) {
        return <p>Ce client n'a pas été trouvé</p>;
    }

    const inputs: InputProps[] = [
        { type: "text", name: "firstName", label: t("firstName"), placeholder: "Alex", defaultValue: client.firstName },
        { type: "text", name: "lastName", label: t("lastName"), placeholder: "Dubois", defaultValue: client.lastName },
        { type: "text", name: "job", label: t("job"), placeholder: "CEO de l'entreprise", defaultValue: client.job },
        { type: "date", name: "birthdate", label: t("birthdate"), defaultValue: client.birthdate ? client.birthdate : new Date().toISOString().split("T")[0], required: false },
        { type: "mail", name: "mail", label: "Mail", placeholder: "alex.dubois@example.com", required: false, defaultValue: client.mail },
        { type: "tel", name: "phone", label: t("phone"), placeholder: "0707070707", required: false, defaultValue: client.phone },
        { type: "hidden", name: "id", label: "id", required: false, defaultValue: client.id },
    ];

    return (
        <form action={updateClient} className={styles.form}>
            <h1>{t("clients.updatePage.title")}</h1>
            <Separator widthPercent={30} />
            <i className={styles.requiredText}>* : {t('required')}</i>

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

            <button className={styles.valideFormButton} type="submit">{t('edit')}</button></form>
    );
};

export default UpdateClientPage;
