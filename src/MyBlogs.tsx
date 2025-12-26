import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Blog from "./Blog.tsx";

type BlogType = {
  _id: string;
  title: string;
  category: string;
  image: string;
  email?: string;
  author?: string;
  user?: { email?: string; firstname?: string; lastname?: string };
  createdAt?: string;
};

type ApiResponse = {
  blogs: BlogType[];
  totalPages?: number;
  currentPage?: number;
  total?: number;
};

type UserType = {
  _id?: string;
  id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
};

export default function MyBlogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const limit = 9;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, [navigate]);

  const fetchBlogs = async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const token = localStorage.getItem("accessToken");
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const res = await fetch(`https://ilkinibadov.com/api/b/blogs/user/me?${params.toString()}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();

      const newBlogs = data.blogs || data.data || (Array.isArray(data) ? data : []);

      if (isLoadMore) {
        setBlogs((prev) => [...prev, ...newBlogs]);
      } else {
        setBlogs(newBlogs);
      }

      setHasMore(newBlogs.length >= limit);
    } catch {
      if (!isLoadMore) {
        setBlogs([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchBlogs(false);
    }
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchBlogs(true);
    }
  }, [page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleDeleteBlog = (deletedId: string) => {
    setBlogs((prev) => prev.filter((blog) => blog._id !== deletedId));
  };

  const getUserDisplayName = () => {
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
    return "My Account";
  };

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
            <a href="/my-blogs" className={`transition-colors font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>My Blogs</a>
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

<div className={`py-8 ${darkMode ? "bg-[#242535]" : "bg-gray-100"}`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className={`text-2xl font-semibold font-work ${darkMode ? "text-white" : "text-gray-900"}`}>
            {getUserDisplayName()}
          </h1>
        </div>
      </div>

<main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className={`text-2xl font-bold font-work mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Latest Post
        </h2>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="text-center py-20">
            <p className={`text-lg mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              You haven't written any blogs yet.
            </p>
            <a
              href="/write-blog"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Write Your First Blog
            </a>
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Blog
                  key={blog._id}
                  _id={blog._id}
                  title={blog.title}
                  category={blog.category}
                  image={blog.image}
                  email={blog.email}
                  author={blog.author}
                  user={blog.user}
                  createdAt={blog.createdAt}
                  darkMode={darkMode}
                  showDelete={true}
                  onDelete={handleDeleteBlog}
                />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className={`px-8 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border ${
                    darkMode
                      ? "bg-[#242535] border-[#3a3d52] text-white hover:bg-[#2d2f42]"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </>
        )}
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

