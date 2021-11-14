import {makeStyles} from "@mui/styles";
import React, {lazy, useState, Suspense} from "react";
import {IconButton} from "@mui/material";
import {MoreHoriz} from "@mui/icons-material";

const Menu = lazy(() => import('@mui/material/Menu'));
const MenuItem = lazy(() => import('@mui/material/MenuItem'));

const useStyles = makeStyles({
    cardContentRight: {
        marginLeft: "auto !important",
    },
})


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
