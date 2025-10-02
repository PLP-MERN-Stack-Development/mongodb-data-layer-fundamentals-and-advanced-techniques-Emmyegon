// 1.Find all books in a specific genre

const { MongoDBCollectionNamespace } = require("mongodb")

// Find all Fiction books
db.books.find({ "genre": "Fiction" })
//   or in mongodb
{ genre: "Fiction" }

// Find all Fantasy books
db.books.find({ "genre": "Fantasy" })

// Find all Dystopian books
db.books.find({ "genre": "Dystopian" })


// 2  - Find books published after a certain year

// Find books published after 1950
db.books.find({ "published_year": { $gt: 1950 } })

// or in mongodb
{ published_year: 1950 } 

// Find books published after 1900
db.books.find({ "published_year": { $gt: 1900 } })

// Find books published after 2000 (returns empty as all books are older)
db.books.find({ "published_year": { $gt: 2000 } })


//  3  - Find books by a specific author

// Find all books by George Orwell
db.books.find({ "author": "George Orwell" })

// or in MongoDB
{author:"George Orwell"}

// Find all books by J.R.R. Tolkien
db.books.find({ "author": "J.R.R. Tolkien" })

// Find all books by Jane Austen
db.books.find({ "author": "Jane Austen" })



//  4  - Update the price of a specific book

// Update the price of "The Great Gatsby" to $11.99
db.books.updateOne(
    { "title": "The Great Gatsby" },
    { $set: { "price": 11.99 } }
)



//  5  - Delete a book by its title

// Delete "Moby Dick" from the collection
db.books.deleteOne({ "title": "Moby Dick" })



// 1- Write a query to find books that are both in stock and published after 2010

db.books.find({
    "in_stock": true,
    "published_year": { $gt: 2010 }
})

// use  this in mongodb
// db.books.find({
//     "in_stock": true,
//     "published_year": { $gt: 1900 }
// }, {
//     "title": 1,
//     "author": 1,
//     "price": 1,
//     "_id": 0
// })
// 2- Use projection to return only the title, author, and price fields in your queries
db.books.find({
    "in_stock": true,
    "published_year": { $gt: 2010 }
}, {
    "title": 1,
    "author": 1,
    "price": 1,
    "_id": 0 
})
// 3- Implement sorting to display books by price (both ascending and descending)

// Sort by price ascending (cheapest first)
db.books.find({}, {
    "title": 1,
    "author": 1,
    "price": 1,
    "_id": 0
}).sort({ "price": 1 })

// Sort by price descending (most expensive first)
db.books.find({}, {
    "title": 1,
    "author": 1,
    "price": 1,
    "_id": 0
}).sort({ "price": -1 })


// 4- Use the `limit` and `skip` methods to implement pagination (5 books per page)
// Sort by price ascending (cheapest first)
db.books.find({}, {
    "title": 1,
    "author": 1,
    "price": 1,
    "_id": 0
}).sort({ "price": 1 })

// Sort by price descending (most expensive first)
db.books.find({}, {
    "title": 1,
    "author": 1,
    "price": 1,
    "_id": 0
}).sort({ "price": -1 })
    

// aggrigates
// Calculate average price by genre
db.books.aggregate([
    {
        $group: {
            _id: "$genre",
            averagePrice: { $avg: "$price" },
            totalBooks: { $sum: 1 },
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" }
        }
    },
    {
        $sort: { averagePrice: -1 }
    },
    {
        $project: {
            genre: "$_id",
            averagePrice: { $round: ["$averagePrice", 2] }, // Round to 2 decimal places
            totalBooks: 1,
            minPrice: 1,
            maxPrice: 1,
            _id: 0
        }
    }
])

// Find author with the most books
db.books.aggregate([
    {
        $group: {
            _id: "$author",
            bookCount: { $sum: 1 },
            books: { $push: "$title" }
        }
    },
    {
        $sort: { bookCount: -1 }
    },
    {
        $limit: 1  // Get only the top author
    },
    {
        $project: {
            author: "$_id",
            bookCount: 1,
            books: 1,
            _id: 0
        }
    }
])

                  // Indexes

// Create a single field index on title
db.books.createIndex({ "title": 1 })


// Create compound index on author and published_year (descending)
db.books.createIndex({ "author": 1, "published_year": -1 })


// Analyze compound query without index
db.books.find({ 
    "author": "George Orwell", 
    "published_year": { $gte: 1940 }
}).explain("executionStats")