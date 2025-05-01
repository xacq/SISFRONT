import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * The main entry point of the application.
 *
 * This component wraps the application navigator (`AppNavigator`) with a `SafeAreaProvider`,
 * ensuring that the app respects the safe area boundaries on devices with notches, rounded corners,
 * or other screen insets.
 *
 * @returns The root component of the application.
 */
export default function index() {
  return (
    <SafeAreaProvider>

    </SafeAreaProvider>
  );
}