//Puerto

process.env.PORT = process.env.PORT || 3000

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || "dev"

let urlDB;

if(process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/cafe"
}else {
    // urlDB = "mongodb+srv://ArlesYha:AFSxccI8nmemLgEj@cluster0.jarop.mongodb.net/cafe?retryWrites=true&w=majority"

    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB

// mongodb: //localhost:27017/cafe
// mongodb: "mongodb+srv://ArlesYha:AFSxccI8nmemLgEj@cluster0.jarop.mongodb.net/<dbname>?retryWrites=true&w=majority"
