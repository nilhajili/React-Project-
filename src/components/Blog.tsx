type BlogProps = {
  title: string;
  category: string;
  image: string;
  author?: string;
  date?: string;
};

export default function Blog({
  title,
  category,
  image,
  author = "Admin",
  date = "—",
}: BlogProps) {
  return (
    <div className="max-w-sm bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={image}
        alt={title}
        className="w-full h-52 object-cover"
      />
      <div className="p-5">
        <span className="inline-block mb-3 text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium">
          {category}
        </span>
        <h2 className="text-xl font-bold text-gray-900 leading-snug mb-4">
          {title}
        </h2>
        <div className="text-sm text-gray-500">
          {author} · {date}
        </div>
      </div>
    </div>
  );
}

