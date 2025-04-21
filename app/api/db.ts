import { QuickDB } from "quick.db";

// Проверка, чтобы создать экземпляр базы данных только один раз
let db: QuickDB = new QuickDB();


if (!db) {
    db = new QuickDB();
}


export default db;