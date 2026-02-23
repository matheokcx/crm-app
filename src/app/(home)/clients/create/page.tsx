import {createClient} from "@/app/(home)/clients/action";
import styles from "./client-create-page.module.css";
import {ClientStatus, GENDER} from "@/generated/prisma";
import {Gender} from "@/types";
import Separator from "@/components/UI/Separator";
import Input from "@/components/UI/Input";
import {getTranslations} from "next-intl/server";
import {CloudArrowUpIcon} from "@phosphor-icons/react/ssr";


const ClientCreatePage = async () => {
    const t = await getTranslations();

    return (
        <section className={styles.page}>
            <form action={createClient} className={styles.gridForm}>
                <div style={{ gridColumn: "span 2" }}>
                    <h1>{t('clients.createPage.title')}</h1>
                    <Separator widthPercent={30} />
                </div>
                <div style={{ display: "grid", gap: "20px" }}>
                    <div className={styles.inputsLine}>
                        <Input type="text"
                               name="lastName"
                               label={t("lastName")}
                               placeholder="Dubois"
                        />
                        <Input type="text"
                               name="firstName"
                               label={t("firstName")}
                               placeholder="Alex"
                        />
                    </div>

                    <div className={styles.inputsLine}>
                        <div className={styles.selectDiv} style={{width: "50%"}}>
                            <label htmlFor="gender">Sex: (*)</label>
                            <select name="gender" id="gender" required>
                                {Object.values(GENDER).map((gender: Gender) => (
                                    <option key={gender} value={gender}>
                                        {t(gender)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Input type="date"
                               name="birthdate"
                               label={t("birthdate")}
                               defaultValue={new Date().toISOString().split("T")[0]}
                               required={false}
                        />
                    </div>

                    <Input type="text"
                           name="job"
                           label={t("job")}
                           placeholder="CEO"
                    />
                    <div className={styles.selectDiv}>
                        <label htmlFor="status">{t("status")}: </label>
                        <select name="status" id="status">
                            {Object.values(ClientStatus).map((status: ClientStatus) => (
                                <option key={status} value={status}>
                                    {t(`clients.status.${status}`)}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div className={styles.inputsLine}>
                        <Input type="mail"
                               name="mail"
                               label="Mail"
                               placeholder="alex.dubois@example.com"
                               required={false}
                        />
                        <Input type="tel"
                               name="phone"
                               label={t("phone")}
                               placeholder="0707070707"
                               required={false}
                        />
                    </div>
                    <button className={styles.valideFormButton} type="submit">{t('create')}</button>
                </div>
                <div>
                    <div className={styles.dropFileBox}>
                        <CloudArrowUpIcon size={48} />
                        <Input type="file" name="image" label="Lâcher ou choisir la photo de votre client (max 5Mo)" required={false} />
                    </div>

                </div>
            </form>
        </section>
    );
};

export default ClientCreatePage;
