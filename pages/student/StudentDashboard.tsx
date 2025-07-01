
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { dataService } from '../../services/dataService';
import { Student, Transaction } from '../../types';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

const StudentDashboard: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [student, setStudent] = React.useState<Student | null>(null);
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStudentData = async () => {
            if (user) {
                try {
                    const studentData = await dataService.getStudentById(user.id);
                    const studentTransactions = await dataService.getTransactionsByStudentId(user.id);
                    if (studentData) {
                        setStudent(studentData);
                    }
                    setTransactions(studentTransactions);
                } catch (error) {
                    console.error("Failed to fetch student data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchStudentData();
    }, [user]);

    const handlePayNow = async (termKey: string, amountDue: number) => {
        if (!student) return;

        const toastId = toast.loading('Initiating payment...');
        try {
            const response = await apiService.initiateZbPayTransaction(student.id, amountDue, termKey);
            toast.success('Redirecting to payment gateway...', { id: toastId });
            // In a real app, this would redirect to response.paymentUrl
            // Here we simulate it by navigating to our status page with the details
            navigate(`/student/payment-status?orderRef=${response.orderReference}&txId=${response.transactionId}`);
        } catch (error) {
            toast.error('Failed to initiate payment. Please try again.', { id: toastId });
        }
    };
    
    if (loading) {
        return <div>Loading student data...</div>;
    }

    if (!student) {
        return <div>Could not find student data.</div>;
    }

    const unpaidTerms = Object.entries(student.financials.terms)
        .filter(([, termData]) => termData.fee > termData.paid)
        .map(([termKey, termData]) => ({ termKey, ...termData }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Welcome, {student.firstName}</h1>
                    <p className="text-text-secondary">Here's your financial overview.</p>
                </div>
                <div className="text-right">
                    <p className="text-text-secondary">Total Outstanding Balance</p>
                    <p className={`text-4xl font-extrabold ${student.financials.balance > 0 ? 'text-error' : 'text-success'}`}>
                        ${student.financials.balance.toFixed(2)}
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Unpaid Terms</CardTitle>
                    <CardDescription>
                        {unpaidTerms.length > 0 ? "You have outstanding payments for the following terms. You can pay for each term individually." : "All your fees are paid up. Thank you!"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {unpaidTerms.length > 0 ? (
                        unpaidTerms.map(({ termKey, fee, paid }) => {
                            const due = fee - paid;
                            return (
                                <Card key={termKey} className="bg-background-primary">
                                    <CardHeader className="flex flex-row justify-between items-center p-4">
                                        <div>
                                            <CardTitle className="text-xl">{termKey.replace('_', ' ')}</CardTitle>
                                            <CardDescription>Amount Due: <span className="font-bold text-accent-secondary">${due.toFixed(2)}</span></CardDescription>
                                        </div>
                                        <Button onClick={() => handlePayNow(termKey, due)}>Pay Now</Button>
                                    </CardHeader>
                                </Card>
                            )
                        })
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-lg text-success font-semibold">No outstanding balance!</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Full Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Type</th>
                                    <th className="p-2">Term</th>
                                    <th className="p-2">Amount</th>
                                    <th className="p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(tx => (
                                    <tr key={tx.id} className="border-b border-slate-800">
                                        <td className="p-2">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="p-2">{tx.type}</td>
                                        <td className="p-2">{tx.termKey.replace('_', ' ')}</td>
                                        <td className="p-2">${tx.amount.toFixed(2)}</td>
                                        <td className="p-2">{tx.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentDashboard;