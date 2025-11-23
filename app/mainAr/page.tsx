import Header from "../components/header";
import ARExperienceCards from "./card";

export default function Home() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-[#2A0F38] text-center my-12">
            تجارب الواقع المعزز للزي السعودي
          </h1>

          <ARExperienceCards />
        </div>
      </main>
    </>
  );
}
