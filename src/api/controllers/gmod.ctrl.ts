import { Controller, Get, Render, Authorized, Post } from "routing-controllers";


@Controller("/gmod-splash")
class GmodSplashController
{
    @Get("/")
    @Render("gmod-splash")
    private GetGmodSplash()
    {
        const quote = "\"BLOBBY BLOBBY BLOBBY\" - Mr. Blobby";
        const screenshot = "NotGonnaPutAnExampleBecauseTheyreMassive.png";
        
        return {
            quote: quote,
            screenshotB64: screenshot,
            stats: "Ollie needs to get writing some LUA :)"
        };
    }

    @Get("/edit")
    @Render("edit-gmod-splash")
    @Authorized("GMod Rep")
    private EditGmodSplash()
    {
        
    }

    @Post("/screenshot")
    @Authorized("GMod Rep")
    private AddScreenshot()
    {

    }

    @Post("/quote")
    @Authorized("GMod Rep")
    private AddQuote()
    {

    }
}