import Header from "./Header";
import Footer from "./Footer";

const Layout = ({
  children,
  fullWidth = false,
  sidebarOffset = false,
  hideFooter = false,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <Header />
      <div
        className={`flex-1 w-full ${
          fullWidth
            ? "w-full"
            : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10"
        }`}
      >
        {children}
      </div>
      {!hideFooter && (
        <div className={sidebarOffset ? "w-full lg:pl-[20.5rem] xl:pl-[23rem] lg:pr-10 xl:pr-14 bg-white" : "w-full"}>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Layout;
