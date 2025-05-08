import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "./index.css";
import Dashboard from "./pages/Dashboard";
// import Home from "./pages/Home";
// import JoinWallet from "./pages/JoinWallet";
// import Wallet from "./pages/Wallet";

function App() {
  return (
    <div>
      <Navbar />
      <Dashboard />
      <Footer />
    </div>
  );
}

export default App;
