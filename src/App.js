import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import LoginPage from "./components/pages/LoginPage";
import ProfilePage from "./components/pages/Profile Page/ProfilePage";
import ProjectPage from "./components/pages/ProjectPage/ProjectPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element={<HomePage/>}/>
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Profile" element = {<ProfilePage/>}/>
        <Route path="/Project" element = {<ProjectPage/>}/>
      </Routes>
    </BrowserRouter>

  );
}

export default App;