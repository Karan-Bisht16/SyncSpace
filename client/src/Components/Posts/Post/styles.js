// Styling for Post.jsx
const styles = () => ({
    mainContainer: {
        padding: "8px 16px", borderRadius: "24px", marginBottom: "16px", wordBreak: "break-word", bgcolor: "background.secondary",
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
        bgcolor: "background.default",
        borderRadius: "16px",
        padding: "12px 16px",
        margin: "4px 0",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px"
    },
    bodyText: { wordBreak: "break-word" },
    bodyFooter: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px 8px 16px" },
    author: { fontSize: "18px", cursor: "pointer" },
    fileContainer: {
        display: "flex",
        justifyContent: "center",
        maxHeight: { xs: "600px", md: "500px" },
        objectFit: "scale-down",
    },
    imageContainer: {
        display: "flex",
        justifyContent: "center",
        margin: "8px 0",
        borderRadius: "16px",
        objectFit: "contain",
        overflow: "hidden",
        width: "100%"
    },
    carouselImageItem: { objectFit: "scale-down", height: "100%", textAlign: "center" },
    carouselMiscItem: { objectFit: "scale-down", width: "100%", lineHeight: "75px", height: "50px" },
    audioContainer: { bgcolor: "background.default", borderRadius: "16px", margin: "8px 0" },
    multipleImageBox: { height: "100%", borderRadius: "16px", verticalAlign: "middle", objectFit: "scale-down" },
    imageBox: { maxWidth: "100%", maxHeight: "800px", borderRadius: "16px", verticalAlign: "middle", objectFit: "scale-down" },
    videoBox: { borderRadius: "16px" },
    audioBox: { borderRadius: "16px", background: "inherit" },
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