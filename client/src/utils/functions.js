function formatDate(date) {
    return new Date(date).toUTCString().slice(5, 17);
}

function formatTime(date) {
    const past = new Date(date);
    const today = new Date();
    const diffInSec = (today.getTime() - past.getTime()) / 1000;
    if (diffInSec < 60) {
        return `${Math.floor(diffInSec)}s`;
    } else {
        const diffInMin = diffInSec / 60;
        if (diffInMin < 60) {
            return `${Math.floor(diffInMin)}m`;
        } else {
            const diffInHrs = diffInMin / 60;
            if (diffInHrs < 24) {
                return `${Math.floor(diffInHrs)}h`;
            } else {
                const diffInDays = diffInHrs / 24;
                if (diffInDays < 7) {
                    return `${Math.floor(diffInDays)}d`;
                } else {
                    const diffInWeeks = diffInDays / 7;
                    if (diffInWeeks < 5) {
                        return `${Math.floor(diffInWeeks)}w`;
                    } else {
                        const diffInMonths = diffInWeeks / 4;
                        if (diffInMonths < 13) {
                            return `${Math.floor(diffInWeeks)}M`;
                        } else {
                            const diffInYears = diffInMonths / 12;
                            return `${Math.floor(diffInYears)}y`;
                        }
                    }
                }
            }
        }
    }
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

export { formatDate, formatTime, formatMembersCount };