import Header from "./Header.jsx";
import BottomNav from "./BottomNav.jsx";

export default function AppLayout({ children, headerActive = "home", showHeader = true }) {
  return (
    <div className="min-h-screen">
      {showHeader && <Header active={headerActive} />}
      <main className="container-rm pb-safe-nav">{children}</main>
      <BottomNav />
    </div>
  );
}
