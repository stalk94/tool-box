import { ThemeOptions } from '@mui/material/styles'
import { Zoom, Tooltip } from '@mui/material';

/*
    *********************************************
        глобальные стили для элементов
    *********************************************
*/

// Установки для типографии
export const typography: ThemeOptions = {
    typography: {
        fontFamily: '"Inter", "Arial", sans-serif',
        fontWeightRegular: 400,
        allVariants: {
            wordBreak: 'break-word',        // перенос с разрывом
            letterSpacing: '0.5px',
        },
        h4: {
            fontSize: '2rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
        },
        body1: {
            
        },
        body2: {
            
        },
        subtitle1: {
            opacity: 0.7
        },
        subtitle2: {
            opacity: 0.5
        },
        caption: {
            opacity: 0.5
        },
        button: {
            textTransform: 'uppercase',
            fontWeight: 600,
        },
    },
}

/** предустановки компонентов (!никаких явно заданных цветов) */
export const components: ThemeOptions = {
    components: {
        MuiButton: {
            variants: [
                {
                    props: { size: 'mini' },
                    style: {
                        padding: '2px 6px',
                        fontSize: '0.7rem',
                        minHeight: '24px',
                        minWidth: '48px',
                        lineHeight: 1.2,
                    },
                },
            ],
        },
        MuiIconButton: {
            variants: [
                {
                    props: { size: 'mini' },
                    style: {
                        width: 24,
                        height: 24,
                        padding: 2,
                        '& svg': {
                            fontSize: '1rem',
                        },
                    },
                },
            ],
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    '& input:-webkit-autofill': {
                        boxShadow: '0 0 0 1000pxrgba(245, 245, 245, 0) inset', // ← цвет фона
                        WebkitTextFillColor: 'white',
                        transition: 'background-color 5000s ease-in-out 0s', // хак
                    },
                }
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: '14px',
                    borderRadius: '8px',
                    padding: '8px 12px',
                },
            },
            defaultProps: {
                slots: {
                    transition: Zoom,
                },
                arrow: true,
            },
        },
        // подсказки слева внизу экрана
        MuiSnackbarContent: {
            styleOverrides: {
                root: {
                   
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                // todo: ! опа новый трюк, запомнить
                paper: ({ theme }) => ({
                    marginTop: 4,
                    maxHeight: '70vh',
                    minWidth: '200px',
                    backgroundColor: theme.palette?.menu?.main,
                    //backdropFilter: 'blur(14px)',
                }),
            },
            defaultProps: {
                elevation: 1,
            },
        },
        // autocomplete popup
        MuiAutocomplete: {
            styleOverrides: {
                paper: ({ theme }) => ({
                    marginTop: 3,
                    marginLeft: -10,
                    //marginRight: -10,
                    backgroundColor: theme.palette?.menu?.main,
                    //backdropFilter: 'blur(14px)',
                }),
            }
        },
        MuiSlider: {
            styleOverrides: {
                rail: {
                    height: 1, // 👈 уменьшенная высота рельсы
                    borderRadius: 2,
                },
                track: {
                    height: 1, // 👈 чтобы совпадало с rail
                },
                thumb: {
                    //marginTop: '-6px', // 👈 визуальное выравнивание по центру
                    width: 10,
                    height: 1
                },
            },
        },
        // list
        MuiListItemText: {
            defaultProps: {
                
            },
            styleOverrides: {
                root: {
                    minWidth: 80
                },
                primary: {
                    fontSize: 14,
                    fontWeight: 500,
                },
                secondary: {
                    fontSize: 12,
                    color: '#777',
                },
            },
        },
        MuiListItemIcon: {
            defaultProps: {
                
            },
            styleOverrides: {
                root: {
                    marginLeft: 3,
                    minWidth: 38,
                    color: 'silver',               
                    display: 'flex',
                    '& svg': {
                        fontSize: '1.2rem',     // напрямую задаём размер svg-иконке
                    }
                }
            }
        },

        MuiPopover: {
            defaultProps: {
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
                transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                },
            },
            styleOverrides: {
                paper: ({ theme }) => ({
                    backgroundColor: theme.palette?.menu?.main,
                    backdropFilter: 'blur(8px)',
                }),
                // окружаюгий фон
                root: {
                
                },
            },
        },
        // модалка
        MuiDialog: {
            styleOverrides: {
                paper: {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(24px)',
                },
                root: {
                    
                }
            },
            defaultProps: {
                scroll: 'paper',
            }
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {   
                    fontWeight: 600,
                    padding: '18px 24px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                }
            }
        },
        MuiDialogContent: {
            styleOverrides: {
                root: {
                    fontSize: 14,
                    padding: '12px 24px',
                }
            }
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    padding: '12px 24px',
                    justifyContent: 'flex-end',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                }
            }
        }
    }
}