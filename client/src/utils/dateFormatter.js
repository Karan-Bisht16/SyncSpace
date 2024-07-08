function formatDate(date) {
    return new Date(date).toUTCString().slice(5, 17);
}

export default formatDate;