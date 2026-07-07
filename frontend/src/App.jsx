import { RouterProvider } from "react-router-dom";
import { routers } from "./routers";

function App() {
  return (
    <>
      <div>
        <RouterProvider router={routers} />
      </div>
    </>
  );
}

export default App;
