import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Elections } from "@/components/Elections";
import { Candidates } from "@/components/Candidates";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <Elections />
        <Candidates />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
