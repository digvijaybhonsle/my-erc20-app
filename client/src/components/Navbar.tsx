import { NavLink } from "react-router-dom";

interface NavbarProps {
  isWalletConnected: boolean;
}

const Navbar = ({ isWalletConnected }: NavbarProps) => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `transition duration-150 text-xl ${
      isActive ? "text-yellow-400 font-semibold" : "text-gray-300 hover:text-white"
    }`;


  return (
    <header className="shadow-md py-2">
      <nav className="flex items-center justify-between py-4 max-w-8xl mx-8 px-4">
        <h1 className="text-yellow-500 text-4xl font-semibold">Smart Wallet</h1>
        <ul className="flex gap-12">
          <li>
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={navLinkClasses}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/Trade" className={navLinkClasses}>
              Trade
            </NavLink>
          </li>
          <li>
            <NavLink to="/wallet" className={navLinkClasses}>
              Join Wallet
            </NavLink>
          </li>
        </ul>
        <div className="text-gray-500 text-xl">
          {isWalletConnected ? "Wallet Connected" : "Wallet Not Connected"}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
