import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WriteBlog() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://ilkinibadov.com/api/b/blogs/categories");
      const data = await res.json();
      setCategories(data.categories || data || []);
    } catch {
    }
  };
  const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
      const res = await fetch("https://ilkinibadov.com/api/b/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await res.json();

      if (res.ok && data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        return data.accessToken;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let token = localStorage.getItem("accessToken");
      const createBlog = async (authToken: string) => {
        return await fetch("https://ilkinibadov.com/api/b/blogs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title,
            description,
            category,
            image,
          }),
        });
      };

      let response = await createBlog(token!);
      let data = await response.json();
      
      if (response.status === 401 || data.message?.toLowerCase().includes("token") || data.message?.toLowerCase().includes("invalid")) {
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          response = await createBlog(newToken);
          data = await response.json();
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          alert("Session expired. Please login again.");
          navigate("/login");
          return;
        }
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to create blog");
      }

      alert("Blog created successfully!");
      navigate("/my-blogs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-[#181A2A]" : "bg-[#F6F6F7]"}`}>
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
            <a href="/write-blog" className={`transition-colors font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Write a Blog</a>
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
              className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </header>

<main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className={`text-4xl font-bold font-work text-center mb-12 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Write a new blog
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-sm border border-red-500/20">
              {error}
            </div>
          )}

<input
            type="text"
            placeholder="Add title for blog"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={`w-full p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              darkMode 
                ? "bg-[#242535] border-[#3a3d52] text-white placeholder-gray-400 border" 
                : "bg-white border border-gray-200 text-gray-900 placeholder-gray-500"
            }`}
          />

<div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className={`w-full p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none cursor-pointer ${
                darkMode 
                  ? "bg-[#242535] border-[#3a3d52] text-white border" 
                  : "bg-white border border-gray-200 text-gray-900"
              } ${!category ? (darkMode ? "text-gray-400" : "text-gray-500") : ""}`}
            >
              <option value="" disabled>Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <svg
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

<input
            type="text"
            placeholder="Add thumbnail image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className={`w-full p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              darkMode 
                ? "bg-[#242535] border-[#3a3d52] text-white placeholder-gray-400 border" 
                : "bg-white border border-gray-200 text-gray-900 placeholder-gray-500"
            }`}
          />

<textarea
            placeholder="Add blog body"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={8}
            className={`w-full p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
              darkMode 
                ? "bg-[#242535] border-[#3a3d52] text-white placeholder-gray-400 border" 
                : "bg-white border border-gray-200 text-gray-900 placeholder-gray-500"
            }`}
          />

<button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#FFD050] text-gray-900 font-bold font-work rounded-lg hover:bg-[#f0c040] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900 border-t-transparent"></div>
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </main>

<footer className={`font-work transition-colors duration-300 ${darkMode ? "bg-[#141624]" : "bg-white"}`}>
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

