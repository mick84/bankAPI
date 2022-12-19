import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { AuthContextProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import UserSignupPage from "./pages/UserSignup";
import UserLoginPage from "./pages/UserLoginPage";
function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup-user" element={<UserSignupPage />} />
          <Route path="/login-user" element={<UserLoginPage />} />
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
