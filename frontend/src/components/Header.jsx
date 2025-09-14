import kmrlLogo from "../assets/kmrl-logo.png"; 

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            KMRL Train Induction Planning
          </h1>
          <p className="text-sm text-gray-500">
            AI-driven real-time train induction planning
          </p>
        </div>

        <div className="flex-shrink-0">
          <img
            src={kmrlLogo}
            alt="KMRL Logo"
            className="h-12 w-auto object-contain"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
