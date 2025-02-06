import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-paper";

// global for all files
import global from "../global";

export default class HomeScreen extends React.Component {
  state = {
    todayExpense: 0,
    recordsData: [],
    user: null,
    isLoading: false,
    nowLists: [],
    nowBalance: 0,
  };

  componentDidMount() {
    this.onAuthStateChanged();
  }

  showLoading() {
    this.setState({ isLoading: true });
  }

  closeLoading() {
    this.setState({ isLoading: false });
  }

  logout() {
    this.showLoading();

    global.firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        this.props.navigation.replace("Login");
      })
      .catch((error) => {
        // An error happened.
        this.closeLoading();
        alert(error);
      });
  }

  onAuthStateChanged() {
    global.firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.setState({ user: user });
        let uid = user.uid;

        // this.readRecordsTable(uid);
        this.readListsTable(uid);
        this.readTodayUseMoney(uid);
        this.readLastBalance(uid);
      } else {
        // No user is signed in.
        this.logout();
        this.props.navigation.replace("Login");
      }
    });
  }

  readLastBalance(uid) {
    global.firebase
      .database()
      .ref()
      .child("records")
      .child(uid)
      .limitToLast(1)
      .on("value", (snapshot) => {
        let records = snapshot.val();
        for (const key in records) {
          if (records.hasOwnProperty(key)) {
            const lastBalance = records[key].balance;
            this.setState({ nowBalance: lastBalance });
          }
        }
      });
  }

  readListsTable(uid) {
    global.firebase
      .database()
      .ref()
      .child("lists")
      .on("value", (snapshot) => {
        let lists = snapshot.val();
        let box = [];
        for (const key in lists) {
          if (lists.hasOwnProperty(key)) {
            let listName = lists[key].name;
            box.push(listName);
          }
        }
        this.setState({ nowLists: box });
        this.readRecordsTable(uid);
      });
  }

  readRecordsTable(uid) {
    global.firebase
      .database()
      .ref()
      .child("records")
      .child(uid)
      .limitToLast(10)
      .on("value", (snapshot) => {
        let records = snapshot.val();
        let box = [];
        for (const key in records) {
          if (records.hasOwnProperty(key)) {
            const record = records[key];
            box.push(record);
          }
        }
        this.setState({ recordsData: box });
      });
  }

  readTodayUseMoney(uid) {
    let today = this.getDateNow();

    global.firebase
      .database()
      .ref()
      .child("records")
      .child(uid)
      .orderByChild("date")
      .equalTo(today)
      .on("value", (snapshot) => {
        let data = snapshot.val();
        let sum = 0;
        for (let key in data) {
          sum += data[key].expense;
        }
        this.setState({ todayExpense: sum });
      });
  }

  getListName(listID) {
    if (this.state.nowLists.length != 0) {
      return this.state.nowLists[listID];
    }
  }

  renderRecordsTable(item) {
    return (
      <View style={[styles.tbody]}>
        <Text style={styles.td}>{item.date}</Text>
        <Text style={styles.td}>{this.getListName(item.listID)}</Text>
        <Text style={styles.td}>{item.income}</Text>
        <Text style={styles.td}>{item.expense}</Text>
        <Text style={styles.td}>{item.balance}</Text>
      </View>
    );
  }

  add_press() {
    this.props.navigation.navigate("Add");
  }

  getDateNow() {
    let date =
      new Date().getDate() +
      "/" +
      (new Date().getMonth() + 1) +
      "/" +
      new Date().getFullYear();

    return date;
  }

  showUser() {
    if (this.state.user != null) {
      let uName = this.state.user.displayName;

      return (
        <View style={[styles.userBox]}>
          <Text style={[styles.userDisplayName]}>{uName}</Text>
          <Button color={global.color.danger} onPress={() => this.logout()}>
            Logout
          </Button>
        </View>
      );
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
        {this.showUser()}
        <View
          style={[
            styles.row,
            {
              justifyContent: "center",
              flexDirection: "row",
              marginTop: 3,
              flexWrap: "wrap",
            },
          ]}
        >
          <Text style={[styles.bigText]}>วันนี้ใช้เงินไป</Text>
          <Text style={[styles.todayExpenseNumber, styles.bigText]}>
            {this.state.todayExpense}
          </Text>
          <Text style={[styles.bigText]}>บาท</Text>
        </View>
        <View style={styles.row}>
          <Button
            mode="contained"
            color={global.color.warning}
            onPress={() => this.add_press()}
          >
            Add
          </Button>
        </View>
        <View
          style={[
            styles.row,
            {
              justifyContent: "center",
              flexDirection: "row",
              marginTop: 3,
              flexWrap: "wrap",
            },
          ]}
        >
          <Text style={[styles.plusText]}>ตอนนี้เหลือเงิน</Text>
          <Text style={[styles.plusText, styles.nowBalanceText]}>
            {this.state.nowBalance}
          </Text>
          <Text style={[styles.plusText]}>บาท</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Button
            color={global.color.primary}
            onPress={() => this.props.navigation.navigate("ViewRecords")}
          >
            View all
          </Button>
        </View>
        <ScrollView>
          <View style={[styles.thead]}>
            <Text style={[styles.th]}>ว/ด/ป</Text>
            <Text style={[styles.th]}>รายการ</Text>
            <Text style={[styles.th]}>รายรับ</Text>
            <Text style={[styles.th]}>รายจ่าย</Text>
            <Text style={[styles.th]}>ลงเหลือ</Text>
          </View>
          <FlatList
            data={this.state.recordsData}
            renderItem={({ item }) => this.renderRecordsTable(item)}
            style={{ marginBottom: 3 }}
          />
          <View>
            <Text style={{ color: "#6c757e" }}>
              แสดงรายการที่บันทึกล่าสุดและรายการย้อนหลังไม่เกิน 10 รายการ
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.color.white,
    padding: 8,
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    marginBottom: 10,
  },
  bigText: {
    fontSize: 22,
  },
  thead: {
    flexDirection: "row",
    borderBottomColor: "#eeeeee",
    borderTopColor: "#eeeeee",
    borderTopWidth: 1,
    borderBottomWidth: 2,
  },
  tbody: {
    flexDirection: "row",
    borderBottomColor: "#eeeeee",
    borderBottomWidth: 1,
  },
  th: {
    flex: 1,
    fontWeight: "bold",
    padding: 2,
  },
  td: {
    flex: 1,
    padding: 2,
  },
  userBox: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  userDisplayName: {
    fontWeight: "bold",
    color: global.color.primary,
    fontSize: 16,
  },
  todayExpenseNumber: {
    marginHorizontal: 5,
    fontWeight: "bold",
    color: global.color.primary,
  },
  plusText: {
    fontSize: 20,
  },
  nowBalanceText: {
    marginHorizontal: 5,
    color: global.color.warning,
    fontWeight: "bold",
  },
});
