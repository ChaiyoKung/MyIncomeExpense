import * as React from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { Button, TextInput } from "react-native-paper";
import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";

// global for all files
import global from "../global";

export default class LoginScreen extends React.Component {
  state = {
    email: "",
    password: "",
    user: null,
    isLoading: false,
  };

  componentDidMount() {
    this.onAuthStateChanged();
  }

  onAuthStateChanged() {
    this.showLoading();
    global.firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.props.navigation.replace("Home");
      } else {
        // No user is signed in.
        this.closeLoading();
        return;
      }
    });
  }

  showLoading() {
    this.setState({ isLoading: true });
  }

  closeLoading() {
    this.setState({ isLoading: false });
  }

  writeUsersTable(uid, displayName, email) {
    global.firebase
      .database()
      .ref()
      .child("users")
      .child(uid)
      .set({
        name: displayName,
        email: email,
      })
      .then(() => {
        console.log("write user success.");
      })
      .catch((error) => {
        console.log("write user unsuccess.\nDetails:", error);
      });
  }

  loginWithEmail() {
    let email = this.state.email;
    let password = this.state.password;
    if (email != "") {
      if (password != "") {
        this.showLoading();

        global.firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then((result) => {
            let user = result.user;
            let uid = user.uid;
            let displayName = user.displayName;
            let email = user.email;

            this.writeUsersTable(uid, displayName, email);
            this.props.navigation.replace("Home");
          })
          .catch((error) => {
            this.closeLoading();

            let errorCode = error.code;
            let errorMessage = error.message;
            alert(errorMessage);
          });
      } else {
        alert("Please enter your password.");
      }
    } else {
      alert("Please enter your email.");
    }
  }

  register_press() {
    this.props.navigation.navigate("Register");
  }

  async loginWithFacebook() {
    const firebase = global.firebase;
    let appID = "";

    try {
      await Facebook.initializeAsync(appID);
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"],
      });
      if (type === "success") {
        await firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        let result = await firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential);
        let user = await result.user;
        let uid = user.uid;
        let displayName = user.displayName;
        let email = user.email;

        this.writeUsersTable(uid, displayName, email);

        this.props.navigation.replace("Home");
      } else {
        // type === 'cancel'
        alert("Facebook login was cancel.");
      }
    } catch (error) {
      alert("Error! Can't login with Facebook.\nDetails: " + error);
    }
  }

  async loginWithGoogle() {
    const firebase = global.firebase;
    const config = {
      iosClientId: "",
      androidClientId: "",
      iosStandaloneAppClientId: "",
      androidStandaloneAppClientId: "",
      scopes: ["profile", "email"],
    };

    try {
      let { type, idToken, accessToken } = await Google.logInAsync(config);
      if (type == "success") {
        await firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const credential = firebase.auth.GoogleAuthProvider.credential(
          idToken,
          accessToken
        );
        let result = await firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential);
        let user = await result.user;
        let uid = user.uid;
        let displayName = user.displayName;
        let email = user.email;

        this.writeUsersTable(uid, displayName, email);

        this.props.navigation.replace("Home");
      } else {
        // type === 'cancel'
        alert("Google login was cancel.");
      }
    } catch (error) {
      alert("Error! Can't login with Google.\nDetails: " + error);
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={global.color.primary} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={[styles.row]}>
          <TextInput
            mode="outlined"
            label="Email"
            value={this.state.email}
            onChangeText={(text) => this.setState({ email: text })}
          />
          <TextInput
            mode="outlined"
            label="Password"
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={(text) => this.setState({ password: text })}
          />
        </View>
        <View
          style={[
            styles.row,
            styles.justity_content_between,
            styles.flex_row_reverse,
          ]}
        >
          <Button
            mode="contained"
            color={global.color.warning}
            onPress={() => this.loginWithEmail()}
          >
            Login
          </Button>
          <Button
            mode="contained"
            color={global.color.light}
            onPress={() => this.register_press()}
          >
            Register
          </Button>
        </View>
        <View style={[styles.row]}>
          <Button
            mode="contained"
            color={global.color.primary}
            onPress={() => this.loginWithFacebook()}
          >
            Login with Facebook
          </Button>
        </View>
        <View style={[styles.row]}>
          <Button
            mode="contained"
            color={global.color.success}
            onPress={() => this.loginWithGoogle()}
          >
            Login with Google
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.color.white,
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    marginBottom: 5,
  },
  justity_content_between: {
    justifyContent: "space-between",
  },
  flex_row_reverse: {
    flexDirection: "row-reverse",
  },
});
