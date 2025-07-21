import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
	.setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
	.setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
	try {
		// Check if a record of that search has already been stored
		const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
			Query.equal("searchTerm", query)
		]);

		if (result?.documents?.length > 0) {
			// If a record exists, update the count
			const existingMovie = result.documents[0];
			await database.updateDocument(DATABASE_ID, COLLECTION_ID, existingMovie.$id, {
				count: existingMovie.count + 1
			});
		} else {
			// If no record exists, create a new one
			await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
				searchTerm: query,
				count: 1,
				movie_id: movie?.id,
				title: movie?.title,
				poster_url: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`
			});
		}
	} catch (error) {
		console.error("Error updating the metrics:", error);
		throw error;
	}
};
