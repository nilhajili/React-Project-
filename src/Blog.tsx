type BlogProps = {
  _id: string;
  title: string;
  category: string;
  image: string;
  email?: string;
  author?: string;
  user?: { email?: string; firstname?: string; lastname?: string };
  hero?: boolean;
  createdAt?: string;
  darkMode?: boolean;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
};

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

function formatAuthor(email?: string, author?: string, user?: { email?: string; firstname?: string; lastname?: string }) {
  if (user?.firstname && user?.lastname) {
    return `${user.firstname} ${user.lastname}`;
  }
  if (user?.email) {
    const username = user.email.split("@")[0];
    return username
      .replace(/[._]/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  if (email) {
    const username = email.split("@")[0];
    return username
      .replace(/[._]/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  if (author) {
    if (author.includes("@")) {
      const username = author.split("@")[0];
      return username
        .replace(/[._]/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    }
    return author;
  }
  return "Unknown";
}

export default function Blog({
  _id,
  title,
  category,
  image,
  email,
  author,
  user,
  createdAt,
  hero = false,
  darkMode = false,
  showDelete = false,
  onDelete,
}: BlogProps) {
  const formattedDate = formatDate(createdAt);
  const displayAuthor = formatAuthor(email, author, user);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Please login to delete blogs");
        return;
      }

      const response = await fetch(`https://ilkinibadov.com/api/b/blogs/${_id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Blog deleted successfully!");
        if (onDelete) {
          onDelete(_id);
        }
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete blog");
      }
    } catch {
      alert("Failed to delete blog");
    }
  };

  const content = (
    <>
      <img
        src={image}
        alt={title}
        className={hero ? "w-full h-full object-cover" : "w-full h-52 object-cover"}
      />
      <div
        className={
          hero
            ? "absolute bottom-8 left-8 text-white max-w-xl z-10"
            : "p-5"
        }
      >
        <span
          className={
            hero
              ? "inline-block mb-3 text-sm px-3 py-1 rounded-md font-medium font-work bg-blue-600 text-white"
              : `inline-block mb-3 text-sm px-3 py-1 rounded-md font-medium font-work ${
                  darkMode ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
                }`
          }
        >
          {category}
        </span>

        <h2
          className={
            hero
              ? "text-4xl font-bold leading-tight font-work"
              : `text-xl font-semibold leading-snug mb-4 font-work ${
                  darkMode ? "text-white" : "text-gray-900"
                }`
          }
        >
          {title}
        </h2>

        <p className={
          hero
            ? "text-sm mt-3 opacity-80 font-work flex items-center gap-2"
            : `text-sm font-work ${darkMode ? "text-gray-400" : "text-gray-500"}`
        }>
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
            {displayAuthor}
          </span>
          <span className="mx-2">·</span>
          {formattedDate}
        </p>
      </div>
    </>
  );

  if (hero) {
    return (
      <div className="relative">
        {showDelete && (
          <button
            onClick={handleDelete}
            className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg z-30"
            title="Delete blog"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
        <a href={`/blog/${_id}`}>
          <div className="relative w-full h-[420px] rounded-2xl overflow-hidden mb-12 cursor-pointer hover:scale-[1.02] transition-transform duration-300">
            {content}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className="relative">
      {showDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg z-30"
          title="Delete blog"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
      <a href={`/blog/${_id}`}>
        <div className={`rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border ${
          darkMode 
            ? "bg-[#181A2A] border-[#242535]" 
            : "bg-white border-gray-100 shadow-md"
        }`}>
          {content}
        </div>
      </a>
    </div>
  );
}
