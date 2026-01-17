import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import LoginPage from "./components/pages/LoginPage";
import ProfilePage from "./components/pages/Profile Page/ProfilePage";
import ProjectPage from "./components/pages/ProjectPage/ProjectPage";
import KanbanPage from "./components/pages/Kanban/KanbanPage";
import SprintsPage from "./components/pages/Sprints/SprintsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/project" element={<ProjectPage/>}/>
        <Route path="/kanban" element={<KanbanPage/>}/>
        <Route path="/sprints" element={<SprintsPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;