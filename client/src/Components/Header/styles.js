// Styling for Header.jsx
const styles = () => ({
    appBar: {
        height: { xs: "55px", sm: "75px" },
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: { xs: "0 8px 0 0", sm: "16px 16px 16px 0px" },
        bgcolor: "background.primary",
        zIndex: { xs: "1199", md: "1201" },
    },
    flexContainer: { display: "flex", alignItems: "center" },
    sideBar: { display: { sm: "flex", md: "none" }, paddingRight: { xs: "0", sm: "12px" } },
    logo: { width: "45px", height: "45px", borderRadius: "50%" },
    titleComponent: {
        display: "flex",
        flexDirection: "row",
        gap: "15px",
        alignItems: "center",
        textDecoration: "none",
        marginRight: "15px",
        marginLeft: { xs: "0", md: "24px" }
    },
    title: { color: "white", display: { xs: "none", sm: "flex" } },
    link: { textDecoration: "none" },
    createPostBtn: {
        height: "37px",
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