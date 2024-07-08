import React from "react";
import JoditEditor from "jodit-react";

const CustomJoditEditor = React.forwardRef((props, ref) => {
    const { selectedTheme, value, handleChange } = props;

    const joditConfig = {
        readonly: false,
        height: "250px",
        width: "auto",
        enableDragAndDropFileToEditor: true,
        buttons: ["source", "|", "bold", "italic", "underline", "strikethrough", "|", "ul", "ol", "|", "font", "fontsize", "|", "left", "center", "right", "justify", "|", "brush", "paragraph", "|", "image", "table", "link", "undo", "redo", "|", "hr", "eraser", "fullsize",],
        uploader: { insertImageAsBase64URI: true },
        removeButtons: ["brush", "file"],
        showXPathInStatusbar: false,
        toolbarAdaptive: true,
        toolbarSticky: true,
        theme: selectedTheme === "dark" ? "dark" : "default",
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