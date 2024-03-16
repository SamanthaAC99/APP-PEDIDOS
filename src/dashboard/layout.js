import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { SideNav } from './side-nav';
import { TopNav } from './top-nav';
//
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    [theme.breakpoints.up('lg')]: {
        paddingLeft: SIDE_NAV_WIDTH
    }
}));

const LayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%'
});

export const Layout = (props) => {
    const loading = useSelector(state => state.menu);
    const { children } = props;
    const [openNav, setOpenNav] = useState(true);
    const pathname = useLocation();
    
    const handlePathnameChange = useCallback(
        () => {
            if (openNav) {
                setOpenNav(false);
            }
        },
        [openNav]
    );

    useEffect(
        () => {
            handlePathnameChange();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pathname]
    );

    return (
        <>
            <TopNav onNavOpen={() => setOpenNav(true)} />
            <SideNav
                onClose={() => setOpenNav(false)}
                open={openNav}
            />
            <LayoutRoot>
                <LayoutContainer>
                    {children}
                </LayoutContainer>
            </LayoutRoot>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 900 }}
                    open={loading.loading}
                >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};