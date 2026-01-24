'use client'
import {signOut} from "next-auth/react";
import "./style.css";
import {JSX} from "react";
import {useRouter} from "next/navigation";
import LinkLine from "@/components/UI/Lines/LinkLine";
import {Browsers, CalendarDots, House, Users} from "@phosphor-icons/react";
import LanguageButton from "@/components/UI/Buttons/LanguageButton";

// ==============================================

const HomeSideBar = () => {
    const links: {link: string, title: string, icon: JSX.Element}[] = [
        {link: "/", title: "Accueil", icon: <House size={32} weight="bold" />},
        {link: "/clients", title: "Clients", icon: <Users size={32} weight="bold" />},
        {link: "/projects", title: "Projets", icon: <Browsers size={32} weight="bold" />},
        {link: "/meetings", title: "Réunions", icon: <CalendarDots size={32} weight="bold" />}
    ];
    const router = useRouter();

    return (
        <header className="homeSideBar">
            <div onClick={() => router.push("/")} className="logo">
                <img src="/logo.svg" alt="Logo of the application" style={{width:'100px'}} />
            </div>
            <hr />

            <nav>
                {links.map((link, index: number) =>
                    <LinkLine key={index}
                              title={link.title}
                              link={link.link}
                              icon={link.icon}
                    />
                )}
            </nav>

            <div className="buttonsSection">
                <LanguageButton />
                <button onClick={() => signOut()} className="logoutButton">
                    Déconnexion
                </button>
            </div>
        </header>
    );
};

export default HomeSideBar;
