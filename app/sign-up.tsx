import { userSignUp } from "@/firebaase/authHelpers";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { saveUserProfile } from "@/firebaase/firestoreHelpers";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

export default function SignUp() {
  const router = useRouter();
  const [submitMessage, setSubmitMessage] = useState(false);
  const [error, setError] = useState(null);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name cannot be empty"),
    lastName: Yup.string().required("Last name cannot be empty"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email cannot be empty"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password cannot be empty"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password cannot be empty"),
  });

  // Submit Logic
  async function submitForm(values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    const { user, error } = await userSignUp(values.email, values.password);

    if (error || !user) {
      setError(error);
      return;
    }

    // Save profile to Firestore
    await saveUserProfile(user.uid, {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
    });

    // Go to homepage
    router.replace("/home");
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign-Up</Text>

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
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
            {/* First Name */}
            <TextInput
              style={styles.inputFields}
              placeholder="First Name"
              value={values.firstName}
              onChangeText={handleChange("firstName")}
              onBlur={handleBlur("firstName")}
            />
            {errors.firstName && touched.firstName ? (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            ) : null}

            {/* Last Name */}
            <TextInput
              style={styles.inputFields}
              placeholder="Last Name"
              value={values.lastName}
              onChangeText={handleChange("lastName")}
              onBlur={handleBlur("lastName")}
            />
            {errors.lastName && touched.lastName ? (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            ) : null}

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

            {/* Confirm Password */}
            <TextInput
              style={styles.inputFields}
              placeholder="Confirm Password"
              secureTextEntry
              value={values.confirmPassword}
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
            />
            {errors.confirmPassword && touched.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>

            {submitMessage ? (
              <Text style={styles.submitText}>Signed up successfully</Text>
            ) : null}
          </>
        )}
      </Formik>

      {/* Navigation Buttons */}
      <View style={styles.authenticationButtonsContainer}>
        <TouchableOpacity
          style={styles.authenticationButton}
          onPress={() => router.push("./sign-in")}
        >
          <Text style={styles.authenticationButtonText}>Go to Sign-In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
