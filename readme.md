1. Initilized backed - ✅
2. File/Folder Structure - ✅
3. DB Connection - ✅
4. CRUD operations for user - ✅
5. Password hashing with Bcrypt - ✅
6. JWT Implementation - ✅
7. Auth Middleware implementation - ✅
8. Role Based Access - ✅

9. The Models

Employee: (Not the same as a User). A User logs in; an Employee is a record of someone getting paid. You’ll need fields for grossSalary, pensionRate, taxRate, and netSalary.

Entity (Suppliers & Buyers): \* Pro Tip: You could actually use one "Company" model with a field type: ['supplier', 'buyer', 'both']. This makes it easier if a company you buy from also happens to buy services from you.

Project / Contract: This is your "Dashboard" data. It links a Buyer, a Supplier, and your company.
