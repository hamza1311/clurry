import firebase from "firebase/app";

export default interface Room {
    name: string
    createTime: firebase.firestore.Timestamp
    members: string[]
    id: string,
}
