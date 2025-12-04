// app/home.tsx
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "@/firebaase/config";
import { getUserProfile } from "@/firebaase/firestoreHelpers";
import { userSignOut } from "@/firebaase/authHelpers";

type UserProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export default function Home() {
  const router = useRouter();

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth changes and load profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setFirebaseUser(null);
        setProfile(null);
        setLoading(false);
        // no user → go to sign-in
        router.replace("/sign-in");
        return;
      }

      setFirebaseUser(user);
      setLoading(true);

      const { data, error } = await getUserProfile(user.uid);

      if (error) {
        setError(error);
        setProfile(null);
      } else {
        setError(null);
        setProfile(data as UserProfile);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function handleSignOut() {
    const { error } = await userSignOut();
    if (!error) {
      router.replace("/sign-in");
    } else {
      setError(error);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!firebaseUser) {
    // While redirecting to sign-in
    return (
      <View style={styles.container}>
        <Text>Redirecting to Sign-In...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {profile ? (
        <View style={styles.card}>
          <Text style={styles.label}>First Name:</Text>
          <Text style={styles.value}>{profile.firstName}</Text>

          <Text style={styles.label}>Last Name:</Text>
          <Text style={styles.value}>{profile.lastName}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>
            {profile.email || firebaseUser.email}
          </Text>
        </View>
      ) : (
        <Text>No profile data found for this user.</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    width: "100%",
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    width: "80%",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    width: "80%",
    textAlign: "left",
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    width: "80%",
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
