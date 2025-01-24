import type { Database } from "better-sqlite3";
import type { Redis } from "ioredis";
import { v4 as uuidv4 } from "uuid";

import { RedisReceiptCache } from "../cache/redis/receipt.js";
import { calculateTotalPoints } from "../domain/receipt-points.js";
import type {
    ReceiptCache,
    ReceiptDto,
    ReceiptRepository,
    ReceiptWithItems,
} from "../domain/receipt.js";
import { SqliteReceiptRepository } from "../repositories/sqlite/receipt.js";

export class ReceiptService {
    private repository: ReceiptRepository;
    private cache: ReceiptCache;

    constructor(sqliteDatabase: Database, redisClient: Redis) {
        this.repository = new SqliteReceiptRepository(sqliteDatabase);
        this.cache = new RedisReceiptCache(redisClient);
    }

    async process(dto: ReceiptDto): Promise<ReceiptWithItems> {
        const receipt: ReceiptWithItems = {
            id: uuidv4(),
            retailer: dto.retailer,
            purchaseDate: dto.purchaseDate,
            purchaseTime: dto.purchaseTime,
            total: dto.total,
            items: dto.items.map((item) => ({ ...item, id: uuidv4() })),
        };

        await this.repository.create(receipt);
        await this.cache.setPointsById(
            receipt.id,
            calculateTotalPoints(receipt),
        );

        return receipt;
    }

    async getPointsById(id: string): Promise<number | null> {
        let points = await this.cache.getPointsById(id);
        if (points) {
            return points;
        }

        const receipt = await this.repository.findById(id);
        if (!receipt) {
            return null;
        }

        points = calculateTotalPoints(receipt);
        await this.cache.setPointsById(receipt.id, points);
        return points;
    }
}
