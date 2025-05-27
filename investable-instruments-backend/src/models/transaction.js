import db from '../db/index.js';

class Transaction {
    constructor(id, userId, instrumentId, amount, status, receiptUrl, createdAt, updatedAt) {
        this.id = id;
        this.userId = userId;
        this.instrumentId = instrumentId;
        this.amount = amount;
        this.status = status;
        this.receiptUrl = receiptUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async createTransaction(userId, instrumentId, amount, receiptUrl) {
        const [transaction] = await db('transactions').insert({
            user_id: userId,
            instrument_id: instrumentId,
            amount,
            status: 'pending',
            receipt_url: receiptUrl,
            created_at: new Date(),
            updated_at: new Date()
        }).returning('*');
        return new Transaction(transaction.id, transaction.user_id, transaction.instrument_id, transaction.amount, transaction.status, transaction.receipt_url, transaction.created_at, transaction.updated_at);
    }

    static async getPendingTransactions() {
        const transactions = await db('transactions').where({ status: 'pending' });
        return transactions.map(transaction => new Transaction(transaction.id, transaction.user_id, transaction.instrument_id, transaction.amount, transaction.status, transaction.receipt_url, transaction.created_at, transaction.updated_at));
    }

    static async verifyTransaction(transactionId, isApproved) {
        const status = isApproved ? 'approved' : 'rejected';
        const [transaction] = await db('transactions').where({ id: transactionId }).update({
            status,
            updated_at: new Date()
        }).returning('*');
        return new Transaction(transaction.id, transaction.user_id, transaction.instrument_id, transaction.amount, transaction.status, transaction.receipt_url, transaction.created_at, transaction.updated_at);
    }
}

export default Transaction;