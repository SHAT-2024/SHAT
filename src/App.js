import { useContext } from "react";
import "./App.scss";
import SignUpAndSignIn from "./components/pages/SignUpAndSignIn";
import WelcomePage from "./components/pages/WelcomePage";
import { Routes, Route } from "react-router-dom";
import NotFoundPage from "./components/pages/warningPages/NotFoundPage";
import Navbar from "./components/components/NavBar";
import HomePage from "./components/pages/Auth/HomePage";
import { appContext } from "./context";
import SearchPage from "./components/pages/Auth/SearchPage";
import ChatPage from "./components/pages/Auth/ChatPage";
import ProfilePage from "./components/pages/Auth/ProfilePage";
import USerProfilePage from "./components/pages/Auth/SearchPage/UserPage";

function App() {

  const contextt = useContext(appContext);
  let isUserLoggedIn = contextt.isLoggedInCookie;

  return (
    <div>
      <Navbar />
    <div className="app-container">
      <Routes>
        <Route exact path="/" element={!isUserLoggedIn? <WelcomePage/> : <HomePage />}/>
        <Route exact path="/registeration" element={<SignUpAndSignIn />}/>
        <Route exact path="/searchpage" element={<SearchPage />}/>
        <Route exact path="/chatpage/*" element={<ChatPage />}/>
        <Route exact path="/profilepage" element={<ProfilePage />}/>
        <Route exact path="/userProfilepage/*" element={<USerProfilePage />}/>
        <Route exact path="*" element={<NotFoundPage />}/>
      </Routes>
    </div>
    </div>
  );
}

export default App;
