import {
    TableCell,
    TableRow,
    styled,
    tableCellClasses,
    Drawer as MuiDrawer,
    AppBar as MuiAppBar,
} from "@mui/material";

const drawerWidth = 260;

// Modern table cell with glass effect
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#ffffff',
        fontWeight: 600,
        fontSize: '0.875rem',
        letterSpacing: '0.025em',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px 20px',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '14px 20px',
    },
}));

// Modern table row with hover effect
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    transition: 'all 0.2s ease',
    '&:nth-of-type(odd)': {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
    '&:nth-of-type(even)': {
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
    },
    '&:hover': {
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

// Modern glassmorphic AppBar
export const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    background: 'rgba(15, 15, 35, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

// Modern sidebar Drawer with gradient accent
export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            // Gradient accent line on the right
            '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '2px',
                height: '100%',
                background: 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                opacity: open ? 1 : 0,
                transition: 'opacity 0.3s ease',
            },
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

// Modern card container
export const ModernCard = styled('div')({
    background: 'rgba(30, 30, 60, 0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '24px',
    transition: 'all 0.3s ease',
    '&:hover': {
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        transform: 'translateY(-2px)',
    },
});

// Stat card with gradient icon background
export const StatCard = styled('div')({
    background: 'rgba(30, 30, 60, 0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '16px',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
    },
    '&:hover': {
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 12px 40px rgba(99, 102, 241, 0.15)',
        transform: 'translateY(-4px)',
        '&::before': {
            opacity: 1,
        },
    },
});

// Icon container with gradient background
export const IconContainer = styled('div')(({ gradient }) => ({
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: gradient || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
    '& svg': {
        fontSize: '28px',
        color: '#ffffff',
    },
}));

// Glass container
export const GlassContainer = styled('div')({
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
});