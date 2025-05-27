import { db } from '../db/index.js';

class Instrument {
    constructor(id, name, currentPrice, estimatedReturn, maturityTime, availableUnits) {
        this.id = id;
        this.name = name;
        this.currentPrice = currentPrice;
        this.estimatedReturn = estimatedReturn;
        this.maturityTime = maturityTime;
        this.availableUnits = availableUnits;
    }

    static async getAllInstruments() {
        return await db('instruments').select('*');
    }

    static async getInstrumentById(id) {
        return await db('instruments').where({ id }).first();
    }

    static async createInstrument(instrumentData) {
        const [id] = await db('instruments').insert(instrumentData).returning('id');
        return await this.getInstrumentById(id);
    }

    static async updateInstrument(id, updates) {
        await db('instruments').where({ id }).update(updates);
        return await this.getInstrumentById(id);
    }

    static async deleteInstrument(id) {
        return await db('instruments').where({ id }).del();
    }
}

export default Instrument;