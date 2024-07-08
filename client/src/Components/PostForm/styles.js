// Styling for PostForm.jsx
const styles = () => ({
    clearBtn: {
        "&:hover": {
            backgroundColor: "button.secondary",
            color: "button.primary"
        }
    },
    postBtn: {
        bgcolor: "#0090c1",
        color: "#ffffff",
        marginLeft: "8px",
        "&:hover": {
            backgroundColor: "button.secondary",
            color: "button.primary"
        }
    },
    fileUploadButton: {
        width: "100%",
        bgcolor: "background.backdrop",
        color: "text.primary",
        fontWeight: "bold",
        padding: "32px 0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #c4c4c4",
        borderRadius: "0.3rem",
        cursor: "pointer"
    },
    resetSelectedFilesBtn: { marginTop: "16px" }
});

export default styles;