import { Pressable, Text, View } from "react-native";

export default function Profile(){
    return <View>
        <Pressable onPress={() => {
            const storageKey = "auth_user";
            localStorage.removeItem(storageKey);
            window.location.reload();
        }
        }>
            <View>
                <Text>Logout Bro</Text>
                </View>
            </Pressable>
    </View>;
}