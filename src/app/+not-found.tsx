import { Redirect } from 'expo-router';

// Any unknown path (for example, opening the web preview at its own URL) goes to the start.
export default function NotFound() {
  return <Redirect href="/" />;
}
