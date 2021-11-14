import {makeStyles} from "@material-ui/core/styles";
import React, {lazy, Suspense, useState} from "react";
import firebase from "firebase";
import {Button} from "@material-ui/core";
import PasswordField from "../utils/PasswordField";
import "firebase/auth"
import useUser from "../../utils/hooks/useUser";
import LoadingIndicator from "../utils/LoadingIndicator";

const Dialog = lazy(() => import("@material-ui/core/Dialog"))
const DialogActions = lazy(() => import("@material-ui/core/DialogActions"))
const DialogContent = lazy(() => import("@material-ui/core/DialogContent"))
const DialogTitle = lazy(() => import("@material-ui/core/DialogTitle"))

const Snackbar = lazy(() => import("../utils/Snackbar"))

const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.down("sm")]: {
            marginLeft: "5%",
        }
    },
    passwordHeading: {
        marginBottom: theme.spacing(2),
    },
    changePasswordButton: {
        width: 'max-content',
    },
    dialogContent: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2)
    }
}))

export default function ChangePassword({dialogOpen, setDialogOpen}: { dialogOpen: boolean, setDialogOpen: (value: boolean) => void }) {
    const classes = useStyles()

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    const user = useUser()


    const handleClose = () => {
        setDialogOpen(false);
    };


    const changePassword = async () => {
        if (user === null) {
            throw Error("bruh???")
        }
        setChangingPassword(true)
        if (newPassword !== confirmNewPassword) {
            setError("passwords do not match")
        } else {
            if (user.email === null) {
                throw Error("unreachable")
            }

            const credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword)
            await user.reauthenticateWithCredential(credential)

            await user.updatePassword(newPassword)
            setSnackbarOpen(true)
        }
        setChangingPassword(false)
        handleClose()
    }

    return (<>
        <Suspense fallback={<LoadingIndicator isVisible={true} />}>
            <section className={classes.root}>

                <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="change-password-dialog-title">
                    <DialogTitle id="change-password-dialog-title">Change Password</DialogTitle>

                    <DialogContent className={classes.dialogContent}>
                        <PasswordField
                            disabled={changingPassword}
                            value={oldPassword}
                            label="Old password"
                            onChange={(e) => setOldPassword(e.target.value)}
                        />

                        <PasswordField
                            disabled={changingPassword}
                            value={newPassword}
                            label="New password"
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <PasswordField
                            disabled={changingPassword}
                            value={confirmNewPassword}
                            label="Confirm new password"
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />

                        <Button
                            className={classes.changePasswordButton}
                            disabled={changingPassword}
                        >Reset password</Button>

                        {error && error}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose} disabled={changingPassword}>Cancel</Button>
                        <Button onClick={changePassword} disabled={changingPassword}>Update</Button>
                    </DialogActions>
                </Dialog>
            </section>
            <Snackbar message="Password changed successfully" open={snackbarOpen} setOpen={setSnackbarOpen}/>
        </Suspense>
    </>)
}
