import Room from '../../models/Room'
import { useEffect, useState } from 'react'
import { collection, doc, getFirestore, onSnapshot } from 'firebase/firestore'

const useRoom = (id: string): [Room | null, boolean] => {
    const [room, setRoom] = useState<Room | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const firestore = getFirestore()
        return onSnapshot(doc(collection(firestore, 'rooms'), id),
            (doc) => {
                const data = doc.data()
                if (data !== undefined) {
                    const output: Room = {
                        id: doc.id,
                        createTime: data.createTime,
                        members: data.members,
                        name: data.name,
                    }
                    setRoom(output)
                }
                setLoading(false)
            })
    }, [id])

    return [room, loading]
}

export default useRoom
