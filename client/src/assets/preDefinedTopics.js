const preDefinedTopics = [
    { key: 0, label: "Anime & Manga" },
    { key: 1, label: "Cosplay" },
    { key: 2, label: false },
    { key: 3, label: "Art" },
    { key: 4, label: "Design" },
    { key: 5, label: "Performing Arts" },
    { key: 6, label: "Filmmaking" },
    { key: 7, label: "Digital Arts" },
    { key: 8, label: "Photography" },
    { key: 9, label: "Architecture" },
    { key: 10, label: false },
    { key: 11, label: "Studying & Education" },
    { key: 12, label: "Career" },
    { key: 13, label: false },
    { key: 14, label: "Hobbies" },
    { key: 15, label: "Model Building" },
    { key: 16, label: "Collectibles" },
    { key: 17, label: "Toys" },
    { key: 18, label: "Crafting" },
    { key: 19, label: false },
    { key: 20, label: "Economics" },
    { key: 21, label: "Real Estate" },
    { key: 22, label: "Personal Finance" },
    { key: 23, label: "Stocks & Investing" },
    { key: 24, label: "Business News & Discussion" },
    { key: 25, label: "Deals & Marketplace" },
    { key: 26, label: "Startups & Entrepreneurship" },
    { key: 27, label: false },
    { key: 28, label: "Fashion & Beauty" },
    { key: 29, label: "Nails" },
    { key: 30, label: "Hair" },
    { key: 31, label: "Makeup" },
    { key: 32, label: "Fashion" },
    { key: 33, label: "Accessories & Jewelry" },
    { key: 34, label: "Beauty & Grooming" },
    { key: 35, label: "Weddings" },
    { key: 36, label: "Tattoos & Piercings" },
    { key: 37, label: "Skincare" },
    { key: 38, label: "Watches" },
    { key: 39, label: "Streetwear & Sneakers" },
    { key: 40, label: false },
    { key: 41, label: "Food & Drinks" },
    { key: 42, label: "Food & Recipes" },
    { key: 43, label: "Non-Alcoholic Beverages" },
    { key: 44, label: "Baking & Desserts" },
    { key: 45, label: "Barbecues & Grilling" },
    { key: 46, label: "Food industry & Restaurants" },
    { key: 47, label: "Vegetarian & Vegan Food" },
    { key: 48, label: "Alcoholic Beverages" },
    { key: 49, label: false },
    { key: 50, label: "Games" },
    { key: 51, label: "Gaming Consoles & Gear" },
    { key: 52, label: "Esports" },
    { key: 53, label: "Adventure Games" },
    { key: 54, label: "Gaming News & Discussion" },
    { key: 55, label: "Action Games" },
    { key: 56, label: "Strategy Games" },
    { key: 57, label: "Simulation Games" },
    { key: 58, label: "Role-Playing Games" },
    { key: 59, label: "Sports & Racing Games" },
    { key: 60, label: "Tabletop Games" },
    { key: 61, label: "Mobile Games" },
    { key: 62, label: "Other Games" },
    { key: 63, label: false },
    { key: 64, label: "DIY & Crafts" },
    { key: 65, label: "Home & Garden" },
    { key: 66, label: "Home Inspiration & Decor" },
    { key: 67, label: "House Plants" },
    { key: 68, label: "Gardening & Farming" },
    { key: 69, label: "Sustainable Living" },
    { key: 70, label: "Home Improvement" },
    { key: 71, label: false },
    { key: 72, label: "Internet Culture" },
    { key: 73, label: "Memes" },
    { key: 74, label: "Animals & Pets" },
    { key: 75, label: "Cringe & Facepalm" },
    { key: 76, label: "Reddit Meta" },
    { key: 77, label: "Amazing" },
    { key: 78, label: "Funny" },
    { key: 79, label: "Crazy & Shocking" },
    { key: 80, label: "Wholesome & Heartwarming" },
    { key: 81, label: "Interesting" },
    { key: 82, label: "Oddly Satisfying" },
    { key: 83, label: false },
    { key: 84, label: "Movies & TV" },
    { key: 85, label: "Comedy Movies & Series" },
    { key: 86, label: "Action Movies & Series" },
    { key: 87, label: "Fantasy Movies & Series" },
    { key: 88, label: "Documentary Movies & Series" },
    { key: 89, label: "Drama Movies & Series" },
    { key: 90, label: "Crime, Mystery, & Thriller Movies & Series" },
    { key: 91, label: "Animated Movies & Series" },
    { key: 92, label: "Sci-Fi Movies & Series" },
    { key: 93, label: "Romance Movies & Series" },
    { key: 94, label: "Reality TV" },
    { key: 95, label: "TV News & Discussion" },
    { key: 96, label: "Superhero Movies & Series" },
    { key: 97, label: "Horror Movies & Series" },
    { key: 98, label: "Movie News & Discussion" },
    { key: 99, label: false },
    { key: 100, label: "Music" },
    { key: 101, label: "Musical Instruments & Singing" },
    { key: 102, label: "Classical Music" },
    { key: 103, label: "Indie & Alternative Music" },
    { key: 104, label: "K-Pop" },
    { key: 105, label: "Music News & Discussion" },
    { key: 106, label: "Dance & Electronic Music" },
    { key: 107, label: "Country Music" },
    { key: 108, label: "Hip-Hop & Rap Music" },
    { key: 109, label: "Other Music Genres" },
    { key: 110, label: "Jazz Music" },
    { key: 111, label: "Rock Music" },
    { key: 112, label: "R&B Music" },
    { key: 113, label: "Pop Music" },
    { key: 114, label: "Metal Music" },
    { key: 115, label: "Music Production" },
    { key: 116, label: false },
    { key: 117, label: "Nature & Outdoors" },
    { key: 118, label: "Fishing" },
    { key: 119, label: "Camping & Hiking" },
    { key: 120, label: "Hunting" },
    { key: 121, label: "Nature & Wildlife" },
    { key: 122, label: "News & Politics" },
    { key: 123, label: false },
    { key: 124, label: "News" },
    { key: 125, label: "Activism" },
    { key: 126, label: "Politics" },
    { key: 127, label: false },
    { key: 128, label: "Places & Travel" },
    { key: 129, label: "Places in Africa" },
    { key: 130, label: "Places in Europe" },
    { key: 131, label: "Places in Australia & Oceania" },
    { key: 132, label: "Places in Asia" },
    { key: 133, label: "Places in South America" },
    { key: 134, label: "Places in North America" },
    { key: 135, label: "Places in the Middle East" },
    { key: 136, label: "Travel & Holiday" },
    { key: 137, label: false },
    { key: 138, label: "Pop Culture" },
    { key: 139, label: "Generations & Nostalgia" },
    { key: 140, label: "Creators & Influencers" },
    { key: 141, label: "Celebrities" },
    { key: 142, label: "Podcasts" },
    { key: 143, label: "Streamers" },
    { key: 144, label: "Tarot & Astrology" },
    { key: 145, label: false },
    { key: 146, label: "Q&As & Stories" },
    { key: 147, label: "Stories & Confessions" },
    { key: 148, label: "Q&As" },
    { key: 149, label: false },
    { key: 150, label: "Reading & Writing" },
    { key: 151, label: "Comics" },
    { key: 152, label: "Books & Literature" },
    { key: 153, label: "Writing" },
    { key: 154, label: false },
    { key: 155, label: "Sciences" },
    { key: 156, label: "Biological Sciences" },
    { key: 157, label: "Science News & Discussion" },
    { key: 158, label: false },
    { key: 159, label: "Engineering" },
    { key: 160, label: "Physics" },
    { key: 161, label: "Mathematics" },
    { key: 162, label: "Climate & Environment" },
    { key: 163, label: "Other Sciences" },
    { key: 164, label: "Psychology & Sociology" },
    { key: 165, label: "Geography" },
    { key: 166, label: "Data Science" },
    { key: 167, label: "Chemistry" },
    { key: 168, label: "Space & Astronomy" },
    { key: 169, label: false },
    { key: 170, label: "Paranormal & Unexplained" },
    { key: 171, label: "Weird & Unusual" },
    { key: 172, label: "True Crime" },
    { key: 173, label: "Creepy" },
    { key: 174, label: false },
    { key: 175, label: "Sports" },
    { key: 176, label: "Ice Hockey" },
    { key: 177, label: "College Sports" },
    { key: 178, label: "Basketball" },
    { key: 179, label: "Bikes & Cycling" },
    { key: 180, label: "Cricket" },
    { key: 181, label: "Baseball" },
    { key: 182, label: "Soccer" },
    { key: 183, label: "Rugby" },
    { key: 184, label: "Racket Sports" },
    { key: 185, label: "Motor Sports" },
    { key: 186, label: "Golf" },
    { key: 187, label: "Wrestling & Combat Sports" },
    { key: 188, label: "Football" },
    { key: 189, label: "Winter Sports" },
    { key: 190, label: "Water Sports" },
    { key: 191, label: "Sports News & Discussion" },
    { key: 192, label: "Other Sports" },
    { key: 193, label: false },
    { key: 194, label: "Technology" },
    { key: 195, label: "Consumer Electronics" },
    { key: 196, label: "DIY Electronics" },
    { key: 197, label: "Artificial Intelligence & Machine Learning" },
    { key: 198, label: "Computers & Hardware" },
    { key: 199, label: "Programming" },
    { key: 200, label: "Software & Apps" },
    { key: 201, label: "Virtual & Augmented Reality" },
    { key: 202, label: "3D Printing" },
    { key: 203, label: "Tech News & Discussion" },
    { key: 204, label: "Streaming Services" },
    { key: 205, label: false },
    { key: 206, label: "No Topic/Other Topic" },
    { key: 207, label: "Mature Topics" },
    { key: 208, label: "Adult Content" },
    { key: 209, label: false },
];

export default preDefinedTopics;