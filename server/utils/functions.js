function condenseUserInfo(user) {
    const userSessionObj = {
        _id: user._id,
        name: user.name,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar ? user.avatar : "",
    };
    return userSessionObj;
}

const pagination = (startIndex, LIMIT) => {
    return [
        { $skip: Number(startIndex) },
        { $limit: Number(LIMIT) },
    ];
}
const sortBasedOnPopularity = [
    { $addFields: { metric: { $sum: ["$likesCount", "$commentsCount"] } } },
    { $sort: { metric: -1 } },
];
const postDetailsExtraction = [
    { $unwind: "$postDetails" },
    { $replaceRoot: { newRoot: "$postDetails" } }
];
const authorAndSubspaceDetails = [
    {
        $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "authorDetails",
        },
    },
    { $unwind: "$authorDetails" },
    {
        $lookup: {
            from: "subspaces",
            localField: "subspaceId",
            foreignField: "_id",
            as: "subspaceDetails",
        },
    },
    { $unwind: "$subspaceDetails" }
];
const postDataStructure = {
    $project: {
        title: 1,
        body: 1,
        selectedFile: 1,
        authorId: 1,
        subspaceId: 1,
        dateCreated: 1,
        likesCount: 1,
        commentsCount: 1,
        edited: 1,
        "subspaceDetails.avatar": 1,
        "subspaceDetails.subspaceName": 1,
        "subspaceDetails.isDeleted": 1,
        "authorDetails.userName": 1,
        "authorDetails.isDeleted": 1,
    },
};
const baseQuery = (startIndex, LIMIT) => {
    return [
        ...sortBasedOnPopularity,
        ...pagination(startIndex, LIMIT),
        ...authorAndSubspaceDetails,
        postDataStructure,
    ]
};

export { condenseUserInfo, pagination, sortBasedOnPopularity, postDetailsExtraction, authorAndSubspaceDetails, postDataStructure, baseQuery };