import { Response, Request } from "express";

export function signIn(req:Request, res: Response) {
    res.send("Function signIn is Working");
};

export function signUp(req:Request, res: Response) {
    res.send("Function signUp is Working");
};

export function signOut(req: Request, res: Response) {
    res.send("Function signOut is working");
};