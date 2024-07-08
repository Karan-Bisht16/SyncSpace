// Styling for Header.jsx
const styles = () => ({
    appBar: {
        height: "75px",
        display: "flex",
        flexDirection: "row",
        gap: "15px",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 16px 16px 8px",
        bgcolor: "background.primary",
        zIndex: { xs: "1199", md: "1201" },
    },
    flexContainer: { display: "flex", alignItems: "center" },
    sideBar: { display: { sm: "flex", md: "none" }, paddingRight: "12px" },
    logo: { width: "45px", height: "45px", borderRadius: "50%" },
    logoTitle: {
        display: "flex",
        flexDirection: "row",
        gap: "15px",
        alignItems: "center",
        textDecoration: "none",
        marginRight: "15px",
        marginLeft: { xs: "0", md: "24px" }
    },
    link: { textDecoration: "none" },
    createPostBtn: {
        bgcolor: "button.primary",
        color: "button.secondary",
        "&:hover": {
            backgroundColor: "button.secondary",
            color: "button.primary"
        }
    },
    createPostBtnXS: { padding: "0 !important", border: "none", outline: "none" }
});

export default styles;