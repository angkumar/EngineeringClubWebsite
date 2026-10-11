import { Link } from "react-router";
import type { Route } from "./+types/rocket";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Model Rocket Project | Novi Engineering Club" },
    { name: "description", content: "Follow the Novi Engineering Club's student-built model rocket project." },
  ];
}

export default function RocketPage() {
  return (
    <main className="detail-page section-wrap">
      <section className="detail-copy">
        <p className="eyebrow">PROJECT 02 · IN PROGRESS</p>
        <h1>The model rocket.</h1>
        <p className="detail-lede">A student-built rocket, from the first sketch to launch day.</p>
        <p>We’re learning about stability, structure, and how each part of a rocket works. The project will take shape through careful design, building, and testing.</p>
        <div className="detail-notes">
          <p className="eyebrow">PROJECT NOTES</p>
          <p className="detail-placeholder">Add the current design, the next build milestone, and launch updates here.</p>
        </div>
        <Link to="/#projects" className="detail-back">← Back to all projects</Link>
      </section>
      <div className="image-placeholder detail-image" role="img" aria-label="Placeholder for a photo of the model rocket project">
        <span className="placeholder-cross">＋</span>
        <span>MODEL ROCKET PHOTO</span>
        <small>Add a sketch, build photo, or launch image</small>
      </div>
    </main>
  );
}
