import Home from "./components/Home";
import Edit from "./components/Edit";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";

const App = () => {
  return (
    <div className="container">
      <h1 className="text-center bg-light text-info py-3">
        Student Phone</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/edit' element={<Edit />} />
        </Routes>
      </BrowserRouter>
    </div>);
}
export default App;