import { IUser } from "@/modules/users/types/user.types";
import { DecodedIdToken } from "firebase-admin/auth"

declare global{
    namespace Express{
        interface Request{
            firebaseUser?:DecodedIdToken;
            user?:IUser;
        }
    }
}

export {}