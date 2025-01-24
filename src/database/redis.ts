import { Redis, type RedisOptions } from "ioredis";

const opts: RedisOptions = {
    host: "127.0.0.1",
    port: 6379,
    username: "",
    password: "",
    db: 1,
};

const redis = new Redis(opts);

redis
    .ping()
    .then((_result) => {
        console.log(
            `redis connection stablished with redis://${opts.host}:${opts.port}`,
        );
    })
    .catch((err) => {
        console.error("error connecting to redis", err);
    });

export { redis };
