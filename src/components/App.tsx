import Auth from './auth/Auth.tsx'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import Home from './Home'
import { createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material'
import { getAuth, User } from 'firebase/auth'
import Profile from './profile/Profile'

export const UserContext = React.createContext<User | null>(null)

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode],
    )

    const auth = getAuth()
    const [user, setUser] = useState<User | null | undefined>(auth.currentUser ?? undefined)

    useEffect(() => {
        return auth.onAuthStateChanged((user) => {
            setUser(user)
        })
    }, [user, auth])


    const privateRoute = (path: string, node: ReactNode) => {
        console.log('fuck user', user)
        if (user === null) {
            return <Redirect to='/auth'/>
        } else {
            return (
                <Route path={path}>
                    {node}
                </Route>
            )
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>

            <UserContext.Provider value={user ?? null}>
                <Router>
                    <Switch>
                        <Route path='/auth'>
                            <Auth/>
                        </Route>
                        {privateRoute('/profile', <Profile/>)}
                        {privateRoute('/', <Home/>)}

                    </Switch>
                </Router>
            </UserContext.Provider>
        </ThemeProvider>
    )
}

export default App
