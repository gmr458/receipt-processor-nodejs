import { Hono } from "hono";

import { redis } from "../database/redis.js";
import { db } from "../database/sqlite.js";
import { validateReceiptDto, type ReceiptDto } from "../domain/receipt.js";
import { ReceiptService } from "../service/receipt.js";
import { Validator } from "../validator/index.js";

const receiptRoutes = new Hono();
const receiptService = new ReceiptService(db, redis);

receiptRoutes.post("/process", async (c) => {
    const contentType = c.req.header("Content-Type");
    if (!contentType || contentType !== "application/json") {
        return c.json({ error: "incorrect content-type" }, 400);
    }

    const body = await c.req.json<ReceiptDto>();
    const validator = new Validator();
    validateReceiptDto(validator, body);
    if (!validator.ok) {
        return c.json(
            { error: "invalid field/s", details: validator.errors },
            400,
        );
    }

    const receipt = await receiptService.process(body);

    return c.json({ id: receipt.id }, 201);
});

receiptRoutes.get("/:id/points", async (c) => {
    const { id } = c.req.param();
    if (!id) {
        return c.json(
            {
                error: "invalid path parameter",
                details: { id: "id cannot be an empty string" },
            },
            400,
        );
    }

    const points = await receiptService.getPointsById(id);
    if (!points) {
        return c.json({ error: "not found" }, 404);
    }

    return c.json({ points }, 200);
});

export { receiptRoutes };
