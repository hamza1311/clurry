import React, {useState} from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import {Button, Card, Tabs, Tab, AppBar, Box} from "@mui/material";
import LoadingIndicator from "./utils/LoadingIndicator";
import PasswordField from "./utils/PasswordField";
import {useHistory} from 'react-router'
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";
import {Theme} from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        height: '100vh',
        display: 'flex'
    },
    wrapper: {
        margin: "auto",
        width: '35vw',
        transition: 'height ease 1s'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(4),
        padding: theme.spacing(3),
    },
    signinOrUpButton: {
        width: 'max-content',
        alignSelf: 'center'
    }
}));


function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [signingIn, setSigningIn] = useState(false)

    const auth = getAuth()
    const classes = useStyles();
    const router = useHistory();

    const signIn = async () => {
        setSigningIn(true)
        await signInWithEmailAndPassword(auth, email, password)
        setSigningIn(false)
        router.push("/");
    }

    const form = (
        <form className={classes.form} noValidate autoComplete="off">
            <TextField
                label="Email"
                type="email"
                variant="standard"
                onChange={(e) => setEmail(e.target.value)}
                disabled={signingIn}
            />

            <PasswordField
                disabled={signingIn}
                value={password}
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button
                onClick={signIn}
                variant="contained"
                className={classes.signinOrUpButton}
                disabled={signingIn}>Sign in</Button>
        </form>
    )

    return (
        <>
            <LoadingIndicator isVisible={signingIn}/>
            {form}
        </>
    )
}


function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [signingUp, setSigningUp] = useState(false)

    const classes = useStyles();

    const auth = getAuth();

    const signUp = async () => {
        setSigningUp(true)
        if (password === confirmPassword) {
            await createUserWithEmailAndPassword(auth, email, password)
        } else {
            alert("password mismatch")
        }
    }

    const form = (
        <form className={classes.form} noValidate autoComplete="off">
            <TextField
                label="Email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                disabled={signingUp}
            />

            <PasswordField
                disabled={signingUp}
                value={password}
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <PasswordField
                disabled={signingUp}
                value={confirmPassword}
                label="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
                onClick={signUp}
                variant="contained"
                className={classes.signinOrUpButton}
                disabled={signingUp}>Sign up</Button>
        </form>
    )

    return (
        <>
            <LoadingIndicator isVisible={signingUp}/>
            {form}
        </>
    )
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function Auth() {
    const classes = useStyles();

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return <>
        <main className={classes.root}>
            <div className={classes.wrapper}>
                <Card>
                    <AppBar position="static">
                        <Tabs value={value} onChange={handleChange} aria-label="auth tabs" variant="fullWidth"
                              centered={true}>
                            <Tab label="Sign In"/>
                            <Tab label="Sign Up"/>
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <SignIn/>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <SignUp/>
                    </TabPanel>
                </Card>
            </div>
        </main>
    </>
}
