import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2962ff',
            light: '#768fff',
            dark: '#0039cb',
        },
        secondary: {
            main: '#9c27b0',
        },
        background: {
            default: '#f4f6f8',
            paper: '#ffffff',
        },
        success: {
            main: '#2e7d32',
        },
        text: {
            primary: '#172B4D',
            secondary: '#5E6C84',
        }
    },
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        
        fontSize: 16, 
        h4: {
            fontWeight: 700,
            fontSize: '2.2rem', 
            color: '#172B4D',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.6rem', 
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.25rem', 
        },
        body1: {
            fontSize: '1rem', 
        },
        button: {
            fontSize: '1rem', 
            fontWeight: 600,
        }
    },
    components: {
        
        MuiToolbar: {
            styleOverrides: {
                root: {
                    minHeight: '72px !important', 
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#ffffff',
                    borderRight: '1px solid #e0e0e0',
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    textTransform: 'none',
                    padding: '12px 28px', 
                },
                startIcon: {
                    marginRight: '10px',
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20, 
                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    margin: '6px 12px',
                    paddingTop: '14px', 
                    paddingBottom: '14px',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                },
                input: {
                    padding: '16.5px 16px', 
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {

                    padding: '24px 20px', 
                    fontSize: '1.05rem', 
                    verticalAlign: 'middle',
                },
                head: {
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    color: '#000',
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    width: 48, 
                    height: 48,
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 52, 
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: '0.9rem', 
                    padding: '8px 12px',
                    borderRadius: 8,
                }
            }
        }
    },
});