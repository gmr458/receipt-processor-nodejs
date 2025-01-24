import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { receiptRoutes } from "./routes/receipt.js";

const app = new Hono();

app.route("/receipts", receiptRoutes);

const port = 3000;
console.log(`server is running on http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port,
});
