// 1. Employees

export type EmployeeStatus = "active" | "terminated" | "on-leave";

export interface Employee {
  id: number;
  full_name: string;
  email: string;
  personal_id: string;
  job_title: string;
  contract_salary: number;
  hire_date: string;
  status: EmployeeStatus;
  bank_account: string | null;
  created_at: string;
  updated_at: string;
}

// Interface for the API Response wrapper
export interface EmployeeResponse {
  status: string;
  results: number;
  data: {
    employees: Employee[];
  };
}
