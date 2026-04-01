import { X } from "lucide-react";
import type { Employee } from "./types";
import { useState } from "react";

interface EditModalProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Employee>) => Promise<void>;
}

const EditEmployeeModal = ({
  employee,
  isOpen,
  onClose,
  onSave,
}: EditModalProps) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    full_name: employee.full_name,
    job_title: employee.job_title,
    contract_salary: employee.contract_salary,
    status: employee.status,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gs-dark/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-gs-surface rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
          <h3 className="text-lg font-bold text-gs-dark dark:text-gs-text-main">
            Edit Employee
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gs-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gs-soft mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gs-dark/50 border border-gray-200 dark:border-white/10 text-gs-dark dark:text-gs-text-main focus:ring-2 focus:ring-gs-primary outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gs-soft mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={formData.job_title}
                onChange={(e) =>
                  setFormData({ ...formData, job_title: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gs-dark/50 border border-gray-200 dark:border-white/10 text-gs-dark dark:text-gs-text-main focus:ring-2 focus:ring-gs-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gs-soft mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Employee["status"],
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gs-dark/50 border border-gray-200 dark:border-white/10 text-gs-dark dark:text-gs-text-main focus:ring-2 focus:ring-gs-primary outline-none transition-all"
              >
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gs-soft mb-1">
              Salary (USD)
            </label>
            <input
              type="number"
              value={formData.contract_salary}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contract_salary: Number(e.target.value),
                })
              }
              className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gs-dark/50 border border-gray-200 dark:border-white/10 text-gs-dark dark:text-gs-text-main font-mono focus:ring-2 focus:ring-gs-primary outline-none transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl font-bold text-sm bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gs-soft hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-xl font-bold text-sm bg-gs-primary text-gs-dark hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
