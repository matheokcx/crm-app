"use client"
import {useRouter} from "next/navigation";
import {useState} from "react";
import Link from "next/link";
import "./style.css";
import {signIn} from "next-auth/react";
import toast from "react-hot-toast";
import {useTranslations} from "next-intl";

// ==============================================


const SignInPage = () => {
    const router = useRouter();
    const t = useTranslations();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSignIn = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        const response = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false
        });

        if (response?.ok) {
            toast.success("Connexion réussi !");
            router.push("/");
        }
        else {
            toast.error("Mail ou mot de passe incorrect");
        }
    };

    return (
        <main className="sign-in-page">
            <form onSubmit={handleSignIn} className="sign-in-form" >
                <h1>{t('auth.logIn')}</h1>

                <input type="email"
                       placeholder="name@domain.example"
                       value={email}
                       onChange={(event) => setEmail(event.target.value)}
                />
                <input type="password"
                       placeholder={t('auth.password')}
                       value={password}
                       onChange={(event) => setPassword(event.target.value)}
                />

                <button type="submit" className="validateButton">{t('auth.connect')}</button>
                <p>{t("auth.dontHaveAccountQuestion")} <Link href="/sign-up"><b>{t('auth.signUp')}</b></Link></p>
            </form>
        </main>
    );
};

export default SignInPage;
