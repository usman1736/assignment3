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

interface EmployeeFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  position: string;
  address: string;
}

export default function Index() {
  const [submitMessage, setSubmitMessage] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First name cannot be empty")
      .min(3, "First name has to be at least 3 characters"),
    lastName: Yup.string()
      .required("Last name cannot be empty")
      .min(3, "Last name has to be at least 3 characters"),
    position: Yup.string().required("Position cannot be empty"),
    phoneNumber: Yup.string()
      .required("Phone number cannot be empty")
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    address: Yup.string().required("Address cannot be empty"),
  });

  function submitForm(values: EmployeeFormValues) {
    console.log("Employee Value:", values);
    setSubmitMessage(!submitMessage);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Information Form</Text>
      <Formik<EmployeeFormValues>
        initialValues={{
          firstName: "",
          lastName: "",
          position: "",
          phoneNumber: "",
          address: "",
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
            <TextInput
              style={styles.inputFields}
              onBlur={handleBlur("firstName")}
              value={values.firstName}
              onChangeText={handleChange("firstName")}
              placeholder="First Name"
            />
            {errors.firstName && touched.firstName ? (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            ) : null}

            <TextInput
              style={styles.inputFields}
              onBlur={handleBlur("lastName")}
              value={values.lastName}
              onChangeText={handleChange("lastName")}
              placeholder="Last Name"
            />
            {errors.lastName && touched.lastName ? (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            ) : null}

            <TextInput
              style={styles.inputFields}
              onBlur={handleBlur("position")}
              value={values.position}
              onChangeText={handleChange("position")}
              placeholder="Position"
            />
            {errors.position && touched.position ? (
              <Text style={styles.errorText}>{errors.position}</Text>
            ) : null}

            <TextInput
              style={styles.inputFields}
              onBlur={handleBlur("phoneNumber")}
              value={values.phoneNumber}
              onChangeText={handleChange("phoneNumber")}
              placeholder="Phone Number"
            />
            {errors.phoneNumber && touched.phoneNumber ? (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            ) : null}

            <TextInput
              style={styles.inputFields}
              onBlur={handleBlur("address")}
              value={values.address}
              onChangeText={handleChange("address")}
              placeholder="Address"
            />
            {errors.address && touched.address ? (
              <Text style={styles.errorText}>{errors.address}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            {submitMessage ? (
              <Text style={styles.submitText}>Form Submitted Successfully</Text>
            ) : null}
          </>
        )}
      </Formik>
      <View style={styles.authenticationButtonsContainer}>
        <TouchableOpacity
          style={styles.authenticationButton}
          onPress={() => router.push("./sign-in")}
        >
          <Text style={styles.authenticationButtonText}>Sign-In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.authenticationButton}>
          <Text
            style={styles.authenticationButtonText}
            onPress={() => router.push("")}
          >
            Sign-Up
          </Text>
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
    textAlign: "left",
    width: "70%",
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
    justifyContent: "space-between",
    width: "70%",
    marginTop: 5,
  },
  authenticationButtonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  authenticationButton: {
    width: "48%",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "grey",
  },
});
