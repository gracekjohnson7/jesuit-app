import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

// This is the iPhone-only version of the IconSymbol component.
// On iOS, it uses Apple's native SF Symbols directly instead of Material Icons,
// which gives the sharpest and most native-looking icons on iPhone.
// React Native automatically loads this file instead of icon-symbol.tsx when running on iOS.
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    // SymbolView renders the native SF Symbol icon from Apple's icon library.
    // resizeMode="scaleAspectFit" keeps the icon proportional as the size changes.
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
