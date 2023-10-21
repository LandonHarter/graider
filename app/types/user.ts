import { Timestamp } from "firebase/firestore";

type User = {
    id: string;
    name: string;
    email: string;
    picture: string;
    createdAt: Timestamp;
};
export default User;