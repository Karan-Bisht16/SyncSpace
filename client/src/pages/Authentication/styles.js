// Styling for Authentication.jsx
const styles = () => ({
    leftContainer: { minWidth: { xs: "0", md: "275px" } },
    mainContainer: {
        width: { xs: "100%", md: "65%", lg: "75%" },
        margin: "0 auto",
        padding: "60px 16px 16px 16px",
        alignItems: "center",
        justifyContent: "center",
    },
    subContainer: { display: "flex", justifyContent: "center" },
    title: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "24px 0 16px 0" },
    formContainer: { width: { xs: "100%", sm: "550px" }, justifyContent: "center", paddingBottom: "16px" },
    showPasswordGrid: { display: "flex", justifyContent: "center", color: "text.primary" },
    showPasswordBtn: {
        height: "100%",
        border: "none",
        color: "inherit",
        background: "transparent",
        position: "relative",
        transform: "translate(-100%, 15%)",
        cursor: "pointer",
        outline: "none",
    },
    bottomGroup: { display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0 16px 0" },
    signBtn: {
        bgcolor: "#0090c1",
        color: "#ffffff",
        fontSize: "18px",
        padding: "8px 0",
        marginBottom: "8px",
        "&:hover": {
            backgroundColor: "button.secondary",
            color: "button.primary"
        },
    },
    linkContainer: { marginTop: "4px", fontSize: { xs: "15px", sm: "18px" } },
    toggleLink: { color: "#0090c1", cursor: "pointer" },
    boxBottomGroup: { width: "100%", display: "flex", justifyContent: "center" },
    positionalOr: { padding: "0 8px", position: "absolute", transform: "translateY(-20%)", bgcolor: "background.secondary" },
});

export default styles;