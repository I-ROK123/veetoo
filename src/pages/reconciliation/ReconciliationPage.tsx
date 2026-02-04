import React, { useState, useEffect } from 'react';
import { FileText, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { invoiceService } from '../../services/invoiceService';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const ReconciliationPage: React.FC = () => {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [reconcileModalOpen, setReconcileModalOpen] = useState(false);

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            setLoading(true);
            const data = await invoiceService.getReconciliationInvoices();
            setInvoices(data);
        } catch (error) {
            toast.error('Failed to load invoices');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRecordPayment = (invoice: any) => {
        setSelectedInvoice(invoice);
        setPaymentModalOpen(true);
    };

    const handleReconcile = (invoice: any) => {
        setSelectedInvoice(invoice);
        setReconcileModalOpen(true);
    };

    const totalPending = invoices.reduce((sum, inv) => sum + parseFloat(inv.balance || 0), 0);
    const totalReconciled = invoices.filter(inv => inv.reconciled).length;

    const columns = [
        {
            key: 'invoice_number',
            label: 'Invoice #',
            sortable: true,
            render: (invoice: any) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-white">{invoice.invoice_number}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(invoice.date).toLocaleDateString()}
                    </div>
                </div>
            )
        },
        {
            key: 'salesperson',
            label: 'Salesperson',
            sortable: true,
            render: (invoice: any) => (
                <span className="text-gray-900 dark:text-white">
                    {invoice.salesPerson?.name || 'Unknown'}
                </span>
            )
        },
        {
            key: 'amount',
            label: 'Amount',
            sortable: true,
            render: (invoice: any) => (
                <span className="font-medium text-gray-900 dark:text-white">
                    ${parseFloat(invoice.amount).toFixed(2)}
                </span>
            )
        },
        {
            key: 'total_paid',
            label: 'Paid',
            sortable: true,
            render: (invoice: any) => (
                <span className="text-green-600 dark:text-green-400">
                    ${parseFloat(invoice.total_paid || 0).toFixed(2)}
                </span>
            )
        },
        {
            key: 'balance',
            label: 'Balance',
            sortable: true,
            render: (invoice: any) => (
                <span className={`font-semibold ${parseFloat(invoice.balance || 0) > 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                    ${parseFloat(invoice.balance || 0).toFixed(2)}
                </span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (invoice: any) => (
                <StatusBadge status={invoice.status} size="sm" />
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (invoice: any) => (
                <div className="flex gap-2">
                    {parseFloat(invoice.balance || 0) > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRecordPayment(invoice);
                            }}
                            className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg"
                        >
                            Pay
                        </button>
                    )}
                    {!invoice.reconciled && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleReconcile(invoice);
                            }}
                            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            Reconcile
                        </button>
                    )}
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Loading invoices...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice Reconciliation</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Track and reconcile invoice payments
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <FileText className="w-4 h-4" />
                        Total Invoices
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{invoices.length}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <DollarSign className="w-4 h-4" />
                        Total Pending
                    </div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        ${totalPending.toFixed(2)}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <CheckCircle className="w-4 h-4" />
                        Reconciled
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalReconciled}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <Clock className="w-4 h-4" />
                        Pending
                    </div>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {invoices.length - totalReconciled}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <DataTable
                    data={invoices}
                    columns={columns}
                    keyExtractor={(invoice) => invoice.id}
                    searchable
                    searchPlaceholder="Search invoices..."
                />
            </div>

            {/* Payment Modal */}
            {paymentModalOpen && selectedInvoice && (
                <PaymentModal
                    invoice={selectedInvoice}
                    isOpen={paymentModalOpen}
                    onClose={() => {
                        setPaymentModalOpen(false);
                        setSelectedInvoice(null);
                    }}
                    onSuccess={() => {
                        loadInvoices();
                        setPaymentModalOpen(false);
                        setSelectedInvoice(null);
                    }}
                />
            )}

            {/* Reconcile Modal */}
            {reconcileModalOpen && selectedInvoice && (
                <ReconcileModal
                    invoice={selectedInvoice}
                    isOpen={reconcileModalOpen}
                    onClose={() => {
                        setReconcileModalOpen(false);
                        setSelectedInvoice(null);
                    }}
                    onSuccess={() => {
                        loadInvoices();
                        setReconcileModalOpen(false);
                        setSelectedInvoice(null);
                    }}
                />
            )}
        </div>
    );
};

// Payment Modal
const PaymentModal: React.FC<{
    invoice: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ invoice, isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        payment_amount: parseFloat(invoice.balance || 0),
        payment_method: 'cash' as 'cash' | 'bank_transfer' | 'cheque' | 'mobile_money',
        reference_number: '',
        notes: ''
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await invoiceService.recordPayment(invoice.id, formData);
            toast.success('Payment recorded successfully');
            onSuccess();
        } catch (error) {
            toast.error('Failed to record payment');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Record Payment" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Invoice</div>
                    <div className="font-medium text-gray-900 dark:text-white">{invoice.invoice_number}</div>
                    <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                        Balance: ${parseFloat(invoice.balance || 0).toFixed(2)}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Payment Amount *
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={invoice.balance}
                        value={formData.payment_amount}
                        onChange={(e) => setFormData({ ...formData, payment_amount: parseFloat(e.target.value) })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Payment Method *
                    </label>
                    <select
                        value={formData.payment_method}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as any })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="cash">Cash</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="cheque">Cheque</option>
                        <option value="mobile_money">Mobile Money</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reference Number
                    </label>
                    <input
                        type="text"
                        value={formData.reference_number}
                        onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notes
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
                    >
                        {saving ? 'Recording...' : 'Record Payment'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

// Reconcile Modal
const ReconcileModal: React.FC<{
    invoice: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ invoice, isOpen, onClose, onSuccess }) => {
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await invoiceService.reconcileInvoice(invoice.id, { reconciliation_notes: notes });
            toast.success('Invoice reconciled successfully');
            onSuccess();
        } catch (error) {
            toast.error('Failed to reconcile invoice');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Reconcile Invoice" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Invoice</div>
                    <div className="font-medium text-gray-900 dark:text-white">{invoice.invoice_number}</div>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                        <div>
                            <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                            <span className="ml-2 font-medium">${parseFloat(invoice.amount).toFixed(2)}</span>
                        </div>
                        <div>
                            <span className="text-gray-600 dark:text-gray-400">Paid:</span>
                            <span className="ml-2 font-medium text-green-600">${parseFloat(invoice.total_paid || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reconciliation Notes
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="All payments verified and matched..."
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                    >
                        {saving ? 'Reconciling...' : 'Reconcile Invoice'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ReconciliationPage;
