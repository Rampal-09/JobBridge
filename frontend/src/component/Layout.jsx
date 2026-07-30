import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 md:py-8 lg:py-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
