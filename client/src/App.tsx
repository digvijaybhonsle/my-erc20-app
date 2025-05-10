import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import JoinWallet from "./pages/JoinWallet";
import Trade from "./pages/Trade";
import Wallet from "./pages/Trade";

function App() {
  // State to track wallet connection
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar isWalletConnected={isWalletConnected} />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/join-wallet"
              element={<JoinWallet setIsWalletConnected={setIsWalletConnected} />}
            />

            <Route
              path="/dashboard"
              element={
                isWalletConnected ? <Dashboard /> : <Navigate to="/join-wallet" replace />
              }
            />

            <Route
              path="/wallet"
              element={
                isWalletConnected ? <Wallet /> : <Navigate to="/join-wallet" replace />
              }
            />

            <Route
              path="/trade"
              element={
                isWalletConnected ? <Trade /> : <Navigate to="/join-wallet" replace />
              }
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
