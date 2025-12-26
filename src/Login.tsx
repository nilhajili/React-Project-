import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://ilkinibadov.com/api/b/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      const accessToken = data.accessToken || data.access_token || data.token;
      const refreshToken = data.refreshToken || data.refresh_token;
      
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        localStorage.setItem("user", JSON.stringify({ email }));
      }

      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
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
            <a href="/my-blogs" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>My Blogs</a>
            <a href="#" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-900"}`}>Contact</a>
          </nav>
          <div className="flex items-center gap-4">
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
              href="/register"
              className="px-5 py-2 bg-[#141624] text-white text-sm font-medium rounded-lg hover:bg-black-200 transition-colors"
            >
              Sign Up
            </a>
          </div>
        </div>
      </header>
      <div className="flex flex-col items-center mt-28">
        <h1 className={`font-work font-medium text-5xl text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
          Login
        </h1>
        <form onSubmit={handleLogin} className="w-full md:w-5/12 p-6 mb-28">
          <div className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-sm border border-red-500/20">
                {error}
              </div>
            )}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`p-4 h-16 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                darkMode 
                  ? "bg-[#242535] border-[#3a3d52] text-white placeholder-gray-400 border" 
                  : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`p-4 h-16 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                darkMode 
                  ? "bg-[#242535] border-[#3a3d52] text-white placeholder-gray-400 border" 
                  : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
            <a href="/register" className="text-sm text-left text-blue-500 hover:underline">
              Don't have an account?
            </a>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#FFD050] text-white py-2 rounded-lg h-16 font-bold font-work hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
      <footer className={`font-work transition-colors duration-300 ${darkMode ? "bg-[#141624]" : "bg-[#F6F6F7]"}`}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <p className={`font-semibold text-lg mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>About</p>
              <p className={`mb-6 leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
                © 2024 MyBlog. All Rights Reserved.
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

export default Login;
