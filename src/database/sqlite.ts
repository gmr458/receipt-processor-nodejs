import Database from "better-sqlite3";

const filename = "./database/local.db";

const db = new Database(filename);
console.log(`sqlite connection stablished with ${filename}`);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export { db };
