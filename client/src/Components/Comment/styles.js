// Styling for Comment.jsx
const styles = () => ({
    avatarContainer: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
    avatar: { height: { xs: "24px", md: "40px" }, width: { xs: "24px", md: "40px" }, marginTop: "8px" },
    userDetailsContainer: { display: "flex", gap: "8px", alignItems: "center" },
    replyContainer: { display: "flex", gap: "16px", alignItems: "center", margin: "0 8px" },
    replyCancelBtn: {
        "&:hover": {
            backgroundColor: "button.secondary",
            color: "button.primary"
        }
    },
    replyAddBtn: {
        bgcolor: "#0090c1",
        color: "#ffffff",
        marginLeft: "8px",
        "&:hover": {
            backgroundColor: "button.secondary",
            color: "button.primary"
        }
    },
    icon: { cursor: "pointer" },
    iconText: { fontSize: "16px", marginLeft: "4px" },
});

export default styles;