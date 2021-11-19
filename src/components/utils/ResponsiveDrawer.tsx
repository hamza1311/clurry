import useBreakpoint from '../../utils/hooks/useBreakpoint'
import Toolbar from '@mui/material/Toolbar'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'
import React, { PropsWithChildren } from 'react'

const drawerWidth = 240
type DrawerItem = {
    text: string,
    icon?: JSX.Element
}

type Props = PropsWithChildren<{
    title: string,
    drawerItem: DrawerItem[],
    onItemClick: (index: number) => void
    selectedItemIndex: number,
    toolbarContent: JSX.Element
}>

export default function ResponsiveDrawer(props: Props) {
    const mobileBreakpoint = 'md'
    const isOnMobile = useBreakpoint(mobileBreakpoint)

    const [mobileOpen, setMobileOpen] = React.useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const drawer = (
        <Box>
            <Toolbar />
            <Divider />
            <List>
                {props.drawerItem.map(({ text, icon }, index) => (
                    <ListItem
                        selected={props.selectedItemIndex === index}
                        button
                        key={text}
                        onClick={() => props.onItemClick(index)}
                    >
                        {icon && <ListItemIcon>{icon}</ListItemIcon>}
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    )


    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position='fixed'
                sx={{
                    /* Clipped
                    zIndex: (theme) => theme.zIndex.drawer + 1
                    */
                    width: { [mobileBreakpoint]: `calc(100% - ${drawerWidth}px)` },
                    ml: { [mobileBreakpoint]: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        edge='start'
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { [mobileBreakpoint]: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {props.toolbarContent}
                </Toolbar>
            </AppBar>
            <Box
                component='nav'
                sx={{ width: { [mobileBreakpoint]: drawerWidth }, flexShrink: { [mobileBreakpoint]: 0 } }}
                aria-label='room settings'
            >
                {isOnMobile && <Drawer
                    variant='temporary'
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>}
                {!isOnMobile && <Drawer
                    variant='permanent'
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>}
            </Box>
            <Box
                component='main'
                sx={{ flexGrow: 1, p: 3, width: { [mobileBreakpoint]: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                {props.children}
            </Box>
        </Box>
    )
}
