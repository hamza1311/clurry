import firebase from "firebase/app";
import User from "../models/User";

const getUser = async (userId: string) => {
    console.log('userId', userId)
    const firestore = firebase.firestore()
    const fetched = await firestore.collection("users").doc(userId).get()
    const data = fetched.data();
    if (data === undefined) {
        return undefined
    }

    const user: User = {
        id: userId,
        displayName: data.displayName,
        profilePicture: data.profilePicture ? data.profilePicture : null
    }
    return user
}

export default getUser
