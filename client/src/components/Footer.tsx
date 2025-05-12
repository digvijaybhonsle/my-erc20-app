const Footer = () => {
  return (
    <footer className="shadow-md text-white py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 py-4">
        <p className="text-lg text-center md:text-left">
          © 2025 Smart Wallet. All rights reserved.
        </p>
        <ul className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-lg">
          <li>
            <a href="#" className="text-gray-300 hover:text-white transition duration-150">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-300 hover:text-white transition duration-150">
              Terms of Service
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-300 hover:text-white transition duration-150">
              Contacts
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-4 text-center text-lg text-gray-400">
        Made with ❤️ by{" "}
        <a
          href="https://github.com/digvijaybhonsle"
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow-400 hover:underline cursor-pointer"
        >
          DGVJ
        </a>
      </div>
    </footer>
  );
};

export default Footer;
