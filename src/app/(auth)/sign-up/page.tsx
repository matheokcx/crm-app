'use client'
import {useRouter} from "next/navigation";
import {useState} from "react";
import Link from "next/link";
import {GENDER} from "@/generated/prisma";
import "./style.css";
import {Gender} from "@/types";
import toast from "react-hot-toast";
import {useTranslations} from "next-intl";

// ==============================================

type formInformations = {
    name: string;
    email: string;
    password: string;
    birthdate: string;
    gender: Gender;
    country: string;
};

type inputType = {
    type: string;
    value: any;
    onChange: (event: any) => void;
    placeholder: string;
};

const SignUpPage = () => {
    const t = useTranslations();
    const [informations, setInformations] = useState<formInformations>({
        name: "",
        email: "",
        password: "",
        birthdate: new Date().toISOString().split("T")[0],
        gender: GENDER.MALE,
        country: "FRANCE",
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const inputInputs: inputType[] = [
        {
            type: "text",
            value: informations.name,
            onChange: (event: any) => {setInformations({...informations, name: event.target.value})},
            placeholder: "François Clavier"
        },
        {
            type: "email",
            value: informations.email,
            onChange: (event: any) => {setInformations({...informations, email: event.target.value})},
            placeholder: "name@domain.example"
        },
        {
            type: "password",
            value: informations.password,
            onChange: (event: any) => {setInformations({...informations, password: event.target.value})},
            placeholder: t("auth.password")
        },
        {
            type: "date",
            value: informations.birthdate,
            onChange: (event: any) => {setInformations({...informations, birthdate: event.target.value})},
            placeholder: t("birthdate")
        },
    ];
    const router = useRouter();

    const handleClick = async (): Promise<void> => {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/sign-up`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ ...informations })
        });

        if(response.ok){
            toast.success("Compte créé avec succès !");
            router.push("/sign-in");
        }
        else{
            setIsLoading(false);
            const errorMessage = await response.json();
            toast.error(errorMessage.error ?? "Une erreur est survenue lors de la création du compte.");
        }
        setIsLoading(false);
    };

    return (
        <main className="sign-up-page">
            <div className="sign-up-form">
                <h1>{t("auth.signUp")}</h1>

                {inputInputs.map((input, index) => (
                    <input type={input.type}
                           value={input.value}
                           onChange={input.onChange}
                           placeholder={input.placeholder}
                           key={index}
                           required
                    />
                ))}

                <select value={informations.gender} onChange={(event) => setInformations({...informations, gender: event.target.value as Gender})} required >
                    {Object.values(GENDER).map((gender) => (
                        <option key={gender} value={gender}>
                            {t(gender)}
                        </option>
                    ))}
                </select>

                <select value={informations.country} onChange={(event) => setInformations({...informations, country: event.target.value})} required >
                    {["FRANCE", "BELGIQUE", "SUISSE", "ESPAGNE"].map((country) => (
                        <option key={country} value={country}>
                            {country.charAt(0).toUpperCase() + country.slice(1).toLowerCase()}
                        </option>
                    ))}
                </select>

                <button onClick={async() => await handleClick()}
                        className="validateButton"
                        disabled={isLoading}
                >
                    {t("auth.signUp")}{isLoading && "..."}
                </button>
                <p>{t("auth.alreadyHaveAccountQuestion")} <Link href="/sign-in"><b>{t('auth.logIn')}</b></Link></p>
            </div>
        </main>
    );
};

export default SignUpPage;
