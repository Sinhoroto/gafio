import knex from "knex";

export async function up(knex: knex) {
   return knex.schema.createTable("Historico", (table) => {
      table.increments("IdHistorico").primary();
      table
         .integer("NroProntuario")
         .notNullable()
         .references("NroProntuario")
         .inTable("Prontuario")
         .unsigned();
      table.string("NomePaciente").notNullable();
      table.date("DataNascimento").notNullable();
      table.enu("Genero", ["M", "F"]);
      table.timestamps(true, true);
   });
}

export async function down(knex: knex) {
   return knex.schema.dropTable("Historico");
}
