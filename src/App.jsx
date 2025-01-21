// App.jsx
import { Route, Routes } from "react-router";
import Login from './pages/login.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/home.jsx";

function App() {
  const showToast = () => {
    toast.success("This is a success toast!");
  };
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <ToastContainer />
    </div>

  );
}

export default App;
