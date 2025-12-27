'use client'
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import "./style.css";
import { JSX } from "react";
import { Stack } from "@phosphor-icons/react";

// ==============================================


const HomeHeader = () => {
    const { status } = useSession();
    const links: {link: string, title: JSX.Element | string}[] = [
        {link: "/", title: <img src="/logo.svg" />},
        {link: "/", title: "Accueil"}
    ];
    const isAuthenticated: boolean = status === 'authenticated';

    return (
        <header className="homeHeader">
            <nav>
                {links.map((link, index: number) => <Link key={index} href={link.link}>{link.title}</Link>)}
            </nav>

            <div className="buttonsSection">
                {isAuthenticated ? (
                    <>
                        <button><Link href="/">Profil</Link></button>
                        <button onClick={() => signOut()}
                                style={{background: "hsl(0, 50%, 50%)", border: 0}}
                        >
                            Déconnexion
                        </button>
                    </>
                ) : (
                    <>
                        <button className="signInButton"><Link href="/sign-in">Connexion</Link></button>
                        <button className="signUpButton"><Link href="/sign-up">Inscription</Link></button>
                    </>
                )}
            </div>
        </header>
    );
};

export default HomeHeader;
