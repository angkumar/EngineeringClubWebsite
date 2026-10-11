import { Link } from "react-router";
import type { Route } from "./+types/drone";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Drone Project | Novi Engineering Club" },
    { name: "description", content: "Follow the Novi Engineering Club's student-built drone project." },
  ];
}

export default function DronePage() {
  return (
    <main className="detail-page section-wrap">
      <section className="detail-copy">
        <p className="eyebrow">PROJECT 01 · IN PROGRESS</p>
        <h1>The drone.</h1>
        <p className="detail-lede">Designed and built by Novi students, from the frame up.</p>
        <p>We’re working through the design, electronics, and flight controls together. The goal is to understand every part of the build and learn through testing.</p>
        <div className="detail-notes">
          <p className="eyebrow">PROJECT NOTES</p>
          <p className="detail-placeholder">Add the current design, what the team is testing, and what you want to try next.</p>
        </div>
        <Link to="/#projects" className="detail-back">← Back to all projects</Link>
      </section>
      <div className="image-placeholder detail-image" role="img" aria-label="Placeholder for a photo of the drone project">
        <span className="placeholder-cross">＋</span>
        <span>DRONE PHOTO</span>
        <small>Add a photo of the frame, electronics, or first flight</small>
      </div>
    </main>
  );
}
