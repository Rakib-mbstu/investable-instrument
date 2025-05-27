import db from '../db/index.js';

class AdminController {
    async viewPendingPurchases(req, res) {
        try {
            const pendingPurchases = await db('transactions')
                .join('instruments', 'transactions.instrument_id', 'instruments.id')
                .select(
                    'transactions.*',
                    'instruments.name as instrument_name',
                    'instruments.current_price',
                    'instruments.estimated_return',
                    'instruments.maturity_time',
                )
                .where('transactions.status', 'pending');
            res.status(200).json(pendingPurchases);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving pending purchases', error });
        }
    }

    async verifyReceipt(req, res) {
        const { transactionId } = req.body;
        const { isApproved } = req.body;

        try {
            const transaction = await db('transactions').where({ id: transactionId }).first();
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }

            await db('transactions').where({ id: transactionId }).update({
                status: isApproved ? 'approved' : 'rejected',
                verifiedAt: new Date(),
            });

            res.status(200).json({ message: 'Transaction updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error verifying receipt', error });
        }
    }

    async approveTransaction(req, res) {
        const { transactionId } = req.body;

        try {
            await db('transactions').where({ id: transactionId }).update({ status: 'approved' });
            res.status(200).json({ message: 'Transaction approved successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error approving transaction', error });
        }
    }

    async rejectTransaction(req, res) {
        const { transactionId } = req.body;

        try {
            await db('transactions').where({ id: transactionId }).update({ status: 'rejected' });
            res.status(200).json({ message: 'Transaction rejected successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error rejecting transaction', error });
        }
    }
}

export default new AdminController();