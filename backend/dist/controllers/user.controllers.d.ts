import { Request, Response } from "express";
export declare function getRecommendedUsers(req: Request, res: Response): Promise<Response | any>;
export declare function getMyFriends(req: Request, res: Response): Promise<Response | any>;
export declare function sendFriendRequest(req: Request, res: Response): Promise<Response | any>;
export declare function acceptFriendRequest(req: Request, res: Response): Promise<Response | any>;
export declare function getFriendRequests(req: Request, res: Response): Promise<Response | any>;
export declare function getOutgoingFriendReqs(req: Request, res: Response): Promise<Response | any>;
export declare function rejectFriendRequest(req: Request, res: Response): Promise<Response | any>;
export declare function cancelFriendRequest(req: Request, res: Response): Promise<Response | any>;
export declare function getMyProfile(req: Request, res: Response): Promise<Response | any>;
export declare function updateMyProfile(req: Request, res: Response): Promise<Response | any>;
export declare function updateProfilePicture(req: Request, res: Response): Promise<Response | any>;
export declare function searchUsers(req: Request, res: Response): Promise<Response | any>;
export declare function removeFriend(req: Request, res: Response): Promise<Response | any>;
export declare function getUsersByProgram(req: Request, res: Response): Promise<Response | any>;
export declare function getTopContributors(req: Request, res: Response): Promise<Response | any>;
export declare function collectFriendData(req: Request, res: Response): Promise<Response | any>;
export declare function getUserStats(req: Request, res: Response): Promise<Response | any>;
//# sourceMappingURL=user.controllers.d.ts.map