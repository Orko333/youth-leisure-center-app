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
        // === ЗБІЛЬШУЄМО ЩЕ БІЛЬШЕ ===
        fontSize: 16, // Базовий розмір шрифту (був 15)
        h4: {
            fontWeight: 700,
            fontSize: '2.2rem', // Збільшуємо заголовки 4-го рівня
            color: '#172B4D',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.6rem', // ...і 5-го
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.25rem', // ...і 6-го
        },
        body1: {
            fontSize: '1rem', // тепер це 16px
        },
        button: {
            fontSize: '1rem', // ~16px
            fontWeight: 600,
        }
    },
    components: {
        // Збільшуємо висоту верхньої панелі
        MuiToolbar: {
            styleOverrides: {
                root: {
                    minHeight: '72px !important', // Робимо AppBar вищим
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
                    padding: '12px 28px', // Ще більші кнопки
                },
                startIcon: {
                    marginRight: '10px',
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20, // Ще більш плавні кути
                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    margin: '6px 12px',
                    paddingTop: '14px', // Ще вищі пункти меню
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
                    padding: '16.5px 16px', // Дуже помітні поля вводу
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {

                    padding: '24px 20px', // Дуже просторі таблиці
                    fontSize: '1.05rem', // Гарантуємо, що текст в таблиці також великий
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
                    width: 48, // Стандартні аватари також трохи більші
                    height: 48,
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 52, // Більше місця для іконок
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: '0.9rem', // Робимо текст підказок більшим
                    padding: '8px 12px',
                    borderRadius: 8,
                }
            }
        }
    },
});