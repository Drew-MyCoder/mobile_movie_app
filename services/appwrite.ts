// track the searches made by a user
import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
    .setPlatform('com.jsm.movieapp');


    // import { Client, Account } from 'react-native-appwrite';

    // const client = new Client()
    //     .setEndpoint('https://fra.cloud.appwrite.io/v1')
    //     .setProject('68256ed90009872cc7e1')
    //     .setPlatform('com.new');
    

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('searchTerm', query)
    ])

    if(result.documents.length > 0) {
        const exisitngMovie = result.documents[0];

        await database.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            exisitngMovie.$id,
            {
                count: exisitngMovie.count + 1
            }
        )
    } else {
        await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
            searchTerm: query,
            movie_id: movie.id,
            count: 1,
            title: movie.title,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        })
    }
} catch (error) {
    console.log(error);
    throw error;
}
    // console.log(result);
}