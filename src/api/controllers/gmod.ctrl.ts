import { Controller, Get, Render, Authorized, Post, QueryParam, QueryParams, UploadedFile, UploadOptions } from "routing-controllers";
import { GmodQuote } from "../data/gmod/models/quotes.ent";
import { readdirSync, renameSync } from "fs";
import { join, basename } from "path";
import { IsString } from "class-validator";
import * as Config from "../../config/_configs";
import { File } from "../../config/_configs";



class GmodSplashQuery
{
    @IsString()
    mapName : string;
    @IsString()
    steamId : string;
}

@Controller("/gmod-splash")
export class GmodSplashController
{
    SCREENSHOT_DIR = join(__dirname, "../../public/images/gmod");

    @Get("/")
    @Render("gmod-splash")
    private async GetGmodSplash(@QueryParam("map") mapName : string, @QueryParam("steamid") steamId : string)
    {
        // parse steam ID:
        // https://wiki.facepunch.com/gmod/Loading_URL
        const parsedSteamInfoIdk = steamId;

        // get random quote
        const quotes = await GmodQuote.find({
            select: [ "quote", "author" ],
        });
        const randQuote = quotes[Math.floor(Math.random()*quotes.length)];

        // get a random screenshot
        const screenshots = readdirSync(this.SCREENSHOT_DIR);
        const screenshot = basename( screenshots[Math.floor( Math.random() * screenshots.length )] );
        
        return {
            layout: false,

            mapName: mapName,
            steamId: parsedSteamInfoIdk,

            quote: randQuote.quote,
            quote_author: randQuote.author,
            screenshot: screenshot,
            stats: "Ollie needs to get writing some LUA :)"
        };
    }

    @Get("/edit")
    @Render("gmod-splash-edit")
    @Authorized("GMod Rep")
    private async EditGmodSplash()
    {
        const quotes = (await GmodQuote.find()).map((gq) => { return {id: gq.id, quote: gq.quote, author: gq.author}; });
        const screenshots = readdirSync(this.SCREENSHOT_DIR).map((gs_path) => basename(gs_path));

        return {
            tab_title: "Edit GMod Splash",
            page_title: "Garry's Mod",
            page_subtitle: "Splash Screen Configurator",
            quotes: quotes,
            screenshots: screenshots
        };
    }

    static uploadOptions : UploadOptions = {
        options: Config.Uploads.gmodScreenshots,
        required: true
    };

    @Post("/screenshot")
    @Authorized("GMod Rep")
    private async AddScreenshot(@UploadedFile("newScreenshot", this.uploadOptions) file : File)
    {
        // do some checks
        // do some image manipulation
        return renameSync(file.path, `../../public/images/gmod/${file.originalname}`);
    }

    @Post("/quote")
    @Authorized("GMod Rep")
    private async AddQuote(@QueryParams() quote : GmodQuote)
    {
        return quote.save();
    }
}