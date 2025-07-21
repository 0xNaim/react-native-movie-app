import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const Search = () => {
	const [searchQuery, setSearchQuery] = useState<string>("");

	const {
		data: movies,
		loading,
		error,
		refetch: loadMovies,
		reset: resetMovies
	} = useFetch(() => fetchMovies({ query: searchQuery }), { autoFetch: false });

	const handleSearch = (text: string) => {
		setSearchQuery(text);
	};

	useEffect(() => {
		// Debounce the search input to avoid too many requests
		const handler = setTimeout(() => {
			const fetchMovies = async () => {
				if (searchQuery.trim()) {
					await loadMovies();

					// If movies are found, update the search count
					if (movies?.length > 0) {
						await updateSearchCount(searchQuery, movies[0]);
					}
				} else {
					resetMovies();
				}
			};
			fetchMovies();
		}, 500);

		return () => {
			clearTimeout(handler);
		}; 
	}, [searchQuery, loadMovies, resetMovies]);

	return (
		<View className="flex-1 bg-primary">
			<Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode="cover" />
			<FlatList
				data={movies}
				renderItem={({ item }) => <MovieCard {...item} />}
				keyExtractor={(item) => item.id.toString()}
				className="px-5"
				numColumns={3}
				columnWrapperStyle={{
					justifyContent: "center",
					gap: 16,
					marginVertical: 16
				}}
				contentContainerStyle={{
					paddingBottom: 100
				}}
				ListHeaderComponent={
					<>
						<View className="w-full flex-row justify-center items-center mt-20">
							<Image source={icons.logo} className="w-12 h-10" />
						</View>

						<View className="my-5">
							<SearchBar
								placeholder="Search movies..."
								value={searchQuery}
								onChangeText={handleSearch}
							/>
						</View>

						{loading && <ActivityIndicator className="my-3" size="large" color="#0000FF" />}
						{error && <Text className="text-red-500 px-5 my-3">Error: {error?.message}</Text>}

						{!loading && !error && searchQuery.trim() && movies ? (
							movies?.length > 0 && (
								<Text className="text-xl text-white font-bold">
									Search Results for <Text className="text-accent">{searchQuery}</Text>
								</Text>
							)
						) : (
							<Text></Text>
						)}
					</>
				}
				ListEmptyComponent={
					<Text className="text-gray-500 text-center my-5">
						{!loading && !error && searchQuery.trim() ? "No movies found" : "Search for a movie"}
					</Text>
				}
			/>
		</View>
	);
};

export default Search;
