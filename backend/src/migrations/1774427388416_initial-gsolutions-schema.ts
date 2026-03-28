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
        status varchar(50) DEFAULT 'active',
        created_at timestamp DEFAULT now()
    );

    CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    identification_number VARCHAR(50) NOT NULL UNIQUE,
    is_vat_payer BOOLEAN NOT NULL DEFAULT true,
    
    email VARCHAR(100),
    phone VARCHAR(50),
    
    bank_account_number VARCHAR(100),
    bank_name VARCHAR(50),
    address TEXT,
    
    service_category_id INTEGER REFERENCES services(id),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    
    CONSTRAINT check_contact_info CHECK (
        email IS NOT NULL OR phone IS NOT NULL
    )
);

    CREATE TABLE projects (
        id SERIAL PRIMARY KEY,
        client_id integer REFERENCES clients(id),
        service_category_id integer REFERENCES services(id),
        total_contract_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
        status varchar(50) DEFAULT 'in progress',
        start_date date,
        end_date date,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT NOW()
    );

    CREATE TABLE project_vendors (
        id SERIAL PRIMARY KEY,
        project_id integer REFERENCES projects(id),
        vendor_id integer REFERENCES vendors(id),
        total_contract_price numeric,
        status VARCHAR(50) DEFAULT 'in progress',
        created_at timestamp DEFAULT now(), 
        updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE client_invoices (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    client_id INTEGER REFERENCES clients(id), 
    invoice_number VARCHAR(50) UNIQUE,
    amount NUMERIC(12, 2) NOT NULL,
    description TEXT, 
    status VARCHAR(50) DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

    CREATE TABLE vendors_bills (
        id SERIAL PRIMARY KEY,
        project_id integer REFERENCES projects(id),
        vendor_id integer REFERENCES vendors(id),
        invoice_number VARCHAR(50) UNIQUE,
        amount numeric NOT NULL,
        description TEXT, 
        status varchar(50) DEFAULT 'unpaid',
        created_at timestamp DEFAULT now(), 
        updated_at TIMESTAMP DEFAULT NOW()
    );

   CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    client_invoice_id INTEGER REFERENCES client_invoices(id),
    vendor_bill_id INTEGER REFERENCES vendors_bills(id),
    
    amount NUMERIC(12, 2) NOT NULL,
    payment_type VARCHAR(10) CHECK (payment_type IN ('income', 'expense')), 
    
    -- Status for Soft Deletes! 🛡️
    -- 'completed' = money is in the bank
    -- 'voided' = the soft-deleted state (ignored in totals)
    status VARCHAR(20) DEFAULT 'completed', 
    
    payment_date DATE DEFAULT CURRENT_DATE,
    method VARCHAR(50), 
    reference_number TEXT, 
    
    CONSTRAINT one_target_only CHECK (
        (client_invoice_id IS NOT NULL AND vendor_bill_id IS NULL) OR 
        (client_invoice_id IS NULL AND vendor_bill_id IS NOT NULL)
    ),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
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
      payments, payrolls, vendors_bills, client_invoices, 
      project_vendors, projects, vendors, clients, 
      services, employees 
    CASCADE;
  `);
}
