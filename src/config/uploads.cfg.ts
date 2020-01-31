import { Options } from "multer";
import { Request } from "express";

export type File = Express.Multer.File;
type Callback = (error : Error, acceptFile : boolean) => void;

export namespace Uploads
{
    export const gmodScreenshots : Options = {
        dest: "../../tmp",
        fileFilter: (req : Request, file : File, acceptFile : Callback) => {
            const allowedMimeTypes = [
                "image/jpeg",
                "image/png"
            ];
            acceptFile(null, allowedMimeTypes.includes(file.mimetype));
        }
    };
}