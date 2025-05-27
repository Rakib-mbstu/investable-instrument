import { Model } from 'objection';
import knex from '../db/index.js';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';
config();

Model.knex(knex);

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'password', 'role'],

      properties: {
        id: { type: 'integer' },
        username: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1 },
        role: { type: 'string', enum: ['user', 'admin'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }

  static get relationMappings() {
    const Transaction = import('./transaction.js').then((module) => module.default);

    return {
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: Transaction,
        join: {
          from: 'users.id',
          to: 'transactions.userId',
        },
      },
    };
  }

  static async findByCredentials(username, password) {
    const user = await this.query().findOne({ username });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    return user;
  }

  static async createUser({ username, password, role }) {
    const existingUser = await this.query().findOne({ username });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Check password strength
    if (password.length < 4) {
      throw new Error('Password must be at least 6 characters long');
    }
    const hashedPassword = await bcrypt.hash(password, 4);

    const user = await this.query().insert({
      username,
      password: hashedPassword,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Remove password from returned user object
    delete user.password;
    return user;
  }

  async generateAuthToken() {
    const payload = { id: this.id, role: this.role, username: this.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '72h',
    });
    return token;
  }
}

export default User;