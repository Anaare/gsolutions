import { EmployeeDocument } from "../models/Employee.ts";
import { UserDocument } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
      employee: EmployeeDocument;
    }
  }
}
