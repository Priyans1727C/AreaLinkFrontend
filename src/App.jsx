import { BrowserRouter } from "react-router-dom";
import RoutesConfig from "./routes/routes.jsx"; // ✅ Import your main routes

function App() {
  return (
    <BrowserRouter>
      <RoutesConfig />
    </BrowserRouter>
  );
}

export default App;
