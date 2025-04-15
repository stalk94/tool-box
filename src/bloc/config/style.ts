/**
 * -------------------------------------------------------------------
 * Инлайн стили
 * -------------------------------------------------------------------
 */
export const baseOptions = {
    display: [
        "block",
        "flex",
        "inline",
        "inline-block",
        "grid",
        "contents",
    ],
    textAlign: [
        "left",
        "right",
        "justify",
        "start",
        "end",
        "center"
    ],
    width: 'limit',
    height: 'limit',
    background: "color",
    //backgroundColor: "color",
    color: "color",
    padding: "number",
    //paddingLeft: "string?",
    //paddingRight: "string?",
    //paddingTop: "string?",
    //paddingBottom: "string?",
    margin: "number",
    //marginLeft: "string?",
    //marginRight: "string?",
    //marginTop: "string?",
    //marginBottom: "string?",
    borderRadius: "number"
}
export const flexOptions = {
    //flex: false,            //! тут надо покурить документацию (можно прикольно сделать)
    flexDirection: ["column", "column-reverse", "row", "row-reverse"],
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
export const textOptionsAll = {
    "fontFamily": undefined,
    "fontWeight": ['normal', 'bold', '600', '800'],
    "fontSize": [6, 32],
    "letterSpacing": "number",
    "wordSpacing": "number",
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
export const textOptions = {
    "fontFamily": 'string',
    "fontWeight": ['normal', 'bold', '600', '800'],
    "fontSize": [6, 32],
    "letterSpacing": 'number',
    "wordSpacing": 'number',
    "fontStyle": ["normal", "italic", "oblique"],
  
    "textAlign": ["left", "right", "center", "justify", "start", "end"],
    "textOverflow": ["clip", "ellipsis"],
    "textTransform": ["none", "lowercase", "capitalize", "uppercase"],
    "textDecoration": ["line-through", "none", "overline", "underline"],
    "textDecorationStyle": ["solid", "double", "dotted", "dashed", "wavy"],
  
    "overflowWrap": ["normal", "break-word"],
    "whiteSpace": ["normal", "pre", "nowrap", "pre-wrap", "pre-line"],
    "verticalAlign": ["baseline", "top", "bottom", "middle", "sub", "super", "text-top", "text-bottom"],
    "wordBreak": ["normal", "break-all", "keep-all", "break-word"],
}