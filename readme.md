🚀 GSolutions B2B ERP - Frontend Roadmap
📍 Phase 1: Foundation & Layout (The "Shell")
Goal: Build the navigation and global state so the app feels real.

[ ] Global Styling: Set up Tailwind CSS and define your brand colors (Primary: Blue/Purple from your reference image).

[ ] Main Layout Component: Create a Sidebar and TopBar wrapper that persists across all pages.

[ ] Navigation Config: Create a central array for menu items (Dashboard, Projects, Clients, Vendors, Invoices, HR).

[ ] Axios Instance: Create a services/api.js file with your baseURL: http://localhost:3000/api/v1 and interceptors for future Auth.

[ ] Responsive Design: Ensure the sidebar collapses on mobile/small screens.

📊 Phase 2: The Dashboard (The "Analytics Hub")
Goal: Replicate your reference image with real or mock data summaries.

[ ] Stat Cards: Build the 4 top cards (Total Revenue, Receivables, Payables, Active Projects).

[ ] Main Chart: Implement a Bar/Line chart (using Recharts or Chart.js) for Monthly Cash Flow (Income vs. Expenses).

[ ] Activity Feed: Create a "Upcoming Deadlines" list for Projects and Unpaid Invoices.

[ ] Global Filters: Add a Date Range picker (This Month, Last 3 Months, This Year) to the top of the Dashboard.

🏗️ Phase 3: Core Operations (Data Management)
Goal: CRUD operations for the 6 main entities.

Projects & Services

[ ] List View: Table with status badges (In Progress, Completed).

[ ] Create/Edit Form: Link Projects to Clients and select Service Categories.

Partners (Clients & Vendors)

[ ] Directory: Searchable list of all B2B partners.

[ ] Profile View: Click a Client to see all their related Projects and Invoices.

Human Resources

[ ] Employee List: Table with "Active/Terminated" status toggles.

[ ] Payroll Calculator: Form that calculates Net Salary based on Gross + deductions.

💸 Phase 4: Financial Engine (Billing & Payments)
Goal: The complex "Money" logic.

[ ] Invoice/Bill Generator: Form to create new Client Invoices or Vendor Bills linked to specific Projects.

[ ] Payment Recording: A modal to "Mark as Paid" which creates a record in the payments table.

[ ] VAT Tracking: Logic to show VAT amounts vs. Net amounts in summaries.

🔐 Phase 5: Security & Polishing (The "Final Boss")
Goal: Multi-user access and error handling.

[ ] User Authentication: Login/Logout flow using your existing authRoutes.

[ ] Role-Based Access (RBAC): - Director: Sees everything.

Accountant: Only Financials & HR.

Project Manager: Only Projects, Clients, and Vendors.

[ ] Loading States: Add Skeleton screens or Spinners for a "premium" feel.

[ ] Error Toasts: Add react-hot-toast to show backend error messages (from your AppError class).

✅ Phase 6: Final Deployment
[ ] Production Build: npm run build.

[ ] Environment Variables: Ensure .env is set for production API URLs.

[ ] Database Backup: Script to dump the PostgreSQL data daily.

Frosted Mint (#E0EEC6),Background,"This is much softer than pure white. Use this as your main page background to give the app a unique, calm identity."
Dark Slate Grey (#243E36),Navigation / Sidebar,"This is your ""Power"" color. Use it for the Sidebar or Top Header. It provides great contrast for white text/icons."
Muted Teal (#7CA982),Primary Action,"Your main buttons (Create Project, Add Employee) and active menu states. It looks very professional."
Smoky Rose (#7A5C61),Secondary / Accents,"Great for ""Status"" badges (like In Progress or On Hold) or to differentiate Vendor data from Client data."
Thistle (#D9BDC5),Soft Surface,"Use this very sparingly—maybe for ""Hover"" states on table rows or subtle borders."
