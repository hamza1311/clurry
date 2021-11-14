import {makeStyles} from "@material-ui/core/styles";
import React, {lazy, useState, Suspense} from "react";
import {IconButton} from "@material-ui/core";
import {MoreHoriz} from "@material-ui/icons";

const Menu = lazy(() => import('@material-ui/core/Menu'));
const MenuItem = lazy(() => import('@material-ui/core/MenuItem'));

const useStyles = makeStyles(({
    cardContentRight: {
        marginLeft: "auto",
    },
}))


export default function UpdatePhotoButton() {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement | null>(null)
    const open = Boolean(anchorEl)

    const handleClose = () => {
        setAnchorEl(null);
    };

    const removePhoto = () => {
        // TODO
        handleClose()
    }

    return (<>
        <IconButton className={classes.cardContentRight} onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreHoriz/>
        </IconButton>
        <Suspense fallback={<></>}>
            <Menu
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
                anchorEl={anchorEl}
                onClose={handleClose}
            >
                <MenuItem onClick={removePhoto}>Remove Photo</MenuItem>
                <MenuItem>Update Photo</MenuItem>
            </Menu>
        </Suspense>
    </>)
}
