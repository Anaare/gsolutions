import { useEffect, useState } from "react";
import type { Employee } from "../components/Employees/types/index";

export const useFetchEmployees = () => {
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);

        const API_URL = import.meta.env.VITE_API_URL;

        const res = await fetch(`${API_URL}/api/v1/employees`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        console.log(json);

        const employeesArray = json.data.employees;

        if (Array.isArray(employeesArray)) {
          setEmployees(employeesArray);
        } else {
          throw new Error("Invalid review data structure received from API.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        setEmployees(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return { employees, loading, error };
};
