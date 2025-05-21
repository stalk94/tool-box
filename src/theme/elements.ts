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
                    backdropFilter: 'blur(14px)',
                }),
            },
            defaultProps: {
                elevation: 0,
            },
        },
        // autocomplete popup
        MuiAutocomplete: {
            styleOverrides: {
                paper: ({ theme }) => ({
                    marginTop: 3,
                    marginLeft: -20,
                    //marginRight: -10,
                    backgroundColor: theme.palette?.menu?.main,
                    backdropFilter: 'blur(14px)',
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
        // модалка
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#1e1e1e',   // фон диалога
                    borderRadius: 12,            // скругления
                    color: '#fff',               // текст по умолчанию
                    padding: 16,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                },
                root: {
                    backdropFilter: 'blur(4px)', // блюр фона
                }
            },
            defaultProps: {
                // можно отключить Escape, задать scroll и др.
                scroll: 'paper',
            }
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontSize: 18,
                    fontWeight: 600,
                    padding: '16px 24px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                }
            }
        },
        MuiDialogContent: {
            styleOverrides: {
                root: {
                    padding: '16px 24px',
                    fontSize: 14,
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