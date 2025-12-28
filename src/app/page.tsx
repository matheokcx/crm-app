import HomeSideBar from "@/components/Layout/HomeSideBar";
import styles from "./homepage.module.css";
import KpiCard from "@/components/UI/Cards/KpiCard";

// ==============================================

const HomePage = () => {
  return (
    <main className={styles.homePage}>
      <HomeSideBar />
      <section className={styles.homePageSection}>
          <h1>Bonjour Mathéo</h1>
          <div className={styles.homePageSectionRow}>
              <div style={{width: "50%"}}>div1</div>
              <div style={{ width: "50%", display: "flex", justifyContent: "space-between", gap: "24px" }}>
                  <KpiCard name="Clients" value={12} />
                  <KpiCard name="Projets en cours" value={3} />
              </div>
          </div>
      </section>
    </main>
  );
};

export default HomePage;
