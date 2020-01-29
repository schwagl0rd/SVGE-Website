import { RoutingControllersOptions, Action } from "routing-controllers";
import { auth } from "../services/auth.service";

export namespace server
{
	export const port = parseInt(process.env.EXPRESS_PORT);
	export const settings : RoutingControllersOptions = {
		controllers: [__dirname + "/../api/controllers/**/*.ctrl.ts"],
		middlewares: [__dirname + "/../api/middlewares/**/*.mdlw.ts"],
		cors: true,
		authorizationChecker: auth.authCheck,
		currentUserChecker: auth.userCheck
	};
}