
import { User, UserRole, Student, Transaction, StudentPaymentStatus, TransactionType, TransactionStatus } from '../types';

// This is an internal type for the mock service, not to be exposed to the client.
type UserWithPassword = User & { password: string };

// --- MOCK DATABASE ---
let users: UserWithPassword[] = [
    { id: 'admin', username: 'admin', role: UserRole.ADMIN, password: 'admin123' },
    { id: 'bursor', username: 'bursor', role: UserRole.BURSAR, password: 'bursor123' },
    { id: 'MHS-001', username: 'MHS-001', role: UserRole.STUDENT, password: 'student123' },
    { id: 'MHS-002', username: 'MHS-002', role: UserRole.STUDENT, password: 'student456' },
];

let students: Student[] = [
    {
        id: 'MHS-001',
        firstName: 'John',
        lastName: 'Doe',
        studentType: 'day_scholar',
        gradeLevel: 'olevel',
        class: 'Form 4A',
        guardianPhoneNumber: '555-0101',
        financials: {
            balance: 350.00,
            terms: {
                '2025_Term3': { fee: 500, paid: 150 },
            }
        },
        paymentStatus: StudentPaymentStatus.PARTIAL,
    },
    {
        id: 'MHS-002',
        firstName: 'Jane',
        lastName: 'Roe',
        studentType: 'boarder',
        gradeLevel: 'alevel_sciences',
        class: 'L6 Science',
        guardianPhoneNumber: '555-0102',
        financials: {
            balance: 550.00,
            terms: {
                '2025_Term3': { fee: 550, paid: 0 },
            }
        },
        paymentStatus: StudentPaymentStatus.ARREARS,
    },
];

let transactions: Transaction[] = [
    {
        id: 'tx_1',
        studentId: 'MHS-001',
        studentName: 'John Doe',
        amount: 500,
        termKey: '2025_Term3',
        type: TransactionType.INITIAL_BILLING,
        status: TransactionStatus.COMPLETED,
        date: new Date('2025-07-01T09:00:00Z').toISOString(),
        receiptNumber: 'INV-001',
    },
    {
        id: 'tx_2',
        studentId: 'MHS-001',
        studentName: 'John Doe',
        amount: 150,
        termKey: '2025_Term3',
        type: TransactionType.CASH_PAYMENT,
        status: TransactionStatus.COMPLETED,
        date: new Date('2025-07-15T14:30:00Z').toISOString(),
        processedBy: 'bursor',
        receiptNumber: 'REC-001'
    },
     {
        id: 'tx_3',
        studentId: 'MHS-002',
        studentName: 'Jane Roe',
        amount: 550,
        termKey: '2025_Term3',
        type: TransactionType.INITIAL_BILLING,
        status: TransactionStatus.COMPLETED,
        date: new Date('2025-07-01T09:00:00Z').toISOString(),
        receiptNumber: 'INV-002',
    },
];

// --- MOCK SERVICE FUNCTIONS ---
// These functions simulate async database calls.

const findUserByUsername = (username: string): Promise<UserWithPassword | undefined> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
            resolve(user);
        }, 500);
    });
};

const getStudentById = (id: string): Promise<Student | undefined> => {
     return new Promise(resolve => {
        setTimeout(() => {
            const student = students.find(s => s.id === id);
            resolve(student);
        }, 500);
    });
};

const getTransactionsByStudentId = (studentId: string): Promise<Transaction[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const studentTransactions = transactions
                .filter(t => t.studentId === studentId)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            resolve(studentTransactions);
        }, 500);
    });
};

const getTransactionById = (id: string): Promise<Transaction | undefined> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(transactions.find(t => t.id === id));
        }, 200);
    });
};

const createTransaction = (data: Omit<Transaction, 'id' | 'date' | 'studentName'>): Promise<Transaction> => {
    return new Promise(resolve => {
        setTimeout(async () => {
            const student = await getStudentById(data.studentId);
            const newTransaction: Transaction = {
                id: `tx_${transactions.length + 1}`,
                date: new Date().toISOString(),
                studentName: `${student?.firstName} ${student?.lastName}`,
                ...data,
            };
            transactions.push(newTransaction);
            resolve(newTransaction);
        }, 400);
    });
};

const updateTransactionStatus = (id: string, status: TransactionStatus): Promise<boolean> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const txIndex = transactions.findIndex(t => t.id === id);
            if (txIndex > -1) {
                transactions[txIndex].status = status;
                resolve(true);
            }
            resolve(false);
        }, 300);
    });
};

const applyPaymentToStudent = (studentId: string, termKey: string, amount: number): Promise<boolean> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const studentIndex = students.findIndex(s => s.id === studentId);
            if(studentIndex > -1) {
                const student = students[studentIndex];
                student.financials.terms[termKey].paid += amount;
                student.financials.balance -= amount;
                // update payment status
                if(student.financials.balance <= 0) {
                    student.paymentStatus = StudentPaymentStatus.PAID;
                } else {
                    student.paymentStatus = StudentPaymentStatus.PARTIAL;
                }
                resolve(true);
            }
            resolve(false);
        }, 300);
    });
};

export const dataService = {
    findUserByUsername,
    getStudentById,
    getTransactionsByStudentId,
    getTransactionById,
    createTransaction,
    updateTransactionStatus,
    applyPaymentToStudent
};