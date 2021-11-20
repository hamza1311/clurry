import { useParams } from 'react-router-dom'
import { useState } from 'react'
import ResponsiveDrawer from '../../utils/ResponsiveDrawer'
import * as React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AppToolbarContent from '../../AppToolbarContent'
import { Box, IconButton } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { useHistory } from 'react-router'
import { EditableInfoCard } from '../../utils/cards/EditableInfoCard'
import UpdateImageCard from '../../utils/cards/UpdateImageCard'
import Typography from '@mui/material/Typography'
import useRoom from '../../../utils/hooks/useRoom'
import RoomMembersList from './RoomMembersList'
import useRoomIcon from '../../../utils/hooks/useRoomIcon'

const drawerItems = [
    {
        text: 'General'
    },
    {
        text: 'Members'
    },
]

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backIcon: {
            marginRight: `${theme.spacing(2)} !important`
        },
        generalSettingsContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
        }
    })
)

export default function RoomSettings() {
    const { id: roomId } = useParams<{ id: string }>()
    const [selectedItem, setSelectedItem] = useState(0)
    const classes = useStyles()
    const history = useHistory()

    const [room, loading] = useRoom(roomId)
    const icon = useRoomIcon(room?.id)

    if (loading) {
        return <>Loading</>
    }

    if (room === null) {
        return <>Not Found</>
    }

    const goHome = () => {
        history.push(`/rooms/${room.id}`)
    }

    const updateRoomName = async (it: string) => {
        // todo update room name
        console.log(it)
    }

    const removeRoomIcon = () => {
        // TODO implement remove icon
        console.log('Remove Room Icon')
    }

    const updateRoomIcon = () => {
        // TODO implement update icon
        console.log('Update Room Icon')
    }

    let content
    switch (selectedItem) {
        case 0:
            content = (
                <Box className={classes.generalSettingsContainer}>
                    <UpdateImageCard
                        imgSrc={icon}
                        alt='room icon'
                        removePhoto={removeRoomIcon}
                        updatePhoto={updateRoomIcon}
                    />
                    <EditableInfoCard label='Name' currentValue={room.name} onSave={updateRoomName}/>
                </Box>
            )
            break
        case 1:
            content = (
                <RoomMembersList room={room}/>
            )
            break
    }

    return <ResponsiveDrawer
        drawerItem={drawerItems}
        title={room.name}
        onItemClick={setSelectedItem}
        selectedItemIndex={selectedItem}
        toolbarContent={
            <>
                <IconButton className={classes.backIcon} onClick={goHome}>
                    <ArrowBackIcon/>
                </IconButton>
                <AppToolbarContent>
                    <Typography variant='h6' noWrap>
                        {room.name}
                    </Typography>
                </AppToolbarContent>
            </>
        }
    >
        {content}
    </ResponsiveDrawer>
}
