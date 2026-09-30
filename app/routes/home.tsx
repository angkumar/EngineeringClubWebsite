import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Novi Engineering Club" },
    { name: "description", content: "Welcome to the Novi Engineering Club website!" },
  ];
}

export default function Home() {
  return (
    <div className="home-page">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Novi Engineering Club!</h1>
      <h2 className="text-2xl font-semibold mb-2">What We Do</h2>
      <p className="mb-4">The Novi Engineering Club is dedicated to fostering an environment where students can explore their passion for engineering through hands-on projects, collaborative learning, and innovative challenges. We work on a variety of exciting projects, ranging from robotics to aerospace, providing members with practical skills and real-world experience.</p>
      
      <h2 className="text-2xl font-semibold mb-2">Where We Meet</h2>
      <p className="mb-4">We typically meet in the iCube (at the Novi Public Library) after school on Wednesdays and we meet afterschool in the CAT lab on Fridays. Check our <a href="meetings">Meetings</a> page for the most up-to-date schedule and any changes.</p>
      
      <h2 className="text-2xl font-semibold mb-2">Join Us!</h2>
      <p className="mb-4">Whether you're a seasoned engineer or just starting out, the Novi Engineering Club welcomes all students with an interest in design, building, and problem-solving. Come join us and turn your ideas into reality!</p>

      <h2 className="text-2xl font-semibold mb-2">Sponsors</h2>
    </div>
  );
}
