import { useEffect } from 'react';
import { RouterProvider } from "react-router-dom";
import { routers } from "./routers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from './stores/useAuthStore';
import useNotificationStore from './stores/useNotificationStore';

function App() {
  const { token, userId } = useAuthStore();
  const { initSocket } = useNotificationStore();

  useEffect(() => {
    if (token && userId) {
      initSocket(userId);
    }
  }, [initSocket, token, userId]);

  return (
    <>
      <RouterProvider router={routers} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
      />
    </>
  );
}

export default App;