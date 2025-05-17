// track the searches made by a user
import { Client, Databases, ID, Query } from "react-native-appwrite";
import { TMDB_CONFIG } from "./api";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('682574b30035858367b7')
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

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count'),
        ])
        return result.documents as unknown as TrendingMovie[];

    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails>  => {
    try {
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,{
            method: 'GET',
            headers: TMDB_CONFIG.header,
        });

        if(!response.ok) throw new Error('Failed to fetch movie details');

        const data = await response.json();
        return data;
    } catch(error){
        console.log(error);
        throw error;
    }
}