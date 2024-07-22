// Styling for SubspaceForm.jsx
const styles = () => ({
    resetBtn: {
        "&:hover": {
            backgroundColor: "button.secondary",
            color: "button.primary",
        },
    },
    createBtn: {
        bgcolor: "#0090c1",
        color: "#ffffff",
        marginLeft: "8px",
        "&:hover": {
            backgroundColor: "button.secondary",
            color: "button.primary",
        },
    },
    stepperContainer: {
        width: "auto",
        minWidth: { xs: "99%", md: "65%", lg: "75%" },
        margin: "0 auto",
        padding: { xs: "4px 16px 8px 4px", sm: "32px 16px" },
        position: "fixed",
        bottom: "0px",
        left: { xs: "0", md: "auto" },
        right: { xs: "0", md: "auto" },
        bgcolor: "background.default",
    },
    topicsContainer: {
        "@media (min-width: 900px)": {
            width: "600px",
            position: "absolute",
        },
    },
    selectedChipContainer: { bgcolor: "background.secondary", borderRadius: "16px", padding: "4px 16px", maxHeight: "15vh", overflow: "scroll" },
    selectedChipContainerArray: { padding: "12px 0", display: "flex", flexWrap: "wrap", gap: "5px" },
    chipContainer: { display: "flex", justifyContent: "start", flexWrap: "wrap", gap: "5px", maxHeight: "25vh", overflow: "scroll" },
    chipDivider: { height: "2px", width: "100%", flexBasis: "100%", margin: "4px 0" }
});

export default styles;