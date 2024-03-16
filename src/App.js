
import './App.css';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import { Route,Routes } from 'react-router';
import RegisterView from './views/RegisterView';
function App() {
  return (
    <div className="App">
    <Routes>
        <Route path="/" element={<LoginView/>} />
        <Route path="/dashboard/*" element={<DashboardView/>} />
        
    </Routes>
  </div>
  );
}

export default App;
