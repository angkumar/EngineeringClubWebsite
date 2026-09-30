import type { Route } from "./+types/meetings";
import MeetingWidget from "./meetings/components/MeetingWidget";
import UpcomingMeetingWidget from "./meetings/components/UpcomingMeetingWidget";
import meetingsData from "./meetings/meetingsData.json";

const { upcomingMeetings, pastMeetings } = meetingsData;


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Meetings" },
    { name: "description", content: "Novi Engineering Club Meeting Schedule" },
  ];
}

export default function Meetings() {
  return (
    <div className="meetings-page">
      <h1 className="text-4xl font-bold mb-4">Meetings</h1>
            <p className="mb-2">We usually meet on Wednesdays in the iCube at the Novi Public Library, we also meet on fridays, in the CAT Lab</p>
      <h2 className="text-2xl font-semibold mb-2">Upcoming Meetings</h2>
      <div className="upcoming-meetings-list">
        {upcomingMeetings.map((meeting, index) => (
          <UpcomingMeetingWidget
            key={index}
            date={meeting.date}
            topic={meeting.topic}
            location={meeting.location}
          />
        ))}
      </div>
      <h2 className="text-2xl font-semibold mb-2">Past Meetings</h2>
            <div className="past-meetings-list">
        {pastMeetings.map((meeting, index) => (
          <MeetingWidget
            key={index}
            date={meeting.date}
            topic={meeting.topic}
            minutesLink={meeting.minutesLink}
          />
        ))}
      </div>
    </div>
  );
}
