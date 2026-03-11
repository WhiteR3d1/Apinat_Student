import Home from "./components/Home";
import Edit from "./components/Edit";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";

const App = () => {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="./" element={<Home />} />
          <Route path='./edit' element={<Edit />} />
        </Routes>.
      </BrowserRouter>
    </div>);
}
export default App;