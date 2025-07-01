// netlify/functions/types.js
// Shared enums for backend functions

const TransactionStatus = Object.freeze({
    COMPLETED: 'Completed',
    PENDING_ZB_CONFIRMATION: 'Pending ZB Confirmation',
    ZB_PAYMENT_SUCCESSFUL: 'ZB Payment Successful',
    ZB_PAYMENT_FAILED: 'ZB Payment Failed',
    CANCELED: 'Canceled',
});

const TransactionType = Object.freeze({
    CASH_PAYMENT: 'Cash Payment',
    ZB_PAYMENT: 'ZB Pay Online',
    FEE_ADJUSTMENT_DEBIT: 'Fee Adjustment (Debit)',
    FEE_ADJUSTMENT_CREDIT: 'Fee Adjustment (Credit)',
    INITIAL_BILLING: 'Initial Term Bill',
});

const NotificationType = Object.freeze({
    NEW_STUDENT: 'new_student',
    CASH_PAYMENT: 'cash_payment',
    ZB_PAYMENT_SUCCESS: 'zb_payment_success',
    PASSWORD_CHANGE: 'password_change',
});

module.exports = {
    TransactionStatus,
    TransactionType,
    NotificationType,
};
