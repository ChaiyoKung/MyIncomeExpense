import * as React from "react";
import { View, StyleSheet, Platform, Text } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

import global from "../global";

export default class AddScreen extends React.Component {
  state = {
    lastBalance: 0,
    listID: null,
    listValues: "",
    listColor: {
      list0: "#d6f5b9",
      list1: global.color.white,
      list2: global.color.white,
      list3: global.color.white,
      list4: global.color.white,
      list5: global.color.white,
      list6: global.color.white,
      list7: global.color.white,
      list8: global.color.white,
      list9: global.color.white,
      list10: global.color.white,
    },
    listsData: [],
    user: null,
    date: Date.now(),
    mode: "date",
    show: false,
  };

  componentDidMount() {
    this.onAuthStateChanged();
  }

  onAuthStateChanged() {
    global.firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.setState({ user: user });
      } else {
        // No user is signed in.
        this.logout();
        this.props.navigation.replace("Login");
      }
    });
  }

  listColor(listID) {
    if (listID == 0) {
      this.setState({
        listColor: {
          list0: global.color.warning,
          list1: global.color.white,
          list2: global.color.white,
          list3: global.color.white,
          list4: global.color.white,
          list5: global.color.white,
          list6: global.color.white,
          list7: global.color.white,
          list8: global.color.white,
          list9: global.color.white,
          list10: global.color.white,
        },
      });
    } else if (listID == 1) {
      this.setState({
        listColor: {
          list0: global.color.white,
          list1: global.color.warning,
          list2: global.color.white,
          list3: global.color.white,
          list4: global.color.white,
          list5: global.color.white,
          list6: global.color.white,
          list7: global.color.white,
          list8: global.color.white,
          list9: global.color.white,
          list10: global.color.white,
        },
      });
    } else if (listID == 2) {
      this.setState({
        listColor: {
          list0: global.color.white,
          list1: global.color.white,
          list2: global.color.warning,
          list3: global.color.white,
          list4: global.color.white,
          list5: global.color.white,
          list6: global.color.white,
          list7: global.color.white,
          list8: global.color.white,
          list9: global.color.white,
          list10: global.color.white,
        },
      });
    } else if (listID == 3) {
      this.setState({
        listColor: {
          list0: global.color.white,
          list1: global.color.white,
          list2: global.color.white,
          list3: global.color.warning,
          list4: global.color.white,
          list5: global.color.white,
          list6: global.color.white,
          list7: global.color.white,
          list8: global.color.white,
          list9: global.color.white,
          list10: global.color.white,
        },
      });
    } else if (listID == 4) {
      this.setState({
        listColor: {
          list0: global.color.white,
          list1: global.color.white,
          list2: global.color.white,
          list3: global.color.white,
          list4: global.color.warning,
          list5: global.color.white,
          list6: global.color.white,
          list7: global.color.white,
          list8: global.color.white,
          list9: global.color.white,
          list10: global.color.white,
        },
      });
    } else if (listID == 5) {
      this.setState({
        listColor: {
          list0: global.color.white,
          list1: global.color.white,
          list2: global.color.white,
          list3: global.color.white,
          list4: global.color.white,
          list5: global.color.warning,
          list6: global.color.white,
          list7: global.color.white,
          list8: global.color.white,
          list9: global.color.white,
          list10: global.color.white,
        },
      });
    } else if (listID == 6) {
      this.setState({
        listColor: {
          list0: global.color.white,
          list1: global.color.white,
          list2: global.color.white,
          list3: global.color.white,
          list4: global.color.white,
          list5: global.color.white,
          list6: global.color.warning,
          list7: global.color.white,
          list8: global.color.white,
          list9: global.color.white,
          list10: global.color.white,
        },
      });
    } else if (listID == 7) {
      this.setState({
        listColor: {
          list0: global.color.white,
          list1: global.color.white,
          list2: global.color.white,
          list3: global.color.white,
          list4: global.color.white,
          list5: global.color.white,
          list6: global.color.white,
          list7: global.color.warning,
          list8: global.color.white,
          list9: global.color.white,
          list10: global.color.white,
        },
      });
    } else if (listID == 8) {
      this.setState({
        listColor: {
          list0: global.color.white,
          list1: global.color.white,
          list2: global.color.white,
          list3: global.color.white,
          list4: global.color.white,
          list5: global.color.white,
          list6: global.color.white,
          list7: global.color.white,
          list8: global.color.warning,
          list9: global.color.white,
          list10: global.color.white,
        },
      });
    } else if (listID == 9) {
      this.setState({
        listColor: {
          list0: global.color.white,
          list1: global.color.white,
          list2: global.color.white,
          list3: global.color.white,
          list4: global.color.white,
          list5: global.color.white,
          list6: global.color.white,
          list7: global.color.white,
          list8: global.color.white,
          list9: global.color.warning,
          list10: global.color.white,
        },
      });
    } else if (listID == 10) {
      this.setState({
        listColor: {
          list0: global.color.white,
          list1: global.color.white,
          list2: global.color.white,
          list3: global.color.white,
          list4: global.color.white,
          list5: global.color.white,
          list6: global.color.white,
          list7: global.color.white,
          list8: global.color.white,
          list9: global.color.white,
          list10: global.color.warning,
        },
      });
    }
  }

  listPress(listID) {
    this.setState({ listID: listID });
    this.listColor(listID);
  }

  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date;
    this.setState({
      show: Platform.OS === "ios",
      date: currentDate,
    });
  };

  showDatepicker() {
    this.setState({ show: true });
  }

  getDateFormatted(intDate) {
    const date = new Date(intDate);
    const day = date.getDate();
    const mouth = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${mouth}/${year}`;
  }

  getLastBalance() {
    let uid = this.state.user.uid;

    global.firebase
      .database()
      .ref()
      .child("records")
      .child(uid)
      .limitToLast(1)
      .on("value", (snapshot) => {
        let values = snapshot.val();
        if (values != null) {
          for (let value in values) {
            this.setState({ lastBalance: values[value].balance });
          }
        } else {
          this.setState({ lastBalance: 0 });
        }
      });
  }

  add() {
    let uid = this.state.user.uid;

    if (this.state.listID != null) {
      if (this.state.listValues != "") {
        if (parseFloat(this.state.listValues) >= 0) {
          let income = 0;
          let expense = 0;
          if (this.state.listID == 0) {
            income = parseFloat(this.state.listValues);
          } else {
            expense = parseFloat(this.state.listValues);
          }
          global.firebase
            .database()
            .ref()
            .child("records")
            .child(uid)
            .child(Date.now())
            .set(
              {
                date: this.getDateFormatted(this.state.date),
                listID: parseInt(this.state.listID),
                income: income,
                expense: expense,
                balance: this.state.lastBalance + income - expense,
              },
              (error) => {
                if (!error) {
                  this.props.navigation.navigate("Home");
                } else {
                  alert("Error\nDetails: " + error);
                }
              }
            );
        } else {
          alert("Lists values much greater than 0");
        }
      } else {
        alert("Please input list values.");
      }
    } else {
      alert("Please choose a list.");
    }
  }

  showDate() {
    if (this.state.date) {
      return (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {this.getDateFormatted(this.state.date)}
          </Text>
          <IconButton
            icon="calendar"
            color={global.color.primary}
            size={20}
            onPress={() => this.showDatepicker()}
          />
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.showDate()}
        <View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Button
                mode="contained"
                color={this.state.listColor.list1}
                onPress={() => this.listPress(1)}
              >
                ข้าวเช้า
              </Button>
            </View>
            <View style={styles.col}>
              <Button
                mode="contained"
                color={this.state.listColor.list2}
                onPress={() => this.listPress(2)}
              >
                ข้าวเที่ยง
              </Button>
            </View>
            <View style={styles.col}>
              <Button
                mode="contained"
                color={this.state.listColor.list3}
                onPress={() => this.listPress(3)}
              >
                ข้าวเย็น
              </Button>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Button
                mode="contained"
                color={this.state.listColor.list4}
                onPress={() => this.listPress(4)}
              >
                เครื่องดื่ม
              </Button>
            </View>
            <View style={styles.col}>
              <Button
                mode="contained"
                color={this.state.listColor.list5}
                onPress={() => this.listPress(5)}
              >
                ขนม
              </Button>
            </View>
            <View style={styles.col}>
              <Button
                mode="contained"
                color={this.state.listColor.list6}
                onPress={() => this.listPress(6)}
              >
                ของใช้
              </Button>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Button
                mode="contained"
                color={this.state.listColor.list7}
                onPress={() => this.listPress(7)}
              >
                ของเล่น
              </Button>
            </View>
            <View style={styles.col}>
              <Button
                mode="contained"
                color={this.state.listColor.list8}
                onPress={() => this.listPress(8)}
              >
                ซักผ้า
              </Button>
            </View>
            <View style={styles.col}>
              <Button
                mode="contained"
                color={this.state.listColor.list9}
                onPress={() => this.listPress(9)}
              >
                เติมน้ำมัน
              </Button>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Button
                mode="contained"
                color={this.state.listColor.list0}
                onPress={() => this.listPress(0)}
              >
                ได้เงิน
              </Button>
            </View>
            <View style={styles.col}>
              <Button
                mode="contained"
                color={this.state.listColor.list10}
                onPress={() => this.listPress(10)}
              >
                อื่นๆ
              </Button>
            </View>
          </View>
        </View>

        <View style={{ marginBottom: 10 }}>
          <TextInput
            placeholder="e.g. 1100"
            mode="outlined"
            label="Amount"
            value={this.state.listValues}
            onChangeText={(text) => this.setState({ listValues: text })}
            keyboardType="numeric"
            onFocus={() => this.getLastBalance()}
          />
        </View>

        <View>
          <Button
            mode="contained"
            color={global.color.primary}
            onPress={() => this.add()}
          >
            Add
          </Button>
        </View>
        {this.state.show && (
          <DateTimePicker
            value={this.state.date}
            mode={this.state.mode}
            is24Hour={true}
            display="default"
            onChange={this.onChange}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.color.light,
    padding: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 2,
  },
  col: {
    flex: 1,
  },
  dateContainer: {
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    borderBottomColor: global.color.primary,
    borderBottomWidth: 2,
  },
});
