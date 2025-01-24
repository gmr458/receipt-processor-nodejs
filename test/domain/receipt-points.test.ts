import { describe, expect, test } from "vitest";

import {
    calculateTotalPoints,
    getPointsForEveryNItems,
    getPointsItemsDescription,
    getPointsPurchaseDayIsOdd,
    getPointsRetailerName,
    getPointsRoundDollar,
    getPointsTimeOfPurchase,
    getPointsTotalIsMultipleOf,
} from "../../src/domain/receipt-points.js";
import type { ReceiptWithItems } from "../../src/domain/receipt.js";

describe("test receipt points functions #1", () => {
    const receiptId = crypto.randomUUID();
    const receipt: ReceiptWithItems = {
        id: receiptId,
        retailer: "Target",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [
            {
                id: crypto.randomUUID(),
                shortDescription: "Mountain Dew 12PK",
                price: 6.49,
                receiptId,
            },
            {
                id: crypto.randomUUID(),
                shortDescription: "Emils Cheese Pizza",
                price: 12.25,
                receiptId,
            },
            {
                id: crypto.randomUUID(),
                shortDescription: "Knorr Creamy Chicken",
                price: 1.26,
                receiptId,
            },
            {
                id: crypto.randomUUID(),
                shortDescription: "Doritos Nacho Cheese",
                price: 3.35,
                receiptId,
            },
            {
                id: crypto.randomUUID(),
                shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
                price: 12.0,
                receiptId,
            },
        ],
        total: 35.35,
    };

    test("getPointsRetailerName returns 6", () => {
        const points = getPointsRetailerName(receipt);
        expect(points).toBe(6);
    });

    test("getPointsRoundDollar returns 0", () => {
        const points = getPointsRoundDollar(receipt);
        expect(points).toBe(0);
    });

    test("getPointsTotalIsMultipleOf(receipt, 0.25) returns 0", () => {
        const points = getPointsTotalIsMultipleOf(receipt, 0.25);
        expect(points).toBe(0);
    });

    test("getPointsForEveryNItems(receipt, 2) returns 10", () => {
        const points = getPointsForEveryNItems(receipt, 2);
        expect(points).toBe(10);
    });

    test("getPointsPurchaseDayIsOdd returns 6", () => {
        const points = getPointsPurchaseDayIsOdd(receipt);
        expect(points).toBe(6);
    });

    test("getPointsItemsDescription returns 6", () => {
        const points = getPointsItemsDescription(receipt);
        expect(points).toBe(6);
    });

    test("getPointsItemsDescription returns 0", () => {
        const points = getPointsTimeOfPurchase(receipt);
        expect(points).toBe(0);
    });

    test("calculateTotalPoints returns 28", () => {
        const points = calculateTotalPoints(receipt);
        expect(points).toBe(28);
    });
});

describe("test receipt points functions #2", () => {
    const receiptId = crypto.randomUUID();
    const receipt: ReceiptWithItems = {
        id: receiptId,
        retailer: "M&M Corner Market",
        purchaseDate: "2022-03-20",
        purchaseTime: "14:33",
        items: [
            {
                id: crypto.randomUUID(),
                shortDescription: "Gatorade",
                price: 2.25,
                receiptId,
            },
            {
                id: crypto.randomUUID(),
                shortDescription: "Gatorade",
                price: 2.25,
                receiptId,
            },
            {
                id: crypto.randomUUID(),
                shortDescription: "Gatorade",
                price: 2.25,
                receiptId,
            },
            {
                id: crypto.randomUUID(),
                shortDescription: "Gatorade",
                price: 2.25,
                receiptId,
            },
        ],
        total: 9.0,
    };

    test("getPointsRetailerName returns 14", () => {
        const points = getPointsRetailerName(receipt);
        expect(points).toBe(14);
    });

    test("getPointsRoundDollar returns 50", () => {
        const points = getPointsRoundDollar(receipt);
        expect(points).toBe(50);
    });

    test("getPointsTotalIsMultipleOf(receipt, 0.25) returns 25", () => {
        const points = getPointsTotalIsMultipleOf(receipt, 0.25);
        expect(points).toBe(25);
    });

    test("getPointsForEveryNItems(receipt, 2) returns 10", () => {
        const points = getPointsForEveryNItems(receipt, 2);
        expect(points).toBe(10);
    });

    test("getPointsPurchaseDayIsOdd returns 0", () => {
        const points = getPointsPurchaseDayIsOdd(receipt);
        expect(points).toBe(0);
    });

    test("getPointsItemsDescription returns 0", () => {
        const points = getPointsItemsDescription(receipt);
        expect(points).toBe(0);
    });

    test("getPointsItemsDescription returns 10", () => {
        const points = getPointsTimeOfPurchase(receipt);
        expect(points).toBe(10);
    });

    test("calculateTotalPoints returns 109", () => {
        const points = calculateTotalPoints(receipt);
        expect(points).toBe(109);
    });
});
