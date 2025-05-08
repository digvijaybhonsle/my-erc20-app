const Navbar = () => {
    return (
      <header className="shadow-md py-2">
        <nav className="flex items-center justify-between py-4 px-4">
          <h1 className="text-white text-4xl font-semibold">Smart Wallet</h1>
          <ul className="flex gap-16 text-xl">
            <li>
              <a href="/home" className="text-gray-300 hover:text-white transition duration-150">
                Home
              </a>
            </li>
            <li>
              <a href="/home" className="text-gray-300 hover:text-white transition duration-150">
                Wallet
              </a>
            </li>
            <li>
              <a href="/" className="text-gray-300 hover:text-white transition duration-150">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-yellow-200 transition duration-150 text-yellow-500 text-bold">
                Join Wallet
              </a>
            </li>
          </ul>
        </nav>
      </header>
    );
  };
  
  export default Navbar;
  