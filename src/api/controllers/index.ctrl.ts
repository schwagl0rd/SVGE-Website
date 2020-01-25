import { Controller, Get, Render } from "routing-controllers";

@Controller("/")
export class IndexController
{
    @Get("/")
    @Render("index")
    private index()
    {
        return {
            tab_title: "SVGE | Home"
        };
    }
}