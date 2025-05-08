
const Footer = () => {
  return (
    <footer className="shadow-md" style={{paddingTop: "25px", paddingBottom: "25px"}}>
        <div className="flex items-center justify-between py-4 px-6 text-white">
            <p className="text-sm">© 2025 Smart Wallet. All rights reserved.</p>
            <ul className="flex space-x-4 text-md">
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
    </footer>
  )
}

export default Footer