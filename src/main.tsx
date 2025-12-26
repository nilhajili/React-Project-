import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './App.css'
import Login from './Login.tsx'
import Register from './Register.tsx'
import Page from './page.tsx'
import BlogDetails from './BlogDetails.tsx'
import MyBlogs from './MyBlogs.tsx'
import WriteBlog from './WriteBlog.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/my-blogs" element={<MyBlogs />} />
        <Route path="/write-blog" element={<WriteBlog />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
