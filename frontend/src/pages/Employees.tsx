import { useState } from "react";
import EmployeeFilters from "../components/Employees/EmployeeFilters";
import EmployeesTable from "../components/Employees/EmployeesTable";
import { AlertCircle, Loader2 } from "lucide-react";
import { useFetchEmployees } from "../hooks/useFetchEmployees";

const Employees = () => {
  // 1. Filtering (search bar, filtering by status ) OK
  // 2. Sorting (hire date, salary, alphabetically)
  // 3. Actions (edit, delete, single employee profile)
  // 4. Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const { employees, loading, error } = useFetchEmployees();

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
      <EmployeesTable employees={employees} searchQuery={searchQuery} />
    </div>
  );
};

export default Employees;
