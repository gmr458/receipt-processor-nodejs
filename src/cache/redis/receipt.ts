import type { Redis } from "ioredis";

import type { ReceiptCache } from "../../domain/receipt.js";
import { isNum } from "../../validator/index.js";

export class RedisReceiptCache implements ReceiptCache {
    private duration: number = 2 * 60 * 60;

    constructor(private client: Redis) {}

    async getPointsById(id: string): Promise<number | null> {
        const value = await this.client.get(id);
        if (!value) {
            return null;
        }

        if (!isNum(value)) {
            return null;
        }

        return Number.parseInt(value);
    }

    async setPointsById(id: string, points: number): Promise<void> {
        await this.client.set(id, points, "EX", this.duration);
    }
}
