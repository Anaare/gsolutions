import NavBar from "./NavBar";
import SideBar from "./SideBar";

// src/components/Layout.tsx
interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="grid grid-cols-[260px_1fr] min-h-screen bg-gs-bg dark:bg-gs-dark">
      <aside className="bg-gs-dark dark:bg-gs-surface border-r border-gray-200 dark:border-white/5 text-white">
        <SideBar />
      </aside>

      <div className="flex flex-col">
        <header className="h-16 bg-white dark:bg-gs-surface/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 flex items-center px-8">
          <NavBar />
        </header>

        <main className="p-8 flex-1 overflow-y-auto dark:text-gs-text-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
