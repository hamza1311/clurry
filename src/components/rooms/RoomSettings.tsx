import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Room from '../../models/Room'
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore'
import ResponsiveDrawer from '../utils/ResponsiveDrawer'
import * as React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import AppToolbarContent from '../AppToolbarContent'
import {
    Avatar,
    Box,
    Button,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField
} from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { useHistory } from 'react-router'
import { EditableInfoCard } from '../utils/cards/EditableInfoCard'
import UpdateImageCard from '../utils/cards/UpdateImageCard'
import { TransitionGroup } from 'react-transition-group'
import SeparatorBox from '../utils/SeparatorBox'
import FlexBox from '../utils/FlexBox'
import getUser from '../../utils/getUser'
import ListItemSkeleton from '../utils/skeletons/ListItemSkeleton'
import User from '../../models/User'

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

const AddUserCard = () => {
    const [isEditing, setIsEditing] = useState(false)
    return (
        <TransitionGroup style={{ width: '100%' }}>
            {!isEditing && <Collapse unmountOnExit>
                <Button onClick={() => setIsEditing(true)}>
                    <AddIcon/>
                    Add Member
                </Button>
            </Collapse>}
            {isEditing && <Collapse unmountOnExit>
                <FlexBox>
                    <TextField
                        label='email'
                    />
                    <SeparatorBox/>
                    <IconButton onClick={() => setIsEditing(false)}>
                        <CheckIcon/>
                    </IconButton>
                </FlexBox>
            </Collapse>}
        </TransitionGroup>
    )
}

const RoomMembersList = ({ room } : { room: Room }) => {
    return (
        <List sx={{ width: (theme) => ({ [theme.breakpoints.up('sm')]: '40%' }) }}>
            <ListItem key='add-user'>
                <AddUserCard/>
            </ListItem>
            { room.members.map((member) => <RoomMembersListItem member={member} key={member} /> )}
        </List>
    )
}

const RoomMembersListItem = ({ member: memberId }: { member: string }) => {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        getUser(memberId).then((fetched) => {
            setUser(fetched ?? null)
        })
    }, [memberId])

    if (user === null) {
        return <ListItemSkeleton />
    }

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar src={user.profilePicture ?? undefined} alt={`${user.displayName}'s avatar`} />
            </ListItemAvatar>
            <ListItemText>{user.displayName}</ListItemText>
        </ListItem>
    )
}

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
            <ArrowBackIcon/>
        </IconButton>
        <AppToolbarContent selectedRoom={room}/>
    </>

    let content
    switch (selectedItem) {
        case 0:
            content = (
                <Box className={classes.generalSettingsContainer}>
                    <UpdateImageCard
                        imgSrc={room.icon ?? undefined}
                        alt='room icon'
                        removePhoto={() => console.log('TODO - Remove Room Icon')}
                        updatePhoto={() => console.log('TODO - Update Room Icon')}
                    />
                    <EditableInfoCard label='Name' currentValue={room.name} onSave={async (it) => console.log(it)}/>
                </Box>
            )
            break
        case 1:
            content = (
                <RoomMembersList room={room} />
            )
            break
    }

    return <ResponsiveDrawer
        drawerItem={drawerItems}
        title={room.name}
        onItemClick={setSelectedItem}
        selectedItemIndex={selectedItem}
        toolbarContent={toolbarContent}
    >
        {content}
    </ResponsiveDrawer>
}
