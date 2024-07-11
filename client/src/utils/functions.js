function formatDate(date) {
    return new Date(date).toUTCString().slice(5, 17);
}

function formatMembersCount(membersCount) {
    if (membersCount === 0) {
        return `No explorers`;
    } else if (membersCount === 1) {
        return `1 explorer`;
    } else if (membersCount < 1000) {
        return `${membersCount} explorers`;
    } else if (membersCount >= 1000 && membersCount < 1000000) {
        return `${membersCount / 1000}k explorers`;
    } else {
        return `${membersCount / 1000000}m explorers`;
    }
}

export { formatDate, formatMembersCount };