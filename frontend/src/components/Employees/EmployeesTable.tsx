import type { Employee } from "./types";

interface EmployeesTableProps {
  employees: Employee[];
  searchQuery: string;
}

const EmployeesTable = ({ employees, searchQuery }: EmployeesTableProps) => {
  const query = searchQuery.toLowerCase().trim();

  const filteredEmployees = employees.filter((employee) => {
    const name = employee.full_name.toLowerCase().trim();
    const email = employee.email.toLowerCase().trim();
    const status = employee.status.toLowerCase().trim();

    return (
      name.includes(query) || email.includes(query) || status.includes(query)
    );
  });

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gs-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gs-dark/50 text-gray-600 dark:text-gs-soft uppercase text-xs tracking-wider">
              <th className="px-6 py-4 font-semibold">Employee</th>
              <th className="px-6 py-4 font-semibold">Job Title</th>
              <th className="px-6 py-4 font-semibold">Salary</th>
              <th className="px-6 py-4 font-semibold">Hire Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Bank Account</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {filteredEmployees.length === 0 ? (
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
              filteredEmployees.map((employee: Employee) => (
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
                        employee.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-gs-primary/20 dark:text-gs-primary"
                          : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gs-soft"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 dark:text-white/20 italic">
                    {employee.bank_account || "Not provided"}
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
