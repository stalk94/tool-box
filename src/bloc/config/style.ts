/**
 * -------------------------------------------------------------------
 * Инлайн стили
 * -------------------------------------------------------------------
 */
export const baseOptions = {
    display: [
        "block",
        "inline",
        "inline-block",
        "flex",
        "grid",
        "none",
        "contents",
        "hidden"
    ],
    textAlign: [
        "left",
        "right",
        "justify",
        "start",
        "end",
        "center"
    ],
    width: "string",
    height: "string",
    background: "string",
    backgroundColor: "string",
    color: "string",
    padding: "string",
    paddingLeft: "string?",
    paddingRight: "string?",
    paddingTop: "string?",
    paddingBottom: "string?",
    margin: "string?",
    marginLeft: "string?",
    marginRight: "string?",
    marginTop: "string?",
    marginBottom: "string?",
    borderRadius: "string"
}
export const flexOptions = {
    flex: false,
    flexDirection: ["column", "row", "row-reverse", "column-reverse"],
    flexWrap: ["nowrap", "wrap", "wrap-reverse"],
    justifyContent: [
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
        "space-evenly",
    ],
    alignItems: ["stretch", "flex-start", "flex-end", "center", "baseline"],
    alignContent: [
        "stretch",
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
    ],
    alignSelf: ["auto", "stretch", "flex-start", "flex-end", "center", "baseline"],
}
export const listTypesText = {
    "fontFamily": undefined,
    "fontWeight": ['normal', 'bold', '600', '800'],
    "fontSize": [],
    "letterSpacing": undefined,
    "wordSpacing": undefined,
    "fontStyle": ["normal", "italic", "oblique"],
  
    "textAlign": ["left", "right", "center", "justify", "start", "end"],
    "textOverflow": ["clip", "ellipsis"],
    "textTransform": ["lowercase", "capitalize", "none", "uppercase"],
  
    "textDecoration": ["line-through", "none", "overline", "underline"],
    "textDecorationStyle": ["solid", "double", "dotted", "dashed", "wavy"],
    "textDecorationThickness": undefined,
    "textDecorationColor": undefined,
  
    "overflowWrap": ["normal", "break-word"],
    "whiteSpace": ["normal", "pre", "nowrap", "pre-wrap", "pre-line"],
    "verticalAlign": ["baseline", "top", "bottom", "middle", "sub", "super", "text-top", "text-bottom"],
    "wordBreak": ["normal", "break-all", "keep-all", "break-word"],
  
    "direction": ["ltr", "rtl"],
    "text-shadow": undefined
}
export const listTypesTextBase = {
    "fontFamily": undefined,
    "fontWeight": ['normal', 'bold', '600', '800'],
    "fontSize": [],
    "letterSpacing": undefined,
    "wordSpacing": undefined,
    "fontStyle": ["normal", "italic", "oblique"],
  
    "textAlign": ["left", "right", "center", "justify", "start", "end"],
    "textOverflow": ["clip", "ellipsis"],
    "textTransform": ["lowercase", "capitalize", "none", "uppercase"],
    "textDecoration": ["line-through", "none", "overline", "underline"],
    "textDecorationStyle": ["solid", "double", "dotted", "dashed", "wavy"],
  
    "overflowWrap": ["normal", "break-word"],
    "whiteSpace": ["normal", "pre", "nowrap", "pre-wrap", "pre-line"],
    "verticalAlign": ["baseline", "top", "bottom", "middle", "sub", "super", "text-top", "text-bottom"],
    "wordBreak": ["normal", "break-all", "keep-all", "break-word"],
}