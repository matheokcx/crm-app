import HomeSideBar from "@/components/Layout/HomeSideBar";

// ==============================================

const HomeLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <main style={{width:'100%', height:'100%', display: "flex"}}>
            <HomeSideBar />
            {children}
        </main>
    );
};

export default HomeLayout;
