import React from "react";
import JoditEditor from "jodit-react";

const CustomJoditEditor = React.forwardRef((props, ref) => {
    const { selectedTheme, value, handleChange } = props;

    const joditConfig = {
        readonly: false,
        height: "auto",
        width: "auto",
        minHeight: 275,
        maxHeight: 500,
        style: { font: "16px Noto Sans" },
        enableDragAndDropFileToEditor: true,
        buttons: ["bold", "italic", "underline", "strikethrough", "|", "ul", "ol", "|", "font", "fontsize", "|", "left", "center", "right", "justify", "|", "brush", "paragraph", "|", "table", "link", "undo", "redo", "|", "hr", "eraser", "fullsize"],
        buttonsMD: ["bold", "italic", "underline", "|", "left", "center", "right", "justify", "|", "ul", "ol", "|", "font", "fontsize", "|", "brush", "paragraph", "|", "link", "hr", "fullsize"],
        buttonsSM: ["bold", "italic", "underline", "|", "left", "center", "right", "justify", "|", "ul", "ol", "|", "font", "fontsize", "|", "brush", "paragraph", "|", "link", "hr", "fullsize"],
        buttonsXS: ["bold", "italic", "underline", "left", "center", "right", "link", "fontsize", "brush", "paragraph", "fullsize", "dots"],
        uploader: { insertImageAsBase64URI: false },
        showXPathInStatusbar: false,
        toolbarAdaptive: true,
        toolbarSticky: true,
        theme: selectedTheme === "dark" ? "dark" : "default",
        enter: "br",
    };

    return (
        <JoditEditor
            ref={ref}
            value={value}
            config={joditConfig}
            onBlur={newContent => handleChange(newContent)}
            onChange={() => { }}
        />
    );
});

export default CustomJoditEditor;