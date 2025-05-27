export async function up(knex) {
    // Users table
    await knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('username').notNullable().unique();
        table.string('password').notNullable();
        table.string('role').notNullable();
        table.timestamps(true, true);
    });

    // Instruments table
    await knex.schema.createTable('instruments', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.decimal('current_price').notNullable();
        table.decimal('estimated_return').notNullable();
        table.integer('maturity_time').notNullable();
        table.integer('available_units').notNullable();
        table.timestamps(true, true);
    });

    // Transactions table
    await knex.schema.createTable('transactions', (table) => {
        table.uuid('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('instrument_id').unsigned().references('id').inTable('instruments').onDelete('CASCADE');
        table.integer('units').notNullable();
        table.string('status').notNullable();
        table.timestamp('booked_at').defaultTo(knex.fn.now());
        table.timestamp('expires_at');
        table.string('receipt_url');
        table.timestamp('verifiedAt');
        table.timestamps(true, true);
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists('transactions');
    await knex.schema.dropTableIfExists('instruments');
    await knex.schema.dropTableIfExists('users');
}