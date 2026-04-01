import {
  ArrowDown01,
  ArrowDown10,
  ArrowDownAZ,
  ArrowDownNarrowWide,
  ArrowDownZA,
  ArrowUpNarrowWide,
  SquarePen,
  Trash,
} from "lucide-react";
import type { Employee } from "./types";
import { useState } from "react";

interface EmployeesTableProps {
  employees: Employee[];
  searchQuery: string;
  onDelete: (id: number) => void;
  onEdit: (employee: Employee) => void;
}

interface SortConfig {
  key: keyof Employee;
  direction: "asc" | "desc";
}

const EmployeesTable = ({
  employees,
  searchQuery,
  onDelete,
  onEdit,
}: EmployeesTableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "full_name",
    direction: "asc",
  });
  const query = searchQuery.toLowerCase().trim();

  const filteredEmployees = employees.filter((employee) => {
    const name = employee.full_name.toLowerCase().trim();
    const email = employee.email.toLowerCase().trim();
    const status = employee.status.toLowerCase().trim();

    return (
      name.includes(query) || email.includes(query) || status.includes(query)
    );
  });

  const handleSort = (newKey: keyof Employee) => {
    setSortConfig((prev) => ({
      key: newKey,
      direction:
        prev.key === newKey && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    let comparison = 0;

    if (sortConfig.key === "contract_salary") {
      comparison = Number(aValue) - Number(bValue);
    } else if (sortConfig.key === "hire_date") {
      comparison =
        new Date(aValue as string).getTime() -
        new Date(bValue as string).getTime();
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sortConfig.direction === "asc" ? comparison : comparison * -1;
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/v1/employees/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete");

      onDelete(id);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Could not delete employee. Please try again.");
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gs-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gs-dark/50 text-gray-600 dark:text-gs-soft uppercase text-xs tracking-wider">
              <th className="px-6 py-4 font-semibold">
                <div
                  className="flex items-center gap-1 cursor-pointer select-none group"
                  onClick={() => handleSort("full_name")}
                >
                  <span>Employee</span>
                  {sortConfig.direction === "asc" ? (
                    <ArrowDownAZ
                      size={15}
                      className="text-gray-400 group-hover:text-gs-primary transition-colors"
                    />
                  ) : (
                    <ArrowDownZA
                      size={15}
                      className="text-gray-400 group-hover:text-gs-primary transition-colors"
                    />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 font-semibold">Job Title</th>
              <th className="px-6 py-4 font-semibold">
                <div
                  className="flex items-center gap-1 cursor-pointer select-none group"
                  onClick={() => handleSort("contract_salary")}
                >
                  <span>Salary</span>
                  {sortConfig.direction === "asc" ? (
                    <ArrowDown01
                      size={15}
                      className="text-gray-400 group-hover:text-gs-primary transition-colors"
                    />
                  ) : (
                    <ArrowDown10
                      size={15}
                      className="text-gray-400 group-hover:text-gs-primary transition-colors"
                    />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 font-semibold">
                <div
                  className="flex items-center gap-1 cursor-pointer select-none group"
                  onClick={() => handleSort("hire_date")}
                >
                  <span>Hire Date</span>
                  {sortConfig.direction === "asc" ? (
                    <ArrowUpNarrowWide
                      size={15}
                      className="text-gray-400 group-hover:text-gs-primary transition-colors"
                    />
                  ) : (
                    <ArrowDownNarrowWide
                      size={15}
                      className="text-gray-400 group-hover:text-gs-primary transition-colors"
                    />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Bank Account</th>
              <th className="px-6 py-4 font-semibold">Edit/Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {sortedEmployees.length === 0 ? (
              // Empty State Row
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <p className="text-gray-500 dark:text-gs-soft text-sm">
                    No employees found matching{" "}
                    <span className="font-semibold">"{searchQuery}"</span>
                  </p>
                </td>
              </tr>
            ) : (
              // Data Rows
              sortedEmployees.map((employee: Employee) => (
                <tr
                  key={employee.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gs-dark dark:text-gs-text-main">
                        {employee.full_name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gs-soft">
                        ID: {employee.personal_id}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gs-soft/60">
                        {employee.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gs-text-main/80">
                    {employee.job_title}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gs-dark dark:text-gs-primary">
                    ${Number(employee.contract_salary).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gs-soft">
                    {new Date(employee.hire_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        employee.status.toLowerCase().trim() === "active"
                          ? "bg-green-100 text-green-700 dark:bg-gs-primary/20 dark:text-gs-primary"
                          : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gs-soft"
                      }`}
                    >
                      {employee.status.toLowerCase().trim()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 dark:text-white/20 italic">
                    {employee.bank_account || "Not provided"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 dark:text-white/20 italic">
                    <div className="flex gap-2">
                      <SquarePen size={15} onClick={() => onEdit(employee)} />
                      <Trash
                        size={15}
                        onClick={() => handleDelete(employee.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeesTable;
