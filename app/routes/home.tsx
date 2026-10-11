import { Link } from "react-router";
import BlurCarousel from "../components/BlurCarousel";
import VectorWordmark from "../components/VectorWordmark";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Novi Engineering Club" },
    { name: "description", content: "Novi High School students building a drone and a model rocket from scratch." },
  ];
}

export default function Home() {
  return (
    <main className="home-page">
      <section className="hero section-wrap">
        <p className="eyebrow">NOVI HIGH SCHOOL · NOVI, MICHIGAN</p>
        <h1 className="sr-only">Engineering Club</h1>
        <div className="wordmark-stack" aria-hidden="true">
          <div className="wordmark-line">
            <VectorWordmark
              text="ENGINEERING"
              font={{ fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 700, fontSize: "154px", letterSpacing: "-0.06em" }}
              background="#050505"
              textColor="#f1f2f3"
              shade="#858a91"
              accent="rgba(205, 210, 218, 0.3)"
              reach={145}
              speed={12}
              damping={72}
              handles={{ size: 76, spread: 29, labels: false }}
              style={{ minWidth: 0, minHeight: 0, height: "100%" }}
            />
          </div>
          <div className="wordmark-line">
            <VectorWordmark
              text="CLUB"
              font={{ fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 700, fontSize: "154px", letterSpacing: "-0.06em" }}
              background="#050505"
              textColor="#f1f2f3"
              shade="#858a91"
              accent="rgba(205, 210, 218, 0.3)"
              reach={145}
              speed={12}
              damping={72}
              handles={{ size: 76, spread: 29, labels: false }}
              style={{ minWidth: 0, minHeight: 0, height: "100%" }}
            />
          </div>
        </div>
        <p className="hero-intro">A few Novi students, a lot of curiosity, and two things we’re building from scratch: a drone and a model rocket.</p>
        <div className="hero-actions">
          <Link to="/#projects" className="button button-light">See what we’re building <span aria-hidden="true">↓</span></Link>
          <Link to="/meetings" className="text-link">Come by a meeting <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="hero-carousel">
          <BlurCarousel
            slides={[
              { title: "BUILD NIGHT" },
              { title: "DRONE PROJECT" },
              { title: "MODEL ROCKET" },
            ]}
            movement="horizontal"
            cardWidth={1120}
            cardHeight={390}
            radius={0}
            tilt={5}
            blurAmount={8}
            arrowColor="#f1f2f3"
            arrowInactiveColor="rgba(229, 230, 232, 0.6)"
            arrowSize={22}
            showTitle
            titleColor="#e5e6e8"
            titleFont={{ fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: ".12em" }}
            titlePosition={{ position: "topLeft", paddingLeft: 28, paddingTop: 26 }}
            style={{ minWidth: 0, minHeight: 0, width: "100%", height: "100%" }}
          />
        </div>
      </section>

      <section className="projects-section section-wrap" id="projects">
        <div className="section-heading">
          <div><p className="eyebrow">WHAT WE’RE WORKING ON</p><h2>Built from<br />the ground up.</h2></div>
          <p className="section-aside">We’re learning as we go.<br />These projects are still taking shape.</p>
        </div>
        <div className="project-grid">
          <Link to="/drone" className="project-card project-card-link" aria-label="View the drone project">
            <div className="image-placeholder project-image">
              <span className="placeholder-cross">＋</span><span>DRONE PHOTO</span><small>Frame / electronics / first flight</small>
            </div>
            <div className="project-meta"><span>PROJECT 01</span><span>IN PROGRESS</span></div>
            <h3>The drone</h3>
            <p>Our own frame, flight controls, and a lot of testing. <span className="copy-placeholder">Add a short update from the team.</span></p>
          </Link>
          <Link to="/rocket" className="project-card project-card-link" aria-label="View the model rocket project">
            <div className="image-placeholder project-image">
              <span className="placeholder-cross">＋</span><span>ROCKET PHOTO</span><small>Sketch / build / launch</small>
            </div>
            <div className="project-meta"><span>PROJECT 02</span><span>IN PROGRESS</span></div>
            <h3>The model rocket</h3>
            <p>A student-built rocket, from the first sketch to launch day. <span className="copy-placeholder">Add a short update from the team.</span></p>
          </Link>
        </div>
      </section>

      <section className="join-section">
        <div className="section-wrap join-inner">
          <div><p className="eyebrow">NO EXPERIENCE REQUIRED</p><h2>Interested?<br /><span>Come build with us.</span></h2></div>
          <div className="join-info">
            <p>We’re always glad to meet people who want to learn, make things, or lend a hand.</p>
            <Link to="/meetings" className="button button-outline">Meeting details <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="sponsor-strip section-wrap">
        <p className="eyebrow">THANKS TO OUR SUPPORTERS</p>
        <div className="sponsor-placeholders"><span>SPONSOR LOGO</span><span>COMMUNITY PARTNER</span><span>ADD ANOTHER</span></div>
      </section>
    </main>
  );
}
