import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { Dashboard, ProjectsPage } from './pages';
import '@/styles/globals.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard stats={{
            total: 10,
            pending: 3,
            inProgress: 2,
            completed: 4,
            failed: 1,
            cancelled: 0
          }} />} />
          <Route path="projects" element={<ProjectsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
