import { useEffect, useState } from "react";
import { getPublishedProjects } from "../../api/project.api";

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    getPublishedProjects().then((res) => {
      setProjects(res.data.slice(0, 3));
    });
  }, []);

  const scrollToSummary = () => {
    document.getElementById("summary")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-primary text-white">
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.85)), url('/banner.jpg')",
          backgroundSize: "",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Welcome to <span className="text-secondary">Infinite Expo</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-zinc-300 mb-10">
          A digital exhibition showcasing innovative projects, creative ideas,
          and the best works from Infinite Learning mentees.
        </p>

        <button
          onClick={scrollToSummary}
          className="px-10 py-4 bg-[#8A3DFF] font-bold rounded-full text-lg hover:scale-105 transition"
        >
          Explore Exhibition ↓
        </button>
      </section>

      {/* ================= SUMMARY SECTION ================= */}
      <section id="summary" className="py-20 px-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-black">
            Exhibition <span className="text-secondary">Highlights</span>
          </h2>

          <p className="text-zinc-400 max-w-2xl mb-12">
            A glimpse into some of the featured projects presented in this
            exhibition. Each project represents creativity, collaboration, and
            real-world problem solving.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((p) => (
              <div
                key={p.id}
                className="bg-zinc-900 rounded-2xl overflow-hidden hover:scale-[1.02] transition"
              >
                <img
                  src={`http://localhost:3000/uploads/${p.thumbnail}`}
                  alt={p.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                  <p className="text-sm text-zinc-400 line-clamp-3">
                    {p.description || "Project showcase from Infinite Expo."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
