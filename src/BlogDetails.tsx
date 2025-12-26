import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type BlogType = {
  _id: string;
  title: string;
  category: string;
  image: string;
  content?: string;
  description?: string;
  email?: string;
  author?: string;
  user?: { email?: string; firstname?: string; lastname?: string };
  createdAt?: string;
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

export default function BlogDetails() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`https://ilkinibadov.com/api/b/blogs/blog/${id}`);
          const data = await res.json();

          if (data.blog) {
          setBlog(data.blog);
        } else if (data._id) {
          setBlog(data);
        } else if (data.data) {
          setBlog(data.data);
        }
        } catch {
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-[#181A2A]" : "bg-white"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-[#181A2A]" : "bg-white"}`}>
        <p className={darkMode ? "text-white" : "text-gray-900"}>Blog not found</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-[#181A2A]" : "bg-white"}`}>
      <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        darkMode ? "bg-[#181A2A] border-[#242535]" : "bg-white border-gray-100"
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? "bg-white" : "bg-gray-900"}`}>
              <span className={`font-bold text-sm ${darkMode ? "text-gray-900" : "text-white"}`}>B</span>
            </div>
            <span className={`font-work text-xl ${darkMode ? "text-white" : "text-gray-900"}`}>
              <span className="font-normal">Meta</span>
              <span className="font-bold">Blog</span>
            </span>
          </a>
          <nav className={`hidden md:flex items-center gap-10 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            <a href="/" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>Home</a>
            <a href="/write-blog" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>Write a Blog</a>
            <a href="/my-blogs" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>My Blogs</a>
            <a href="#" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-36 lg:w-44 px-4 py-2 pr-10 rounded-lg border-none text-sm focus:outline-none focus:ring-2 transition-all ${
                  darkMode 
                    ? "bg-[#242535] text-white placeholder-gray-400 focus:ring-gray-600" 
                    : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-gray-200"
                }`}
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                darkMode 
                  ? "bg-[#242535] hover:bg-[#2d2f42]" 
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <a
              href="/login"
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
>
              Sign In
            </a>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <span className="inline-block mb-4 text-sm px-3 py-1 rounded-md font-medium font-work bg-blue-600 text-white">
          {blog.category}
        </span>
        <h1 className={`text-3xl md:text-4xl font-bold font-work leading-tight mb-4 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}>
          {blog.title}
        </h1>
        <div className={`flex items-center gap-4 mb-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <span className="font-medium">{formatAuthor(blog.email, blog.author, blog.user)}</span>
          </div>
          <span>·</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-auto rounded-xl mb-8 object-cover"
        />
        <article className={`prose prose-lg max-w-none font-work ${
          darkMode ? "prose-invert" : ""
        }`}>
          {(blog.content || blog.description) ? (
            <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {blog.content || blog.description}
            </div>
          ) : (
            <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
              No content available for this blog.
            </p>
          )}
        </article>
      </main>
      <footer className={`font-work transition-colors duration-300 ${darkMode ? "bg-[#141624]" : "bg-[#F6F6F7]"}`}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <p className={`font-semibold text-lg mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>About</p>
              <p className={`mb-6 leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
              </p>
              <div className="space-y-2">
                <p>
                  <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Email: </span>
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>info@jstemplate.net</span>
                </p>
                <p>
                  <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Phone: </span>
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>880 123 456 789</span>
                </p>
              </div>
            </div>
            <div>
              <p className={`font-semibold text-lg mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Quick Link</p>
              <ul className={`space-y-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                <li><a href="/" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>Home</a></li>
                <li><a href="/write-blog" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>Write a Blog</a></li>
                <li><a href="/my-blogs" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>My Blogs</a></li>
                <li><a href="#contact" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>Contact</a></li>
              </ul>
            </div>
            <div>
              <p className={`font-semibold text-lg mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Category</p>
              <ul className={`space-y-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                <li><a href="/?category=lifestyle" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>Lifestyle</a></li>
                <li><a href="/?category=technology" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>Technology</a></li>
                <li><a href="/?category=travel" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>Travel</a></li>
                <li><a href="/?category=business" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>Business</a></li>
                <li><a href="/?category=economy" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>Economy</a></li>
                <li><a href="/?category=sports" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>Sports</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={`border-t ${darkMode ? "border-[#242535]" : "border-gray-200"}`}>
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? "bg-white" : "bg-gray-900"}`}>
                <span className={`font-bold text-sm ${darkMode ? "text-gray-900" : "text-white"}`}>B</span>
              </div>
              <span className={`font-work text-xl ${darkMode ? "text-white" : "text-gray-900"}`}>
                <span className="font-normal">Meta</span>
                <span className="font-bold">Blog</span>
              </span>
              <span className={`ml-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                © JS Template 2023. All Rights Reserved.
              </span>
            </div>
            <div className={`flex gap-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <a href="#" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>Terms of Use</a>
              <a href="#" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>Privacy Policy</a>
              <a href="#" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

