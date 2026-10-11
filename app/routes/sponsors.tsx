import type { Route } from "./+types/sponsors";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sponsors | Novi Engineering Club" },
    { name: "description", content: "Meet the people and organizations supporting Novi Engineering Club." },
  ];
}

const sponsors = ["SPONSOR LOGO", "COMMUNITY PARTNER", "SCHOOL PARTNER", "ADD A SUPPORTER"];

export default function SponsorsPage() {
  return (
    <main className="sponsors-page section-wrap">
      <header className="sponsors-heading">
        <p className="eyebrow">NOVI ENGINEERING CLUB</p>
        <h1>Made possible<br />together.</h1>
        <p>We’re grateful to the people and organizations who help students turn ideas into real projects.</p>
      </header>
      <section className="sponsor-grid" aria-label="Club sponsors and partners">
        {sponsors.map((sponsor) => (
          <div className="sponsor-card" key={sponsor}>
            <span className="sponsor-logo-placeholder">＋</span>
            <span>{sponsor}</span>
          </div>
        ))}
      </section>
      <p className="sponsor-thanks">Add sponsor names, logos, and a short thank-you here.</p>
    </main>
  );
}
