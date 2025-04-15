import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Importation de ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Importation des styles de react-toastify
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import GererEleve from "./pages/GererEleve";
import GererEnseignant from "./pages/GererEnseignant";
import Welcome from "./pages/Welcome";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile"; // Page Profile déjà importée

// Composants Navbar et Sidebar
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidenav";
function Eleve({ user }) {
  return <h2>Eleve Dashboard - Welcome, {user?.role}</h2>;
}
function Enseignant({ user }) {
  return <h2>Enseignant Dashboard - Welcome, {user?.role}</h2>;
}


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // État pour l'utilisateur
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsAuthenticated(true);
      setUser({ role }); // Récupération du rôle au chargement
    }
  }, []);

  const PrivateRoute = ({ element }) => async () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    else{
      return <Navigate to="/home" replace />;
    }
  };


  const noHeaderRoutes = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login", { replace: true });  // This already redirects to login page
  };

  return (
    <div className="App">
      {/* Ajout du ToastContainer pour afficher les notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {!noHeaderRoutes.includes(location.pathname) && (
        <>
          <Navbar handleLogout={handleLogout} user={user} />
          <Sidebar user={user} />
        </>
      )}

      <div className="content">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={<PrivateRoute element={<Home user={user} />} />} />
          <Route path="/eleve" element={<PrivateRoute element={<Eleve user={user}/>} />} />
          <Route path="/enseignant" element={<PrivateRoute element={<Enseignant user={user} />} />} />
          <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
          <Route path="/gerer-eleve" element={<PrivateRoute element={<GererEleve />} />} />
          <Route path="/gerer-enseignant" element={<PrivateRoute element={<GererEnseignant />} />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile user={user} />} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
