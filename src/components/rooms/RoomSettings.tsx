import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Room from '../../models/Room'
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore'
import ResponsiveDrawer from '../utils/ResponsiveDrawer'

import * as React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AppToolbarContent from '../AppToolbarContent'
import { IconButton } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { useHistory } from 'react-router'

const useRoom = (id: string): [Room | null, boolean] => {
    const [room, setRoom] = useState<Room | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const firestore = getFirestore()
        getDoc(doc(collection(firestore, 'rooms'), id)).then((doc) => {
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

const drawerItems = [
    {
        text: 'General'
    },
    {
        text: 'Users'
    },
]

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backIcon: {
            marginRight: `${theme.spacing(2)} !important`
        }
    })
)

export default function RoomSettings() {
    const { id: roomId } = useParams<{ id: string }>()
    const [selectedItem, setSelectedItem] = useState(0)
    const classes = useStyles()
    const history = useHistory()

    const [room, loading] = useRoom(roomId)

    if (loading) {
        return <>Loading</>
    }

    if (room === null) {
        return <>Not Found</>
    }

    const goHome = () => {
        history.push(`/rooms/${room.id}`)
    }

    const toolbarContent = <>
        <IconButton className={classes.backIcon} onClick={goHome}>
            <ArrowBackIcon />
        </IconButton>
        <AppToolbarContent selectedRoom={room} />
    </>

    return <ResponsiveDrawer
        drawerItem={drawerItems}
        title={room.name}
        onItemClick={setSelectedItem}
        selectedItemIndex={selectedItem}
        toolbarContent={toolbarContent}
    >
        {selectedItem}
    </ResponsiveDrawer>
}
