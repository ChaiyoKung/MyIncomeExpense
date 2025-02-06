import * as React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Button, TextInput } from "react-native-paper";

// global for all files
import global from "../global";

export default class RegisterScreen extends React.Component {
  state = {
    displayName: "",
    email: "",
    pass: "",
    confPass: "",
    isLoading: false,
  };

  writeUsersTable(uid, name, email) {
    global.firebase.database().ref().child("users").child(uid).set({
      name: name,
      email: email,
    });
  }

  showLoading() {
    this.setState({ isLoading: true });
  }

  closeLoading() {
    this.setState({ isLoading: false });
  }

  register() {
    this.showLoading();

    let displayName = this.state.displayName;
    let email = this.state.email;
    let pass = this.state.pass;
    let confPass = this.state.confPass;

    if (email != "") {
      if (pass != "" && pass.length >= 6) {
        if (pass == confPass) {
          global.firebase
            .auth()
            .createUserWithEmailAndPassword(email, pass)
            .then(() => {
              let nowUser = global.firebase.auth().currentUser;
              nowUser
                .updateProfile({
                  displayName: displayName,
                })
                .then(() => {
                  this.writeUsersTable(
                    nowUser.uid,
                    nowUser.displayName,
                    nowUser.email
                  );
                  this.logout();
                })
                .catch((error) => {
                  this.closeLoading();
                  // Handle Errors here.
                  let errorCode = error.code;
                  let errorMessage = error.message;
                  alert(errorMessage);
                });
            })
            .catch((error) => {
              this.closeLoading();
              // Handle Errors here.
              let errorCode = error.code;
              let errorMessage = error.message;
              alert(errorMessage);
            });
        } else {
          this.closeLoading();
          alert("Confirm password must equal password.");
        }
      } else {
        this.closeLoading();
        alert("Please enter password.");
      }
    } else {
      this.closeLoading();
      alert("Please enter email.");
    }
  }

  logout() {
    global.firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        alert("Register success.");
        this.props.navigation.navigate("Login");
      })
      .catch((error) => {
        // An error happened.
        this.closeLoading();
        alert(error);
      });
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
            label="Display name"
            placeholder="e.g. David"
            value={this.state.displayName}
            onChangeText={(text) => this.setState({ displayName: text })}
          />
          <TextInput
            mode="outlined"
            label="Email"
            value={this.state.email}
            onChangeText={(text) => this.setState({ email: text })}
          />
          <TextInput
            mode="outlined"
            label="Password"
            placeholder="Must be greater or equal than 6 characters."
            secureTextEntry={true}
            value={this.state.pass}
            onChangeText={(text) => this.setState({ pass: text })}
          />
          <TextInput
            mode="outlined"
            label="Confirm password"
            secureTextEntry={true}
            value={this.state.confPass}
            onChangeText={(text) => this.setState({ confPass: text })}
          />
        </View>
        <View style={[styles.row]}>
          <Button
            mode="contained"
            color={global.color.warning}
            onPress={() => this.register()}
          >
            Register
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
  row: {
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
