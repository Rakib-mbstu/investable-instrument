import db from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

class InstrumentController {
    async getInstruments(req, res) {
        try {
            const instruments = await db('instruments').select('*');
            res.status(200).json(instruments);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving instruments', error });
        }
    }

    async bookInstrument(req, res) {
        const { instrumentId, units } = req.body;
        const userId = req.user.id; // Assuming user ID is stored in req.user

        try {
            const instrument = await db('instruments').where({ id: instrumentId }).first();
            if (!instrument || instrument.available_units < units) {
                return res.status(400).json({ message: 'Insufficient units available' });
            }

            const bookingId = uuidv4();
            await db('transactions').insert({
                id: bookingId,
                user_id: userId,
                instrument_id: instrumentId,
                units,
                status: 'pending',
                booked_at: new Date(),
                expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours from now
            });

            await db('instruments').where({ id: instrumentId }).update({
                available_units: instrument.available_units - units
            });

            res.status(201).json({ message: 'Instrument booked successfully', bookingId });
        } catch (error) {
            res.status(500).json({ message: 'Error booking instrument', error });
        }
    }

    async uploadReceipt(req, res) {
        const { bookingId } = req.body;
        const receipt = req.file; // multer puts the file here

        if (!bookingId || !receipt) {
            return res.status(400).json({ message: 'bookingId and file are required' });
        }

        try {
            await db('transactions').where({ id: bookingId }).update({
                receipt_url: receipt.path,
                status: 'pending'
            });

            res.status(200).json({ message: 'Receipt uploaded successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error uploading receipt', error });
        }
    }
    async getOwnedInstruments(req, res) {
        const userId = req.user.id;
        try {
            const owned = await db('transactions')
                .join('instruments', 'transactions.instrument_id', 'instruments.id')
                .select('instruments.*', 'transactions.units', 'transactions.status', 'transactions.updated_at')
                .where('transactions.user_id', userId)
                .andWhere('transactions.status', 'approved');

            res.status(200).json(owned);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving owned instruments', error });
        }
    }
    async getInstrumentById(req, res) {
        const { id } = req.params;
        try {
            const instrument = await db('instruments').where({ id }).first();
            if (!instrument) {
                return res.status(404).json({ message: 'Instrument not found' });
            }
            res.status(200).json(instrument);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving instrument', error });
        }
    }
    async getBookedButNotPaidInstruments(req, res) {
        const userId = req.user.id;
        try {
            const booked = await db('transactions')
                .join('instruments', 'transactions.instrument_id', 'instruments.id')
                .select('instruments.*', 'transactions.units', 'transactions.status', 'transactions.id as transaction_id')
                .where('transactions.user_id', userId)
                .andWhere('transactions.status', 'pending');

            res.status(200).json(booked);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving booked instruments', error });
        }
    }
    async cleanupExpiredBookings() {
        try {
            // Get all expired pending bookings without receipts
            const expiredBookings = await db('transactions')
                .where('status', 'pending')
                .whereNull('receipt_url')
                .where('expires_at', '<', new Date())
                .select('*');

            // For each expired booking, update instrument's available units
            for (const booking of expiredBookings) {
                await db.transaction(async (trx) => {
                    // Release the units back to the instrument
                    await trx('instruments')
                        .where('id', booking.instrument_id)
                        .increment('available_units', booking.units);

                    // Mark the transaction as expired
                    await trx('transactions')
                        .where('id', booking.id)
                        .update({
                            status: 'expired',
                            updated_at: new Date()
                        });
                });
            }
        } catch (error) {
            console.error('Error cleaning up expired bookings:', error);
        }
    }

    // Admin CRUD Methods
    async createInstrument(req, res) {
        const { name, current_price, estimated_return, maturity_time, available_units } = req.body;

        try {
            // Prepare and sanitize input
            const newInstrument = {
                name,
                current_price: Number(current_price),
                estimated_return: Number(estimated_return),
                maturity_time: maturity_time,
                available_units: parseInt(available_units, 10),
            };

            // Insert and return the created instrument
            const [insertedInstrument] = await db('instruments')
                .insert(newInstrument)
                .returning('*'); // Only works in PostgreSQL, not in MySQL

            res.status(201).json(insertedInstrument);
        } catch (error) {
            res.status(500).json({ message: 'Error creating instrument', error });
        }

    }

    async updateInstrument(req, res) {
        const { id } = req.params;
        const { name, currentPrice, estimatedReturn, maturityTime, availableUnits } = req.body;

        try {
            const updates = {};
            if (name) updates.name = name;
            if (currentPrice) updates.current_price = currentPrice;
            if (estimatedReturn) updates.estimated_return = estimatedReturn;
            if (maturityTime) updates.maturity_time = maturityTime;
            if (availableUnits) updates.available_units = availableUnits;

            const updated = await db('instruments')
                .where({ id })
                .update(updates)
                .returning('*');

            if (updated.length === 0) {
                return res.status(404).json({ message: 'Instrument not found' });
            }

            res.status(200).json(updated[0]);
        } catch (error) {
            res.status(500).json({ message: 'Error updating instrument', error });
        }
    }

    async deleteInstrument(req, res) {
        const { id } = req.params;

        try {
            // Check if the instrument has any associated transactions
            const transactions = await db('transactions')
                .where({ instrument_id: id })
                .whereIn('status', ['pending', 'approved']);

            if (transactions.length > 0) {
                return res.status(400).json({
                    message: 'Cannot delete instrument with active transactions'
                });
            }

            const deleted = await db('instruments')
                .where({ id })
                .del()
                .returning('*');

            if (deleted.length === 0) {
                return res.status(404).json({ message: 'Instrument not found' });
            }

            res.status(200).json({ message: 'Instrument deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting instrument', error });
        }
    }
}

export default new InstrumentController();