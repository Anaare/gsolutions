import { useState } from "react";
import EmployeeFilters from "../components/Employees/EmployeeFilters";
import EmployeesTable from "../components/Employees/EmployeesTable";
import { AlertCircle, Loader2, Plus } from "lucide-react";
import { useFetchEmployees } from "../hooks/useFetchEmployees";
import type { Employee } from "../components/Employees/types";
import EditEmployeeModal from "../components/Employees/EditEmployeeModal";
import AddEmployeeModal from "../components/Employees/AddEmployeeModal";

const Employees = () => {
  // 4. Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const { employees, setEmployees, loading, error } = useFetchEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gs-primary">
        <Loader2 className="animate-spin" size={32} />
        <span className="ml-2 font-medium">Loading records...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
        <AlertCircle size={20} />
        <h1 className="font-bold">Error loading employees: {error}</h1>
      </div>
    );

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleUpdateUI = (updatedEmployee: Employee) => {
    if (!updatedEmployee || !updatedEmployee.id) {
      console.error(
        "Update UI failed: updatedEmployee is undefined or missing ID",
        updatedEmployee,
      );
      return;
    }

    setEmployees((prev) =>
      prev
        ? prev.map((emp) =>
            emp && emp.id === updatedEmployee.id ? updatedEmployee : emp,
          )
        : null,
    );
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleCreate = async (formData: Partial<Employee>) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/v1/employees/AddEmployee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Creation failed");

      const json = await res.json();
      console.log(json);
      const newEmp = json.data?.employee || json.data || json;

      setEmployees((prev) => (prev ? [newEmp, ...prev] : [newEmp]));
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Create error:", error);
    }
  };

  const handleSave = async (formData: Partial<Employee>) => {
    if (!selectedEmployee) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(
        `${API_URL}/api/v1/employees/${selectedEmployee.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Update failed");

      const json = await res.json();

      handleUpdateUI(json.data);
    } catch (err) {
      console.error("Update error:", err);
    }
  };
  const handleRemoveFromUI = (id: number) => {
    setEmployees((prev) => (prev ? prev.filter((e) => e.id !== id) : null));
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gs-dark dark:text-gs-text-main">
            Employees
          </h1>
          <p className="text-xs text-gray-500">Manage your team directory</p>
        </div>

        <div className="flex items-center gap-3">
          <EmployeeFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <button
            className="flex items-center gap-2 bg-gs-primary text-gs-dark px-4 py-2.5 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform shadow-lg shadow-gs-primary/20"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {!employees || employees.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-gs-surface rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
          <p className="text-gray-500 dark:text-gs-soft">
            No employee records found. Click <strong>Add Employee</strong> to
            create your first record.
          </p>
        </div>
      ) : (
        <EmployeesTable
          searchQuery={searchQuery}
          employees={employees}
          onDelete={handleRemoveFromUI}
          onEdit={handleEditClick}
        />
      )}

      {/* MODALS */}

      <AddEmployeeModal
        key={isAddModalOpen ? "open" : "closed"}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreate}
      />

      {selectedEmployee && (
        <EditEmployeeModal
          key={selectedEmployee.id}
          employee={selectedEmployee}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEmployee(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Employees;
