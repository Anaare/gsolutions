import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Clients from "./pages/Clients";
import Vendors from "./pages/Vendors";
import Projects from "./pages/Projects";

function App() {
  return (
    <Layout>
      {/* <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gs-dark dark:text-gs-bg">
          Dashboard Overview
        </h1>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gs-dark/40 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 text-gs-dark dark:text-gs-bg">
          Stat Card 1
        </div>
      </div> */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </Layout>
  );
}

export default App;
