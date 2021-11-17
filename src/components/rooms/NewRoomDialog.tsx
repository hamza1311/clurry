import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import useUser from '../../utils/hooks/useUser'
import { addDoc, collection, getFirestore, Timestamp } from 'firebase/firestore'
import { Button, Dialog, DialogActions, DialogTitle, TextField } from '@mui/material'

export default function NewRoomDialog() {
    const [name, setName] = useState('')
    const location = useLocation()
    const history = useHistory()
    const user = useUser()

    const [disabled, setDisabled] = useState(false)

    const createRoom = async () => {
        setDisabled(true)
        const firestore = getFirestore()
        const room = {
            name,
            members: [user?.uid ?? ''],
            createTime: Timestamp.now()
        }
        const doc = await addDoc(collection(firestore, 'rooms'), room)
        setName('')
        history.replace(`/rooms/${doc.id}`)
        setDisabled(false)
    }

    const closeDialog = () => {
        history.push('/') // todo current url without #hash
    }

    return (
        <Dialog onClose={closeDialog} aria-labelledby='simple-dialog-title' open={location.hash === '#new-room'}>
            <DialogTitle id='simple-dialog-title'>Create New Room</DialogTitle>

            <TextField
                value={name}
                onChange={(it) => setName(it.target.value)}
                disabled={disabled}
            />

            <DialogActions>
                <Button disabled={disabled} onClick={closeDialog}>Close</Button>
                <Button disabled={disabled} onClick={createRoom}>Save</Button>
            </DialogActions>

        </Dialog>
    )
}
