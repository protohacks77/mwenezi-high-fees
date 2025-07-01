import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { Transaction } from '../types';
import { Loader } from 'lucide-react';

const PrintReceiptPage: React.FC = () => {
    const { transactionId } = useParams<{ transactionId: string }>();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!transactionId) {
            setError('No transaction ID provided.');
            setLoading(false);
            return;
        }

        const fetchTransaction = async () => {
            try {
                const txData = await apiService.getTransactionById(transactionId);
                setTransaction(txData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch transaction.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
    }, [transactionId]);
    
    useEffect(() => {
        if(transaction) {
            // Trigger print dialog once data is loaded
            window.print();
        }
    }, [transaction]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-white text-black"><Loader className="animate-spin mr-2" /> Loading Receipt...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">{error}</div>;
    }
    
    if (!transaction) {
        return <div className="text-center p-8">Transaction not found.</div>;
    }

    return (
        <div className="bg-white text-black font-sans p-8 max-w-2xl mx-auto">
            <style>{`
                @media print {
                    body { -webkit-print-color-adjust: exact; }
                    @page { margin: 0.5in; }
                }
            `}</style>
            <header className="flex justify-between items-center border-b-2 border-gray-800 pb-4">
                <div>
                    <img src="/mwenezihighlogo.png" alt="School Logo" className="h-20" />
                </div>
                <div className="text-right">
                    <h1 className="text-3xl font-bold text-gray-800">Payment Receipt</h1>
                    <p className="text-gray-600">Mwenezi High School</p>
                    <p className="text-gray-500 text-sm">P.O. Box 56, Neshuro, Mwenezi</p>
                </div>
            </header>

            <main className="my-8">
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Billed To</h2>
                        <p className="font-bold text-lg">{transaction.studentName}</p>
                        <p className="text-gray-600">Student ID: {transaction.studentId}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Receipt Details</h2>
                        <p><span className="font-semibold">Receipt #:</span> {transaction.receiptNumber}</p>
                        <p><span className="font-semibold">Date:</span> {new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="p-3">Description</th>
                            <th className="p-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="p-3">
                                <p className="font-semibold">Payment for {transaction.termKey.replace('_', ' ')}</p>
                                <p className="text-sm text-gray-600">Payment Method: {transaction.type}</p>
                            </td>
                            <td className="p-3 text-right font-mono">${transaction.amount.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
                
                <div className="flex justify-end mt-4">
                    <div className="w-1/2">
                        <div className="flex justify-between p-2">
                            <span className="font-semibold">Subtotal</span>
                            <span className="font-mono">${transaction.amount.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between p-3 bg-gray-800 text-white font-bold text-xl">
                            <span>Total Paid</span>
                            <span className="font-mono">${transaction.amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-sm text-gray-500">
                    <p>Thank you for your payment!</p>
                    <p>This is an official receipt. Please keep it for your records.</p>
                </div>
            </main>
        </div>
    );
};

export default PrintReceiptPage;