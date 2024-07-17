// Styling for Post.jsx
const styles = () => ({
    mainContainer: {
        padding: "8px 16px", borderRadius: "24px", marginBottom: "16px", wordBreak: "break-word",
        boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px"
    },
    subContainer: { display: "flex", flexDirection: "row", justifyContent: "space-between" },
    postHeader: { display: "flex", gap: "8px", alignItems: "center" },
    avatarContainer: { bgcolor: "background.primary", padding: "2.5px", borderRadius: "50%", },
    avatar: { width: "32.5px", height: "32.5px" },
    postHeaderDetails: { display: "flex", gap: "2px", alignItems: "center" },
    postSubspace: { fontSize: "18px", cursor: "pointer", marginRight: "8px" },
    headerText: { fontSize: "12px" },
    closeBtn: { color: "text.heading", cursor: "pointer", borderRadius: "50%" },
    link: { cursor: "pointer", textDecoration: "none" },
    bodyContainer: {
        bgcolor: "background.tertiary",
        borderRadius: "16px",
        padding: "12px 16px",
        margin: "4px 0 8px 0",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px"
    },
    bodyText: { wordBreak: "break-word" },
    author: { fontSize: "18px", textAlign: "right", cursor: "pointer" },
    fileContainer: { display: "flex", justifyContent: "center", height: { xs: "auto", md: "625px" }, objectFit: "scale-down" },
    imageContainer: {
        display: "flex",
        justifyContent: "center",
        lineHeight: "300px",
        margin: "8px 0",
        borderRadius: "16px",
        objectFit: "scale-down",
        overflow: "hidden"
    },
    imageBox: { height: "100%", width: "100%", verticalAlign: "middle" },
    allPostActionsContainer: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    majorPostActionsContainer: {
        color: "text.heading",
        width: "250px",
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        borderRadius: "32px"
    },
    iconColor: { color: "text.heading" },
    iconText: { fontSize: "16px" },
});

export default styles;