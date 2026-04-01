import { useState } from "react";
import EmployeeFilters from "../components/Employees/EmployeeFilters";
import EmployeesTable from "../components/Employees/EmployeesTable";
import { AlertCircle, Loader2 } from "lucide-react";
import { useFetchEmployees } from "../hooks/useFetchEmployees";
import type { Employee } from "../components/Employees/types";
import EditEmployeeModal from "../components/Employees/EditEmployeeModal";
import { useNavigate } from "react-router-dom";

const Employees = () => {
  // 1. Filtering (search bar, filtering by status ) OK
  // 2. Sorting (hire date, salary, alphabetically) OK
  // 3. Actions (edit, delete, add)
  // 4. Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const { employees, setEmployees, loading, error } = useFetchEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
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

  if (!employees || employees.length === 0)
    return (
      <div className="text-center p-12 bg-white dark:bg-gs-surface rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
        <p className="text-gray-500 dark:text-gs-soft">
          No employee records found.
        </p>
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

    navigate("/employees", { replace: true });
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
      {/* TOP RIGHT FILTER */}
      <div className="flex justify-end">
        <EmployeeFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* TABLE */}
      <EmployeesTable
        searchQuery={searchQuery}
        employees={employees || []}
        onDelete={handleRemoveFromUI}
        onEdit={handleEditClick}
      />
      {selectedEmployee && (
        <EditEmployeeModal
          key={selectedEmployee.id}
          employee={selectedEmployee}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Employees;
