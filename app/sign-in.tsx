import { userSignIn } from "@/firebaase/authHelpers";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

export default function SignIn() {
  const router = useRouter();
  const [submitMessage, setSubmitMessage] = useState(false);
  const [error, setError] = useState(null);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email cannot be empty"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password cannot be empty"),
  });

  // Submit Logic
  async function submitForm(values: { email: string; password: string }) {
    const { error } = await userSignIn(values.email, values.password);

    if (error) {
      setError(error);
      return;
    }
    router.replace("/home");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign-In</Text>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={submitForm}
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            {/* Email */}
            <TextInput
              style={styles.inputFields}
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            {errors.email && touched.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            {/* Password */}
            <TextInput
              style={styles.inputFields}
              placeholder="Password"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
            />
            {errors.password && touched.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            {submitMessage ? (
              <Text style={styles.submitText}>Signed in successfully</Text>
            ) : null}
          </>
        )}
      </Formik>

      {/* Navigation Buttons */}
      <View style={styles.authenticationButtonsContainer}>
        <TouchableOpacity
          style={styles.authenticationButton}
          onPress={() => router.push("./sign-up")}
        >
          <Text style={styles.authenticationButtonText}>Go to Sign-Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles EXACTLY matching Employee Form
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 30,
  },
  inputFields: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 8,
    color: "black",
    fontSize: 18,
    width: "70%",
    marginVertical: 10,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    width: "70%",
    textAlign: "left",
  },
  button: {
    marginVertical: 10,
    width: "70%",
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  submitText: {
    fontSize: 13,
    color: "green",
    width: "70%",
    textAlign: "left",
  },
  authenticationButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "70%",
    marginTop: 10,
  },
  authenticationButton: {
    width: "48%",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "grey",
  },
  authenticationButtonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
