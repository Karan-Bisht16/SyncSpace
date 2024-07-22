// Styling for Profile.jsx 
const styles = () => ({
    leftContainer: { height: { xs: "0", md: "80vh" }, minWidth: { xs: "0", md: "275px" } },
    mainContainer: { width: { xs: "100%", md: "65%", lg: "75%" }, margin: "0 auto", padding: { xs: "32px 8px", md: "32px 16px" } },
    flexContainer: { display: "flex" },
    heading: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    userContainer: { display: "flex", gap: "15px", alignItems: "center", margin: { xs: "16px 16px", md: "16px 0" } },
    userAvatar: { width: { xs: "50px", sm: "75px" }, height: { xs: "50px", sm: "75px" }, fontSize: { xs: "24px", sm: "45px" } },
    userName: { fontWeight: "normal", fontSize: { xs: "18px", sm: "32px" }, margin: "0", overflow: "hide" },
    editProfileBtn: {
        cursor: "pointer",
        padding: "8px 24px",
        borderRadius: "24px",
        bgcolor: "button.tertiary",
        marginRight: { xs: "16px", md: "0" },
        color: "white",
        boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
        "&:hover": {
            color: "#0090c1",
            bgcolor: "#fefefe",
            transition: "0.2s"
        },
    },
    postContainer: {
        minHeight: "50vh",
        maxHeight: "70vh",
        overflow: "scroll",
        padding: "20px 20px",
        borderRadius: "10px",
        bgcolor: "background.tertiary",
        boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
    },
    profileDeletedContainer: { display: "flex", justifyContent: "center", marginTop: "15vh" },
    primaryLoadingScreenStyling: { height: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
    titleFont: { fontSize: { xs: "24px", md: "36px" } },
    progressBar: { width: { xs: "80%", md: "500px" }, color: "#0090c1", marginTop: "7.5px" },
    titleField: { marginBottom: "4px" },
    clearBtn: { color: "#0090c1", marginBottom: "16px" },
    updateBtn: { bgcolor: "#0090c1", color: "#ffffff", marginLeft: "8px", marginBottom: "16px" },
});

export default styles;