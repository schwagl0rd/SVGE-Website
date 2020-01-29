import { ConnectionOptions } from "typeorm";

export namespace data
{
    export const port = parseInt(process.env.DB_PORT);
    export const host = process.env.DB_HOST;

    const siteOptions : ConnectionOptions = {
        name: "site",
        type: "mysql",
        host: host,
        port: port,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_SITE,
        synchronize: true,
        //logging: ["info", "warn", "error"], <-- handled by "typeorm:info" etc in .env
        logger: "debug",
        entities: [ __dirname + "/../api/data/site/models/**/*.ent.ts" ],
        //migrations: [ __dirname + "/../api/data/site/migrations/**/*.ent.ts" ],
        //subscribers: [ __dirname + "/../api/data/site/subscribers/**/*.ent.ts" ]
    };

    const botOptions : ConnectionOptions = {
        name: "bot",
        type: "mysql",
        host: host,
        port: port,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_BOT,
        synchronize: true,
        //logging: ["info", "warn", "error"], <-- handled by "typeorm:info" etc in .env
        logger: "debug",
        entities: [ __dirname + "/../api/data/bot/models/**/*.ent.ts" ],
        //migrations: [ __dirname + "/../api/data/bot/migrations/**/*.ent.ts" ],
        //subscribers: [ __dirname + "/../api/data/bot/subscribers/**/*.ent.ts" ]
    };

    const gmodOptions : ConnectionOptions = {
        name: "gmod",
        type: "mysql",
        host: host,
        port: port,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_GMOD,
        synchronize: true,
        //logging: ["info", "warn", "error"], <-- handled by "typeorm:info" etc in .env
        logger: "debug",
        entities: [ __dirname + "/../api/data/gmod/models/**/*.ent.ts" ],
        //migrations: [ __dirname + "/../api/data/gmod/migrations/**/*.ent.ts" ],
        //subscribers: [ __dirname + "/../api/data/gmod/subscribers/**/*.ent.ts" ]
    };

    export const settings : ConnectionOptions[] = [
        siteOptions,
        botOptions,
        gmodOptions
    ];
}