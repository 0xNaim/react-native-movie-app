import { icons } from "@/constants/icons";
import React from "react";
import { Image, TextInput, View } from "react-native";

interface SearchBarProps {
	onPress?: () => void;
	placeholder: string;
	value?: string;
	onChangeText?: (text: string) => void;
}

const SearchBar = ({ onPress, placeholder, value, onChangeText }: SearchBarProps) => {
	return (
		<View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
			<Image source={icons.search} className="size-5" resizeMethod="auto" tintColor="#AB8BFF" />
			<TextInput
				className="flex-1 ml-2 text-white"
				placeholder={placeholder}
				placeholderTextColor="#A8B5DB"
				value={value}
				onPress={onPress}
				onChangeText={onChangeText}
			/>
		</View>
	);
};

export default SearchBar;
