interface UpcomingMeetingProps {
  date: string;
  topic: string;
  location: string;
}

export default function UpcomingMeetingWidget({
  date,
  topic,
  location,
}: UpcomingMeetingProps) {
  return (
    <div className="meeting-widget bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 mb-4 flex flex-col md:flex-row justify-between items-center">
      <div className="meeting-info text-center md:text-left mb-2 md:mb-0">
        <h3 className="text-xl font-bold">{date}</h3>
        <p className="text-gray-600 dark:text-gray-300">{topic}</p>
        <p className="text-gray-500 dark:text-gray-400">Location: {location}</p>
      </div>
    </div>
  );
}
