import AppRoutes from "./routes";
import { AuthProvider } from "@/context/AuthContext";
import { BusinessProvider } from "@/context/BusinessContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <BusinessProvider>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={6000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </BusinessProvider>
    </AuthProvider>
  );
}

export default App;