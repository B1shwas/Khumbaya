import { Image, Text, View } from "react-native";

interface AvatarProps {
  name: string;
  uri?: string;
  size?: number;
  className?: string;
}

export const Avatar = ({
  name,
  uri,
  size = 80,
  className = "",
}: AvatarProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (uri) {
    return <Image source={{ uri }} style={avatarStyle} className={className} />;
  }

  return (
    <View
      style={avatarStyle}
      className={`bg-pink-600 items-center justify-center ${className}`}
    >
      <Text
        className="text-white font-semibold"
        style={{ fontSize: size * 0.35 }}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
};
