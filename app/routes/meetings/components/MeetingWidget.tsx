interface MeetingProps {
  date: string;
  topic: string;
  minutesLink: string;
}

export default function MeetingWidget({ date, topic, minutesLink }: MeetingProps) {
  return (
    <div className="meeting-widget bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 mb-4 flex flex-col md:flex-row justify-between items-center">
      <div className="meeting-info text-center md:text-left mb-2 md:mb-0">
        <h3 className="text-xl font-bold">{date}</h3>
        <p className="text-gray-600 dark:text-gray-300">{topic}</p>
      </div>
      <a
        href={minutesLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Meeting Minutes
      </a>
    </div>
  );
}
