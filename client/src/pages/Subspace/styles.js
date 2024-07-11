// Styling for Subspace.jsx
const styles = () => ({
    leftContainer: { height: { xs: "0", md: "80vh" }, minWidth: { xs: "0", md: "275px" } },
    mainContainer: { width: "100%", maxWidth: { xs: "99%", md: "65%", lg: "75%" }, margin: "0 auto", padding: "32px 16px" },
    flexContainer: { display: "flex" },
    noSubspaceFoundContainer: { display: "flex", flexDirection: "column", alignItems: "center" },
    primaryLoadingScreenStyling: { height: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
    primaryProgressBar: { width: { xs: "80%", md: "500px" }, color: "#0090c1", marginTop: "7.5px" },
    titleFont: { fontSize: { xs: "24px", md: "36px" } },
    mainDialog: {
        display: "flex",
        justify: "start",
        gap: { xs: "10px", sm: "25px" },
        alignItems: { xs: "start", sm: "center" },
        maxHeight: "160px",
        padding: { xs: "8px", sm: "24px" },
        bgcolor: "background.backdrop",
        borderRadius: "16px",
        overflow: "hidden"
    },
    avatarContainer: { display: "flex", flexDirection: "column", alignSelf: "center", bgcolor: "background.primary", borderRadius: "50%", padding: "5px" },
    subspaceAvatar: { fontSize: { xs: "32px", sm: "48px" }, height: { xs: "80px", sm: "125px" }, width: { xs: "80px", sm: "125px" } },
    subspaceTitle: { fontSize: { xs: "24px", sm: "34px" }, fontWeight: "bold" },
    subspaceName: { fontSize: { xs: "18px", sm: "24px" } },
    subspaceDescription: { fontSize: { xs: "14px", sm: "16px" }, maxHeight: "50px", overflow: "scroll", wordBreak: "break-all", hyphens: "auto" },
    subspaceOperation: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px" },
    subspaceBtn: { float: "right", display: "flex", gap: "8px", alignItems: "center" },

    subspaceString: { fontSize: "12px", width: "18px", minWidth: "18px" },
    btn: { width: { xs: "110px", sm: "125px" }, borderRadius: "100px", fontSize: { xs: "12px", sm: "16px" } },
    notJoinedBtn: {
        bgcolor: "#0090c1",
        color: "#ffffff",
        padding: "4px 24px",
        "&:hover": {
            backgroundColor: "button.secondary",
            color: "button.primary"
        }
    },
    joinedBtn: { padding: "3px 24px", border: "1px solid #0090c1" },
    postContainer: {
        display: "flex",
        justifyContent: "center",
        minHeight: "50vh",
        alignItems: "center",
        borderRadius: "16px",
        bgcolor: "background.backdrop"
    }
});

export default styles;