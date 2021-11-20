import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Room from '../../models/Room'
import { collection, doc, getFirestore, updateDoc, arrayUnion, query, where, getDocs } from 'firebase/firestore'
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
    Collapse, FormControl,
    IconButton, Input, InputAdornment, InputLabel,
    List,
    ListItem,
    ListItemAvatar, ListItemButton,
    ListItemText,
} from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { useHistory } from 'react-router'
import { EditableInfoCard } from '../utils/cards/EditableInfoCard'
import UpdateImageCard from '../utils/cards/UpdateImageCard'
import { TransitionGroup } from 'react-transition-group'
import FlexBox from '../utils/FlexBox'
import getUser from '../../utils/getUser'
import ListItemSkeleton from '../utils/skeletons/ListItemSkeleton'
import User from '../../models/User'
import Typography from '@mui/material/Typography'
import useRoom from '../../utils/hooks/useRoom'

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

const AddUserItem = ({ room }: { room: Room }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const memberEmailRef = useRef<{ value: string }>()

    const firestore = getFirestore()

    const addMember = async () => {
        setIsDisabled(true)
        const roomDocument = doc(firestore, 'rooms', room.id)
        const userQuery = query(collection(firestore, 'users'), where('email', '==', memberEmailRef.current!!.value))
        const userDocs = await getDocs(userQuery)
        if (userDocs.empty) {
            // TODO handle this case properly
            alert('no user with this email found')
        } else {
            // this `forEach` is fine because only one user can be registered with one email
            userDocs.forEach((user) => {
                updateDoc(roomDocument, {
                    members: arrayUnion(user.id)
                }).catch((e) => console.error('failed to add member', e))
            })
        }
        setIsEditing(false)
        setIsDisabled(false)
    }
    return (
        <ListItem>
            <TransitionGroup style={{ width: '100%' }}>
                {!isEditing && <Collapse unmountOnExit>
                    <ListItemButton disabled={isDisabled} component={Button} onClick={() => setIsEditing(true)}
                                    sx={{ width: '100%' }}>
                        <AddIcon/>
                        Add Member
                    </ListItemButton>
                </Collapse>}
                {isEditing && <Collapse unmountOnExit>
                    <FlexBox>
                        <FormControl variant='standard' sx={{ width: '100%' }} disabled={isDisabled}>
                            <InputLabel htmlFor='member-email'>Email</InputLabel>
                            <Input
                                id='member-email'
                                inputRef={memberEmailRef}
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton
                                            onClick={() => addMember()}
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            <CheckIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </FlexBox>
                </Collapse>}
            </TransitionGroup>
        </ListItem>
    )
}

const RoomMembersList = ({ room }: { room: Room }) => {
    return (
        <List sx={{ width: (theme) => ({ [theme.breakpoints.up('sm')]: '40%' }) }}>
            <TransitionGroup>
                <AddUserItem key='add-user' room={room}/>
                {room.members.map((member) => (
                    <Collapse key={member}>
                        <RoomMembersListItem member={member}/>
                    </Collapse>
                ))}
            </TransitionGroup>
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
        return <ListItemSkeleton/>
    }

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar src={user.profilePicture ?? undefined} alt={`${user.displayName}'s avatar`}/>
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
        <AppToolbarContent>
            <Typography variant='h6' noWrap>
                {room.name}
            </Typography>
        </AppToolbarContent>
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
                <RoomMembersList room={room}/>
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
