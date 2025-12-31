import mongoose, { Schema, Document, Query, Model } from "mongoose";
import type { Employee, User } from "../types/types.js";

export interface EmployeeDocument extends Document, Omit<Employee, "_id"> {}

export interface EmployeeModel extends Model<EmployeeDocument> {
  restoreByPersonalId(id: string): Promise<EmployeeDocument | null>;
}
export const employeeSchema = new Schema<EmployeeDocument>(
  {
    firstName: { type: String, required: [true, "Please add a first name"] },
    lastName: { type: String, required: [true, "Please add a last name"] },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    personalId: {
      type: String,
      unique: true,
      required: [true, "Please provide personal ID of an employee"],
    },
    position: {
      type: String,
      required: [true, "Please, provide position of an employee"],
    },
    grossSalary: {
      type: Number,
      required: [true, "Please, provide gross salary of an employee"],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    employeePension: Number,
    employerPension: Number,
    incomeTax: Number,
    netSalary: Number,
  },
  { timestamps: true }
);

// Calculation Logic (Middleware)
employeeSchema.pre("save", function (next) {
  if (!this.isModified("grossSalary")) return;

  // 1. Pension (2% each)
  this.employeePension = this.grossSalary * 0.02;
  this.employerPension = this.grossSalary * 0.02;

  // 2. Income Tax (20% in Georgia, calculated after employee pension)
  const taxableBase = this.grossSalary - this.employeePension;
  this.incomeTax = taxableBase * 0.2;

  // 3. Net Salary
  this.netSalary = this.grossSalary - this.employeePension - this.incomeTax;
});

// // Filtering out inactive employees
// employeeSchema.pre(
//   /^find/,
//   async function (this: Query<any, EmployeeDocument>) {
//     const filter = this.getFilter();

//     // 1. If we are explicitly looking for active: false, skip the filter
//     if (filter.active === false) return;

//     // 2. Otherwise, only find active employees
//     this.find({ active: { $ne: false } });
//   }
// );

// employeeSchema.statics.restoreByPersonalId = function (id: string) {
//   return this.findOneAndUpdate(
//     { personalId: id, active: false },
//     { active: true },
//     { new: true }
//   ).select("+active");
// };

// 1. Middleware (Async, No next, Restore-friendly)
employeeSchema.pre(
  /^find/,
  async function (this: Query<any, EmployeeDocument>) {
    const filter = this.getFilter();
    if (filter.active === false) return;

    this.find({ active: { $ne: false } });
  }
);

// 2. Static Method
employeeSchema.statics.restoreByPersonalId = function (
  this: Model<EmployeeDocument>, // Change from EmployeeModel to Model<EmployeeDocument>
  id: string
) {
  return this.findOneAndUpdate(
    { personalId: id, active: false },
    { active: true },
    { new: true }
  ).select("+active");
};

const Employee = mongoose.model<EmployeeDocument, EmployeeModel>(
  "Employee",
  employeeSchema
);

export default Employee;
