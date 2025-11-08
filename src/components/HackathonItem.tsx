interface HackathonItemProps {
  name: string;
  location: string;
  date: string;
  description: string;
}

export default function HackathonItem({
  name,
  location,
  date,
  description,
}: HackathonItemProps) {
  return (
    <article className="p-5 border border-gray-300 hover:border-gray-500 transition-colors bg-white">
      <p className="text-xs text-gray-500 mb-2 font-serif">{date}</p>
      <h3 className="text-base font-serif font-bold text-gray-800 mb-1">
        {name}
      </h3>
      <p className="text-xs text-gray-600 mb-3 font-serif italic">
        {location}
      </p>
      <p className="text-sm text-gray-700 leading-relaxed font-serif">
        {description}
      </p>
    </article>
  );
}
