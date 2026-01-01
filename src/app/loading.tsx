import Skeleton from "@/components/UI/Skeleton";

// ==============================================

const Loading = () => {
    return (
        <main style={{width: "100%"}}>
            <section>
                <div>
                    {Array.from({length: 4}).map((_, index: number) => (
                        <div key={index}>
                            <Skeleton key={index} width="100%" height="30px" />
                            <Skeleton key={index+"_2"} width="100%" height="1500px" />
                        </div>
                    ))}
                </div>
                <div style={{ width: "100%" }}>
                    <Skeleton width="100%" height="150px" />
                    <Skeleton width="100%" height="150px" />
                </div>
            </section>
            <section>
                <div>
                    {Array.from({length: 4}).map((_, index: number) => <Skeleton key={index} width="50%" height="200px" />)}
                </div>
            </section>
        </main>
    );
};

export default Loading;
