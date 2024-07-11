// Styling for SubspaceForm.jsx
const styles = () => ({
    resetBtn: {
        "&:hover": {
            backgroundColor: "button.secondary",
            color: "button.primary"
        }
    },
    createBtn: {
        bgcolor: "#0090c1",
        color: "#ffffff",
        marginLeft: "8px",
        "&:hover": {
            backgroundColor: "button.secondary",
            color: "button.primary"
        }
    },
    stepperContainer: {
        width: "auto",
        minWidth: { xs: "99%", md: "65%", lg: "75%" },
        margin: "0 auto",
        padding: "32px 16px",
        position: "fixed",
        bottom: "15px",
        left: { xs: "0", md: "auto" },
        right: { xs: "0", md: "auto" }
    },
    topicsContainer: {
        "@media (min-width: 900px)": {
            width: "600px",
            position: "absolute",
        }
    },
    chipContainer: { display: "flex", justifyContent: "start", flexWrap: "wrap", gap: "5px" },
});

export default styles;