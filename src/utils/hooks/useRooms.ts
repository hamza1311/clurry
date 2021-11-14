import {useEffect, useState} from "react";
import Room from "../../models/Room";
import firebase from "firebase/app";
import 'firebase/firestore'
import useUser from "./useUser";

const useRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([])

    const user = useUser();
    useEffect(() => {
        const firestore = firebase.firestore();
        if (user === null) {
            return () => {}
        }
        return firestore.collection("rooms")
            .where('members', 'array-contains', user.uid)
            .onSnapshot(snapshot => {
                const rooms = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const output: Room = {
                        id: doc.id,
                        createTime: data.createTime,
                        members: data.members,
                        name: data.name,
                    }
                    return output
                })
                setRooms(rooms)
            })
    }, [user])

    return rooms
}

export default useRooms
