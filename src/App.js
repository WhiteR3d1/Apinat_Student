import Home from "./components/Home";
import Edit from "./components/Edit";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div className="container">
      <BrowserRouter basename="/Apinat_Student">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit" element={<Edit />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;