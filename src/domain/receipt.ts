import { isValid, parse } from "date-fns";

import type { Case, Validator } from "../validator/index.js";

export type Item = {
    id: string;
    shortDescription: string;
    price: number;
    receiptId: string;
};

export type ItemDto = Omit<Item, "id">;

export type Receipt = {
    id: string;
    retailer: string;
    purchaseDate: string;
    purchaseTime: string;
    total: number;
};

export type ReceiptWithItems = Receipt & { items: Item[] };

export type ReceiptDto = Omit<Receipt, "id"> & {
    items: ItemDto[];
};

export interface ReceiptRepository {
    findById(id: string): Promise<ReceiptWithItems | null>;
    create(receipt: ReceiptWithItems): Promise<void>;
}

export interface ReceiptCache {
    getPointsById(id: string): Promise<number | null>;
    setPointsById(id: string, points: number): Promise<void>;
}

export function validateReceiptDto(
    validator: Validator,
    dto: ReceiptDto,
): void {
    const msgNotUndefinedOrNull = "cannot be undefined or null";

    const casesUndefinedOrNull: Case[] = [
        {
            ok: dto.retailer !== undefined && dto.retailer !== null,
            cause: "retailer",
            detail: msgNotUndefinedOrNull,
        },
        {
            ok: dto.purchaseDate !== undefined && dto.purchaseDate !== null,
            cause: "purchaseDate",
            detail: msgNotUndefinedOrNull,
        },
        {
            ok: dto.purchaseTime !== undefined && dto.purchaseTime !== null,
            cause: "purchaseTime",
            detail: msgNotUndefinedOrNull,
        },
        {
            ok: dto.total !== undefined && dto.total !== null,
            cause: "total",
            detail: msgNotUndefinedOrNull,
        },
    ];

    validator.check(casesUndefinedOrNull);
    if (!validator.ok) {
        return;
    }

    const cases: Case[] = [
        {
            ok: dto.retailer !== "",
            cause: "retailer",
            detail: "cannot be empty",
        },
        {
            ok: dto.retailer.length <= 50,
            cause: "retailer",
            detail: "max length is 50 characters",
        },
        {
            ok: () => {
                const parsedDate = parse(
                    dto.purchaseDate,
                    "yyyy-MM-dd",
                    new Date(),
                );
                return isValid(parsedDate);
            },
            cause: "purchaseDate",
            detail: "invalid format, the valid format is yyyy-MM-dd",
        },
        {
            ok: () => {
                const parsedDate = parse(dto.purchaseTime, "HH:mm", new Date());
                return isValid(parsedDate);
            },
            cause: "purchaseTime",
            detail: "invalid format, the valid format is hh:mm",
        },
        {
            ok: dto.total >= 0,
            cause: "total",
            detail: "cannot be negative",
        },
    ];

    validator.check(cases);
}
