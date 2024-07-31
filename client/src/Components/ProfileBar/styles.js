// Styling for ProfileBar.jsx
const styles = () => ({
    profileContainer: {
        height: { xs: "auto", sm: "460px" },
        maxWidth: "100% !important",
        padding: { xs: "12px", sm: "20px" },
        borderRadius: "10px",
        bgcolor: "background.tertiary",
        boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
        marginTop: { xs: "0", lg: "48px" },
        marginBottom: { xs: "4px", lg: "0" },
    },
    bioContainer: {
        height: "auto",
        maxHeight: "155px",
        width: { xs: "100%", md: "550px", lg: "175px" },
        paddingTop: "8px",
        wordBreak: "break-word",
        overflow: "auto",
        overflowWrap: "break-word",
        hyphens: "auto",
        whiteSpace: "pre-line",
    },
    mainContainer: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: { xs: "0", sm: "8px 0" } },
    copyLinkBtn: { cursor: "pointer", padding: "4px 12px", borderRadius: "16px", bgcolor: "background.default" },
    gridItemBox: { padding: { xs: "4px 0", sm: "8px 0" } },
    gridItemValue: { fontSize: { xs: "14px", sm: "16px" } },
    gridItemTitle: { fontSize: "12px" },
});

export default styles;