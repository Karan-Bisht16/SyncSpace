// Styling for RealTimeSubspaceViewer.jsx
const styles = () => ({
    profileContainer: {
        height: { xs: "175px", lg: "325px" },
        width: { xs: "auto", sm: "500px" },
        marginRight: { xs: "16px", sm: "0" },
        padding: { xs: "0 8px", sm: "4px 12px" },
        borderRadius: "10px",
        bgcolor: "background.tertiary",
        boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
        marginBottom: "0",
        position: { xs: "absolute", lg: "relative" },
        top: { xs: "110px", lg: "0" },
        overflow: "scroll",
    },
    bioContainer: {
        height: "155px",
        width: { xs: "100%", md: "550px", lg: "175px" },
        paddingTop: "4px",
        wordBreak: "break-word",
        overflow: "auto",
        overflowWrap: "break-word",
        hyphens: "auto",
    },
    flexContainer: { display: "flex", alignItems: "end" },
    mainContainer: { display: "flex", gap: "8px", alignItems: "center" },
    avatarContainer: { bgcolor: "background.primary", padding: "2px", borderRadius: "50%" },
    subspaceString: { fontSize: "12px", width: "18px", minWidth: "18px", paddingBottom: "3px" },
    customSubspaceName: { fontSize: { lg: "14px" }, paddingBottom: "3px" },
    gridItemBox: { padding: "8px 0", wordBreak: "break-all", hyphens: "auto", whiteSpace: "pre-line" },
    gridItemTitle: { fontSize: "12px" },
});

export default styles;