import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  isWalletConnected: boolean;
}

const Navbar = ({ isWalletConnected }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `transition duration-150 text-lg ${
      isActive
        ? "text-yellow-400 font-semibold"
        : "text-gray-300 hover:text-white"
    }`;

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="shadow-md py-2">
      <nav className="flex items-center justify-between py-4 px-6 md:px-10 max-w-7xl mx-auto">
        {/* Logo */}
        <h1 className="text-yellow-500 text-3xl sm:text-4xl font-semibold">Smart Wallet</h1>


        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-10 test-3xl">
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

        {/* Wallet status */}
        <div className="hidden md:block text-gray-500 text-lg">
          {isWalletConnected ? "Wallet Connected" : "Wallet Not Connected"}
        </div>

        {/* Hamburger Icon (Mobile) */}
        <button
          className="md:hidden text-yellow-400 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-start gap-4 bg-black px-6 py-4">
          <NavLink to="/" className={navLinkClasses} onClick={toggleMenu}>
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={navLinkClasses}
            onClick={toggleMenu}
          >
            Dashboard
          </NavLink>
          <NavLink to="/Trade" className={navLinkClasses} onClick={toggleMenu}>
            Trade
          </NavLink>
          <NavLink to="/wallet" className={navLinkClasses} onClick={toggleMenu}>
            Join Wallet
          </NavLink>
          <div className="text-gray-400 mt-2 text-sm">
            {isWalletConnected ? "Wallet Connected" : "Wallet Not Connected"}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
