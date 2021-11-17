import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { createStyles, makeStyles } from '@mui/styles'
import Drawer from '@mui/material/Drawer'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { MessageList } from './messages/MessageList'
import Room from '../models/Room'
import CreateMessage, { CreateMessageSkeleton } from './messages/CreateMessage'
import useRooms from '../utils/hooks/useRooms'
import { Button, Link } from '@mui/material'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useHistory } from 'react-router'
import { Theme } from '@mui/material/styles'
import MessageListItemSkeleton from './messages/MessageListItemSkeleton'
import NewRoomDialog from './rooms/NewRoomDialog'
import AppToolbarContent from './AppToolbarContent'

const drawerWidth = 240
const appBarHeight = 69

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            height: appBarHeight
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            justifyContent: 'flex-end',
        },
        content: {
            height: `calc(100vh - ${appBarHeight}px)`,
            width: '100%',
            marginTop: appBarHeight,
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
            padding: theme.spacing(0, 2),
            display: 'flex',
            flexDirection: 'column'
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
        list: {
            overflow: 'auto',
        },
        pushBottom: {
            marginTop: 'auto',
        }
    }),
)


export default function Home() {
    const classes = useStyles()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const rooms = useRooms()
    const history = useHistory()

    const { id = undefined } = useParams<{ id?: string }>()
    useEffect(() => {
        if (rooms.length !== 0) {
            const index = rooms.findIndex((it) => it.id === id)
            if (index === -1) {
                history.replace(`/rooms/${rooms[0].id}`)
            } else {
                setSelectedIndex(index)
            }
        }
    }, [rooms, id, history])

    const selectedRoom = rooms[selectedIndex]

    const handleDrawerOpen = () => {
        setDrawerOpen(true)

    }
    const handleDrawerClose = () => {
        setDrawerOpen(false)
    }

    const selectRoom = (id: string) => {
        history.replace(`/rooms/${id}`)
    }

    let skeleton = new Array(7).map((_, index) => <MessageListItemSkeleton key={index} />)

    const content = selectedRoom ? (
        <>
            <div className={clsx(classes.list, classes.pushBottom)}>
                <MessageList room={selectedRoom}/>
            </div>

            <CreateMessage room={selectedRoom} />
        </>
    ) : (
        <>
            <div className={classes.list}>
                {skeleton}
            </div>

            <CreateMessageSkeleton/>
        </>
    )
    return (
        <div className={classes.root}>
            <AppBar
                position='fixed'
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: drawerOpen,
                })}
            >
                <Toolbar>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        onClick={handleDrawerOpen}
                        edge='start'
                        className={clsx(classes.menuButton, drawerOpen && classes.hide)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    {selectedRoom && <AppToolbarContent selectedRoom={selectedRoom}/>}
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant='persistent'
                anchor='left'
                open={drawerOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <Divider/>
                <List>
                    {
                        rooms.map((room) => (
                            <RoomsListItem key={room.id} room={room} onClick={() => selectRoom(room.id)}/>
                        ))
                    }
                    <ListItem key='new-room-link'>
                        <Link component={RouterLink} to='/#new-room'>
                            <Button>
                                New Room
                            </Button>
                        </Link>
                    </ListItem>
                </List>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: drawerOpen,
                })}
            >
                {content}
            </main>
            <NewRoomDialog/>
        </div>
    )
}

type RoomListItemProps = {
    room: Room
    onClick: () => void
}

function RoomsListItem({ room, onClick }: RoomListItemProps) {
    return (
        <ListItem button onClick={onClick}>
            <ListItemText primary={room.name}/>
        </ListItem>
    )
}
