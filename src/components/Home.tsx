import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {createStyles, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {MessageList, MessageListItemSkeleton} from "./MessageList";
import Room from '../models/Room'
import CreateMessage, {CreateMessageSkeleton} from './CreateMessage'
import useRooms from "../utils/hooks/useRooms";
import {Avatar, Button, Dialog, DialogActions, DialogTitle, Link, Menu, MenuItem, TextField} from "@material-ui/core";
import {Link as RouterLink} from 'react-router-dom'
import {useLocation, useHistory} from 'react-router'
import useUser from "../utils/hooks/useUser";
import firebase from "firebase/app";
import User from "../models/User";
import getUser from "../utils/getUser";

const drawerWidth = 240;
const appBarHeight = 69;

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
            // necessary for content to be below app bar
            // ...theme.mixins.toolbar,
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
            height: '75vh'
        },
    }),
);

export default function Home() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const rooms = useRooms()

    const selectedRoom = rooms[selectedIndex]

    const handleDrawerOpen = () => {
        setOpen(true);

    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    let skeleton = new Array(7).fill(<MessageListItemSkeleton/>)

    const content = selectedRoom ? (
        <>
            <div className={classes.list}>
                <MessageList room={selectedRoom}/>
            </div>

            <CreateMessage room={selectedRoom}/>
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
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {selectedRoom?.name}
                    </Typography>
                    <UserProfileIcon/>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </div>
                <Divider/>
                <List>
                    {
                        rooms.map((room, index) => (
                            <RoomsListItem key={room.id} room={room} onClick={() => setSelectedIndex(index)}/>
                        ))
                    }
                    <ListItem>
                        <Link component={RouterLink} to="/#new-room">
                            <Button>
                                New Room
                            </Button>
                        </Link>
                    </ListItem>
                </List>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                {content}
            </main>
            <NewRoomDialog/>
        </div>
    );
}


interface RoomListItemProps {
    room: Room
    onClick: () => void
}

function RoomsListItem({room, onClick}: RoomListItemProps) {
    return (
        <ListItem button onClick={onClick}>
            <ListItemText primary={room.name}/>
        </ListItem>
    )
}

function NewRoomDialog() {
    const [name, setName] = useState("")
    const location = useLocation()
    const history = useHistory()
    const user = useUser()

    const [disabled, setDisabled] = useState(false)
    const firestore = firebase.firestore()

    const createRoom = async () => {
        setDisabled(true)

        const room = {
            name,
            members: [user?.uid ?? ""],
            createTime: firebase.firestore.Timestamp.now()
        }
        await firestore.collection("rooms").add(room)
        closeDialog()
        setName("")
        setDisabled(false)
    };

    const closeDialog = () => {
        history.push("/") // todo current url without #hash
    }

    return (
        <Dialog onClose={closeDialog} aria-labelledby="simple-dialog-title" open={location.hash === '#new-room'}>
            <DialogTitle id="simple-dialog-title">Create New Room</DialogTitle>

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
    );
}

const profileIconStyles = makeStyles(theme => createStyles({
    userIconButton: {
        marginLeft: 'auto'
    },
    userIcon: {
        borderRadius: '50%',
        width: 50
    }
}))

function UserProfileIcon() {
    const classes = profileIconStyles()
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const currentUser = useUser()
    const [user, setUser] = useState<User | undefined>(undefined)
    useEffect(() => {
        if (currentUser !== null) {
            getUser(currentUser?.uid).then((fetchedUser) => {
                setUser(fetchedUser)
            })
        }
    }, [currentUser])

    const history = useHistory()

    const navigateToProfile = async () => {
        history.push("/profile")
        handleClose()
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    // @ts-ignore
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const pfp = user?.profilePicture ?? undefined

    return (
        <>
            <IconButton className={classes.userIconButton} onClick={handleMenu}>
                <Avatar src={pfp} alt="user pfp"/>
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={navigateToProfile}>Profile</MenuItem>
                <MenuItem onClick={() => console.log('signOut')}>Sign out</MenuItem>
            </Menu>
        </>
    )
}
