export enum UserRole {
  ADMIN = 'admin',
  BURSAR = 'bursar',
  STUDENT = 'student'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthenticatedUser extends User {
  token: string;
}

export interface TermFee {
  fee: number;
  paid: number;
}

export interface StudentFinancials {
  balance: number; // This is a calculated value
  terms: {
    [termKey: string]: TermFee; // e.g., "2025_Term3": { fee: 500, paid: 100 }
  };
}

export enum StudentPaymentStatus {
    PAID = 'Paid in Full',
    PARTIAL = 'Partially Paid',
    ARREARS = 'In Arrears',
    UNKNOWN = 'Unknown'
}

export type StudentType = 'day_scholar' | 'boarder';
export type GradeLevel = 'zjc' | 'olevel' | 'alevel_sciences' | 'alevel_commercials' | 'alevel_arts';

export interface Student {
  id: string; // e.g., MHS-001
  firstName: string;
  lastName: string;
  studentType: StudentType;
  gradeLevel: GradeLevel;
  class: string; // e.g. "1A1", "L6S"
  guardianPhoneNumber: string;
  financials: StudentFinancials;
  paymentStatus: StudentPaymentStatus;
}

export enum TransactionStatus {
    COMPLETED = 'Completed',
    PENDING_ZB_CONFIRMATION = 'Pending ZB Confirmation',
    ZB_PAYMENT_SUCCESSFUL = 'ZB Payment Successful',
    ZB_PAYMENT_FAILED = 'ZB Payment Failed',
    CANCELED = 'Canceled',
}

export enum TransactionType {
    CASH_PAYMENT = 'Cash Payment',
    ZB_PAYMENT = 'ZB Pay Online',
    FEE_ADJUSTMENT_DEBIT = 'Fee Adjustment (Debit)',
    FEE_ADJUSTMENT_CREDIT = 'Fee Adjustment (Credit)',
    INITIAL_BILLING = 'Initial Term Bill',
}


export interface Transaction {
    id: string;
    studentId: string;
    studentName: string;
    amount: number;
    termKey: string;
    type: TransactionType;
    status: TransactionStatus;
    date: string; // ISO 8601 format
    receiptNumber: string;
    processedBy?: string; // Bursar/Admin ID/Username
    orderReference?: string; // For ZB Pay
}

export interface FeeStructure {
    zjc: { day_scholar: number; boarder: number };
    olevel: { day_scholar: number; boarder: number };
    alevel_sciences: { day_scholar: number; boarder: number };
    alevel_commercials: { day_scholar: number; boarder: number };
    alevel_arts: { day_scholar: number; boarder: number };
}

export interface SchoolConfig {
    activeTerms: string[]; // e.g., ["2025_Term3"]
    fees: FeeStructure;
}

export enum NotificationType {
    NEW_STUDENT = 'new_student',
    CASH_PAYMENT = 'cash_payment',
    ZB_PAYMENT_SUCCESS = 'zb_payment_success',
    PASSWORD_CHANGE = 'password_change',
}

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    timestamp: string; // ISO 8601
    isRead: boolean;
    relatedId?: string; // e.g. studentId or transactionId
}
