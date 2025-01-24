import { parse } from "date-fns";

import {
    hasZeroDecimal,
    isAlphanumeric,
    isOdd,
    xIsMultipleOfy,
} from "../validator/index.js";
import type { Receipt, ReceiptWithItems } from "./receipt.js";

export function getPointsRetailerName(
    receipt: Receipt | ReceiptWithItems,
): number {
    let points = 0;
    for (const char of receipt.retailer) {
        if (isAlphanumeric(char)) {
            points += 1;
        }
    }
    return points;
}

export function getPointsRoundDollar(
    receipt: Receipt | ReceiptWithItems,
): number {
    if (hasZeroDecimal(receipt.total)) {
        return 50;
    }
    return 0;
}

export function getPointsTotalIsMultipleOf(
    receipt: Receipt | ReceiptWithItems,
    num: number,
): number {
    if (xIsMultipleOfy(receipt.total, num)) {
        return 25;
    }
    return 0;
}

export function getPointsForEveryNItems(
    receipt: ReceiptWithItems,
    n: number,
): number {
    const points = 5;
    return Math.floor(receipt.items.length / n) * points;
}

export function getPointsItemsDescription(receipt: ReceiptWithItems): number {
    let points = 0;
    for (const item of receipt.items) {
        const trimmedLen = item.shortDescription.trim().length;
        if (xIsMultipleOfy(trimmedLen, 3)) {
            const p = Math.ceil(item.price * 0.2);
            points += p;
        }
    }
    return points;
}

export function getPointsPurchaseDayIsOdd(
    receipt: Receipt | ReceiptWithItems,
): number {
    const parsedDate = parse(receipt.purchaseDate, "yyyy-MM-dd", new Date());
    const day = parsedDate.getDate();
    if (isOdd(day)) {
        return 6;
    }
    return 0;
}

export function getPointsTimeOfPurchase(
    receipt: Receipt | ReceiptWithItems,
): number {
    const parsedDate = parse(receipt.purchaseTime, "HH:mm", new Date());
    const hours = parsedDate.getHours();
    const mins = parsedDate.getMinutes();
    if (hours >= 14 && mins > 0 && hours < 16) {
        return 10;
    }
    return 0;
}

export function calculateTotalPoints(receipt: ReceiptWithItems): number {
    let points = 0;

    points += getPointsRetailerName(receipt);
    points += getPointsRoundDollar(receipt);
    points += getPointsTotalIsMultipleOf(receipt, 0.25);
    points += getPointsForEveryNItems(receipt, 2);
    points += getPointsItemsDescription(receipt);
    points += getPointsPurchaseDayIsOdd(receipt);
    points += getPointsTimeOfPurchase(receipt);

    return points;
}
