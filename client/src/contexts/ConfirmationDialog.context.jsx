import { createContext, useContext, useState } from "react";
import { useDispatch } from "react-redux";
// Importing contexts
import { ReRenderContext } from "./ReRender.context";
import { SnackBarContext } from "./SnackBar.context";
// Importing actions
import { createPost, uploadPostMedia, deletePost } from "../actions/post";
import { createSubspace, uploadSubspaceAvatar, deleteSubspace } from "../actions/subspace";
import { changePassword, deleteProfile } from "../actions/user";

export const ConfirmationDialogContext = createContext();
export const ConfirmationDialogProvider = ({ children }) => {
    const [dialog, setDialog] = useState(false);
    const [dialogValue, setDialogValue] = useState({
        title: "",
        message: "",
        cancelBtnText: "",
        submitBtnText: "",
        dialogId: null,
        rest: null,
    });
    const [linearProgressBar, setLinearProgressBar] = useState(false);
    async function openDialog(values) {
        await setDialogValue(values);
        await setDialog(true);
        document.querySelector("#focusPostBtn").focus();
    };
    function closeDialog() {
        setDialog(false);
        setLinearProgressBar(false)
    };

    const { setReRender } = useContext(ReRenderContext);
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const dispatch = useDispatch();
    const handleError = (error) => {
        closeDialog();
        setSnackbarValue({ message: error.message, status: "error" });
        setSnackbarState(true);
    }
    const handleDialog = async () => {
        switch (dialogValue.dialogId) {
            case 1:
                console.log("Create Post");
                try {
                    const { navigate, postData, selectedFile, type, tabIndex, openDialogContent } = dialogValue.rest;
                    setLinearProgressBar(true);
                    let updatedData;
                    if (tabIndex === "1") {
                        updatedData = postData;
                    } else if (tabIndex === "2") {
                        const { body, ...rest } = postData;
                        updatedData = rest;
                    }
                    const { status, result } = await dispatch(createPost(updatedData));
                    closeDialog();
                    if (status === 200) {
                        const postId = result._id;
                        const postData = result;
                        if (selectedFile.length > 0) {
                            openDialogContent("Uploading Media");
                            setLinearProgressBar(true);
                            const { status, result } = await dispatch(uploadPostMedia({ selectedFile, postId, type }));
                            if (status === 200) {
                                navigate(`/post/${postId}`, { state: { postData: postData, status: "success", message: "Post added!", time: new Date().getTime() } });
                            } else {
                                setSnackbarValue({ message: result.message, status: "error" });
                                setSnackbarState(true);
                            }
                            closeDialog();
                        } else {
                            navigate(`/post/${postId}`, { state: { postData: postData, status: "success", message: "Post added!", time: new Date().getTime() } });
                        }
                    } else {
                        setSnackbarValue({ message: result.message, status: "error" });
                        setSnackbarState(true);
                    }
                } catch (error) { handleError(error) }
                break;
            case 2:
                console.log("Delete Post");
                try {
                    const { navigate, _id } = dialogValue.rest;
                    setLinearProgressBar(true);
                    const { status, result } = await dispatch(deletePost({ postId: _id }));
                    closeDialog();
                    if (status === 200) {
                        navigate("/", { state: { message: "Post deleted.", status: "success", time: new Date().getTime() } });
                    } else {
                        setSnackbarValue({ message: result.message, status: "error" });
                        setSnackbarState(true);
                    }
                } catch (error) { handleError(error) }
                break;
            case 3:
                console.log("Create Subspace");
                try {
                    const { navigate, subspaceData, avatar, type, openDialogContent } = dialogValue.rest
                    setLinearProgressBar(true);
                    const { status, result } = await dispatch(createSubspace(subspaceData));
                    closeDialog();
                    if (status === 200) {
                        const subspaceId = result._id;
                        if (avatar && avatar.file) {
                            openDialogContent("Uploading Media");
                            setLinearProgressBar(true);
                            const { status, result } = await dispatch(uploadSubspaceAvatar({ avatar: avatar.file, subspaceId, type }));
                            if (status === 200) {
                                setReRender(prevReRender => !prevReRender);
                                navigate("/", { state: { status: "success", message: `ss/${subspaceData.name.replace(/ /g, "-")} is now live!`, time: new Date().getTime() } });
                            } else {
                                setSnackbarValue({ message: result.message, status: "error" });
                                setSnackbarState(true);
                            }
                            closeDialog();
                        } else {
                            setReRender(prevReRender => !prevReRender);
                            navigate("/", { state: { status: "success", message: `ss/${subspaceData.name.replace(/ /g, "-")} is now live!`, time: new Date().getTime() } });
                        }
                    } else {
                        setSnackbarValue({ message: result.message, status: "error" });
                        setSnackbarState(true);
                    }
                } catch (error) { handleError(error) }
                break;
            case 4:
                console.log("Join Subspace");
                try {
                    const { navigate, subspaceData, subspaceName, handleJoin } = dialogValue.rest;
                    setLinearProgressBar(true);
                    await handleJoin();
                    closeDialog();
                    navigate("/create-post", { state: { subspaceName, subspaceId: subspaceData?._id } });
                } catch (error) { handleError(error) }
                break;
            case 5:
                console.log("Delete Subspace");
                try {
                    const { navigate, subspaceData } = dialogValue.rest;
                    setLinearProgressBar(true);
                    const { status, result } = await dispatch(deleteSubspace({ subspaceId: subspaceData?._id }));
                    closeDialog();
                    if (status === 200) {
                        setReRender(prevReRender => !prevReRender);
                        navigate("/", { state: { message: "Subspace deleted successfully", status: "success", time: new Date().getTime() } });
                    } else {
                        setSnackbarValue({ message: result.message, status: "error" });
                        setSnackbarValue(true);
                    }
                } catch (error) { handleError(error) }
                break;
            case 6:
                console.log("Discard Comments");
                try {
                    const { setComment, setAddComment } = dialogValue.rest;
                    closeDialog();
                    setAddComment(false);
                    setComment("");
                } catch (error) { handleError(error) }
                break;
            case 7:
                console.log("Discard Reply");
                try {
                    const { setReply, setOpenReply } = dialogValue.rest;
                    closeDialog();
                    setOpenReply(false);
                    setReply("");
                } catch (error) { handleError(error) }
                break;
            case 8:
                console.log("Change Password");
                try {
                    const { navigate, formData } = dialogValue.rest;
                    setLinearProgressBar(true);
                    const { status, result } = await dispatch(changePassword(formData));
                    closeDialog();
                    if (status === 200) {
                        navigate(-1);
                    } else {
                        setSnackbarValue({ message: result.message, status: "error" });
                        setSnackbarState(true);
                    }
                } catch (error) { handleError(error) }
                break;
            case 9:
                console.log("Delete Account");
                try {
                    const { navigate } = dialogValue.rest;
                    setLinearProgressBar(true);
                    const { status, result } = await dispatch(deleteProfile());
                    closeDialog();
                    if (status === 200) {
                        navigate("/");
                        window.location.reload();
                    } else {
                        setSnackbarValue({ message: result.message, status: "error" });
                        setSnackbarState(true);
                    }
                } catch (error) { handleError(error) }
                break;
            default:
                return null;
        }
    }

    return (
        <ConfirmationDialogContext.Provider value={{ dialog, dialogValue, openDialog, closeDialog, handleDialog, linearProgressBar, setLinearProgressBar }}>
            {children}
        </ConfirmationDialogContext.Provider>
    )
}