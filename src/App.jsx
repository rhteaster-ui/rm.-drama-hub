import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home.jsx";
import Search from "./routes/Search.jsx";
import Category from "./routes/Category.jsx";
import Library from "./routes/Library.jsx";
import Profile from "./routes/Profile.jsx";
import Detail from "./routes/Detail.jsx";
import Watch from "./routes/Watch.jsx";
import { ToastProvider } from "./components/Toast.jsx";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/category" element={<Category />} />
          <Route path="/library" element={<Library />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
