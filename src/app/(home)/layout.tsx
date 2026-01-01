import HomeSideBar from "@/components/Layout/HomeSideBar";

// ==============================================

const HomeLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <>
            <HomeSideBar />
            {children}
        </>
    );
};

export default HomeLayout;
