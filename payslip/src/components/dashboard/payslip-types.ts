export type PayslipData = {
  // UI / branding
  theme: "light" | "dark" | "blue" | "green";
  brandColor?: string;

  // Company
  companyName: string;
  companyLogo: string | null; // base64 or URL

  // Employee
  employeeName: string;
  employeeId: string;
  role: string;
  payPeriod: string;

  // Salary
  basic: number;
  allowances: number;
  deductions: number;

  // Tax settings
  taxAuto: boolean;
  taxRate: number; // %
  taxManual: number;
};

export type PayslipTotals = {
  gross: number;
  tax: number;
  totalDeductions: number;
  net: number;
};

export function computeTotals(d: PayslipData): PayslipTotals {
  const gross = (d.basic || 0) + (d.allowances || 0);

  const tax = d.taxAuto ? Math.max(0, gross * (d.taxRate / 100)) : d.taxManual || 0;

  const totalDeductions = (d.deductions || 0) + tax;

  const net = Math.max(0, gross - totalDeductions);

  return {
    gross,
    tax,
    totalDeductions,
    net,
  };
}

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(isFinite(n) ? n : 0);
