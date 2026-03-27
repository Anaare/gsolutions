import type { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    -- 1. Create Tables
    CREATE TABLE employees (
        id SERIAL PRIMARY KEY,
        full_name varchar(100) NOT NULL,
        email varchar(100) UNIQUE,
        personal_id varchar(50) UNIQUE,
        job_title varchar(100),
        contract_salary numeric,
        hire_date date,
        status varchar(50) DEFAULT 'active',
        bank_account varchar(100) UNIQUE,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
    );

    CREATE TABLE services (
        id SERIAL PRIMARY KEY,
        name varchar(100) NOT NULL,
        status varchar(50) DEFAULT 'active',
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
    );

    CREATE TABLE clients (
        id SERIAL PRIMARY KEY,
        name varchar(100) NOT NULL,
        email varchar(100) NOT NULL,
        service_category_id integer REFERENCES services(id),
        created_at timestamp DEFAULT now()
    );

    CREATE TABLE vendors (
        id SERIAL PRIMARY KEY,
        name varchar(100) NOT NULL,
        service_category_id integer REFERENCES services(id),
        created_at timestamp DEFAULT now()
    );

    CREATE TABLE projects (
        id SERIAL PRIMARY KEY,
        client_id integer REFERENCES clients(id),
        service_category_id integer REFERENCES services(id),
        status varchar(50) DEFAULT 'in progress',
        start_date date,
        created_at timestamp DEFAULT now()
    );

    CREATE TABLE project_vendors (
        id SERIAL PRIMARY KEY,
        project_id integer REFERENCES projects(id),
        vendor_id integer REFERENCES vendors(id),
        agreed_cost numeric,
        created_at timestamp DEFAULT now()
    );

    CREATE TABLE client_invoices (
        id SERIAL PRIMARY KEY,
        project_id integer REFERENCES projects(id),
        invoice_number varchar(50) UNIQUE,
        amount numeric NOT NULL,
        status varchar(50) DEFAULT 'unpaid',
        created_at timestamp DEFAULT now()
    );

    CREATE TABLE vendor_bills (
        id SERIAL PRIMARY KEY,
        project_id integer REFERENCES projects(id),
        vendor_id integer REFERENCES vendors(id),
        amount numeric NOT NULL,
        status varchar(50) DEFAULT 'unpaid',
        created_at timestamp DEFAULT now()
    );

    CREATE TABLE payments (
        id SERIAL PRIMARY KEY,
        invoice_id integer REFERENCES client_invoices(id),
        bill_id integer REFERENCES vendor_bills(id),
        amount numeric NOT NULL,
        paid_at date DEFAULT CURRENT_DATE,
        created_at timestamp DEFAULT now(),
        CONSTRAINT check_payment_source CHECK (
            (invoice_id IS NOT NULL AND bill_id IS NULL) OR 
            (invoice_id IS NULL AND bill_id IS NOT NULL)
        )
    );

   CREATE TABLE payrolls (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),

  -- Base Inputs
  gross_salary NUMERIC(12, 2) NOT NULL,
  pension_member BOOLEAN NOT NULL DEFAULT true,
  
  -- Static Deductions (Enter these manually or default to 0)
 insurance_deduction NUMERIC(12, 2) NOT NULL DEFAULT 0, 
  fitpass_deduction NUMERIC(12, 2) NOT NULL DEFAULT 0,
  other_deduction NUMERIC(12, 2) NOT NULL DEFAULT 0,

  -- 1. Auto-Calculate Pension (2% if they are a member, else 0)
  pension_amount_employee NUMERIC(12, 2) GENERATED ALWAYS AS (
    CASE WHEN pension_member THEN (gross_salary * 0.02) ELSE 0 END
  ) STORED,

  pension_amount_employer NUMERIC(12, 2) GENERATED ALWAYS AS (
    CASE WHEN pension_member THEN (gross_salary * 0.02) ELSE 0 END
  ) STORED,

  -- 2. Auto-Calculate Income Tax
  -- Formula: (Gross - Employee Pension) * 20%
  income_tax NUMERIC(12, 2) GENERATED ALWAYS AS (
    (gross_salary - (CASE WHEN pension_member THEN (gross_salary * 0.02) ELSE 0 END)) * 0.20
  ) STORED,

  -- 3. Auto-Calculate Net Salary
  -- Gross - (Pension + Income Tax + Insurance + Fitpass + Others)
  net_salary NUMERIC(12, 2) GENERATED ALWAYS AS (
    gross_salary - (
      (CASE WHEN pension_member THEN (gross_salary * 0.02) ELSE 0 END) + -- Pension
      ((gross_salary - (CASE WHEN pension_member THEN (gross_salary * 0.02) ELSE 0 END)) * 0.20) + -- Tax
      insurance_deduction + 
      fitpass_deduction + 
      other_deduction
    )
  ) STORED,

  health_insurance_tier VARCHAR(20) DEFAULT 'none',
  pay_period_start DATE,
  pay_period_end DATE,
  payroll_status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DROP TABLE IF EXISTS 
      payments, payrolls, vendor_bills, client_invoices, 
      project_vendors, projects, vendors, clients, 
      services, employees 
    CASCADE;
  `);
}
