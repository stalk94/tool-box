import {
    FormatAlignLeft,
    FormatAlignRight,
    FormatAlignCenter,
    FormatAlignJustify,
    ViewStream,              // как альтернатива для space-between
    ViewModule,              // альтернатива для space-around
    DensityMedium
} from '@mui/icons-material';
import {
    SyncAlt,        // Для "row"
    LinearScale,         // Для "column"
    Autorenew, // Для "row-reverse"
    SwapVerticalCircle  // Для "column-reverse"
} from '@mui/icons-material';
import {
    TextFields,        // Для "lowercase"
    TextFormat,        // Для "capitalize"
    FontDownload,      // Для "none"
    TextRotationNone   // Для "uppercase"
} from '@mui/icons-material';


export const iconListStyle = {
    justifyContent: {
        "flex-start": FormatAlignLeft,
        "flex-end": FormatAlignRight,
        "center": FormatAlignCenter,
        "space-between": ViewStream,
        "space-around": ViewModule,
        "space-evenly": DensityMedium
    },
    flexDirection: {
        "row": ViewModule,
        "column": DensityMedium,
        "row-reverse": SyncAlt,
        "column-reverse": Autorenew
    },
    textAlign: {
        "left": FormatAlignLeft,
        "right": FormatAlignRight,
        "center": FormatAlignCenter,
        "justify": FormatAlignJustify,
    },
    textTransform: {
        "lowercase": TextFields,
        "capitalize": TextFormat,
        "uppercase": TextRotationNone
    }
}

