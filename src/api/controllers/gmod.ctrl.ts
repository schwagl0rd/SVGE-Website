import { Controller, Get, Render, Authorized, Post, QueryParam, QueryParams, UploadedFiles, UploadOptions } from "routing-controllers";
import { GmodQuote } from "../data/gmod/models/quotes.ent";
import { readdirSync } from "fs";
import { join, basename } from "path";
import { IsString } from "class-validator";
import * as Config from "../../config/_configs";
import { File } from "../../config/_configs";

// Jimp is a little retarded
import Jimp from 'jimp';
import { Z_FILTERED } from "zlib";
// tslint:disable-next-line: no-var-requires
const jimp : Jimp = require('jimp');

const uploadOptions : UploadOptions = {
    options: Config.Uploads.gmodScreenshots,
    required: true
};

class GmodQuoteQuery
{
    @IsString()
    quote : string;

    @IsString()
    author : string;
}

const SC_WIDTH = 500;
const SC_HEIGHT = 500;
const whRatio = SC_WIDTH / SC_HEIGHT;

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

    @Post("/edit/screenshot")
    @Authorized("GMod Rep")
    private async AddScreenshot(@UploadedFiles("newScreenshots", uploadOptions) files : File[])
    {
        files.forEach(async (file : File) =>
        {
            if(file)
            {
                // should do some basic checks and wrap this lot in some try/catches
                const img = await jimp.read(file.buffer);
                const width = img.getWidth();
                const height = img.getHeight();
                const ar = width / height; // aspect ratio
                if(ar > whRatio)
                {
                    img.resize(jimp.AUTO, SC_HEIGHT);
                    const newWidth = img.getWidth();
                    img.crop(
                        (width - SC_WIDTH) / 2, // x zero
                        0, // y zero
                        SC_WIDTH, // width
                        SC_HEIGHT // height
                    );
                }
                else
                {
                    img.resize(SC_WIDTH, jimp.AUTO);
                    const newHeight = height / ar;
                    img.crop(
                        0, // x zero
                        (newHeight - SC_HEIGHT) / 2, // y zero
                        SC_WIDTH, // width
                        SC_HEIGHT // height
                    );
                }
                img.write(`${__dirname}/../../public/images/gmod/${encodeURIComponent(file.originalname)}`);
            }
            else
            {
                // throw an error? Idk
                // probably means Multer wouldn't accept the file for some reason
            }
        });
        return {
            numberOfFiles: files.length
        };
    }

    @Post("/edit/quote")
    @Authorized("GMod Rep")
    public async AddQuote(@QueryParams() q : any)
    {
        const quote = new GmodQuote();
        quote.quote =  q.quote;
        quote.author = q.author;

        return quote.save();
    }
}