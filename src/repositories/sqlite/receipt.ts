import type { Database } from "better-sqlite3";

import type {
    Item,
    Receipt,
    ReceiptRepository,
    ReceiptWithItems,
} from "../../domain/receipt.js";

export class SqliteReceiptRepository implements ReceiptRepository {
    constructor(private database: Database) {}

    async findById(id: string): Promise<ReceiptWithItems | null> {
        const selectReceipt = `
            SELECT
                id,
                retailer,
                purchase_date AS purchaseDate,
                purchase_time AS purchaseTime,
                total
            FROM receipt
            WHERE id = ?`;

        const statementReceipt = this.database.prepare<string[], Receipt>(
            selectReceipt,
        );
        const receipt = statementReceipt.get(id);
        if (!receipt) {
            return null;
        }

        const selectItems = `
            SELECT
                id,
                short_description AS shortDescription,
                price,
                receipt_id AS receiptId
            FROM item
            WHERE receipt_id = ?`;
        const statementItems = this.database.prepare<string[], Item>(
            selectItems,
        );
        const items = statementItems.all(id);
        if (!items) {
            return null;
        }

        return { ...receipt, items };
    }

    async create(receipt: ReceiptWithItems): Promise<void> {
        const transaction = this.database.transaction(
            (receipt: ReceiptWithItems) => {
                const queryReceipt = `
                    INSERT INTO receipt (
                        id,
                        retailer,
                        purchase_date,
                        purchase_time,
                        total
                    ) VALUES (?, ?, ?, ?, ?)`;
                const args: unknown[] = [
                    receipt.id,
                    receipt.retailer,
                    receipt.purchaseDate,
                    receipt.purchaseTime,
                    receipt.total,
                ];
                this.database.prepare(queryReceipt).run(...args);

                let queryItems =
                    "INSERT INTO item (id, short_description, price, receipt_id) VALUES ";
                const argsItems: unknown[] = [];
                receipt.items.forEach((item, index) => {
                    if (index > 0) {
                        queryItems += ",";
                    }
                    queryItems += "(?,?,?,?)";
                    argsItems.push(
                        item.id,
                        item.shortDescription,
                        item.price,
                        receipt.id,
                    );
                });
                this.database.prepare(queryItems).run(...argsItems);
            },
        );

        transaction(receipt);
    }
}
