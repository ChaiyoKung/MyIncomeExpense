import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";

// global for all files
import global from "../global";
import { Button } from "react-native-paper";

export default class LoginScreen extends React.Component {
  state = {
    recordsData: [],
    user: null,
    isLoading: false,
    nowLists: [],
  };

  componentDidMount() {
    this.onAuthStateChanged();
  }

  onAuthStateChanged() {
    global.firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.setState({ user: user });
        let uid = user.uid;

        this.readListsTable(uid);
      } else {
        // No user is signed in.
        this.logout();
        this.props.navigation.replace("Login");
      }
    });
  }

  showLoading() {
    this.setState({ isLoading: true });
  }

  closeLoading() {
    this.setState({ isLoading: false });
  }

  getListName(listID) {
    if (this.state.nowLists.length != 0) {
      return this.state.nowLists[listID];
    }
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

  deleteRecordsTable() {
    Alert.alert("Delete your records", "Are you sure to delete your records?", [
      {
        text: "OK",
        onPress: () => {
          Alert.alert("Delete your records", "Sure? It can't restore.", [
            {
              text: "OK",
              onPress: () => {
                Alert.alert(
                  "Delete your records",
                  "So, Click OK and your records was delete.",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        if (this.state.user != null) {
                          let uid = this.state.user.uid;
                          global.firebase
                            .database()
                            .ref()
                            .child("records")
                            .child(uid)
                            .remove();
                          this.props.navigation.navigate("Home");
                        }
                      },
                    },
                    { text: "Cancel" },
                  ]
                );
              },
            },
            { text: "Cancel" },
          ]);
        },
      },
      { text: "Cancel" },
    ]);
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
        <ScrollView>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
              color={global.color.danger}
              onPress={() => this.deleteRecordsTable()}
            >
              Delete records
            </Button>
          </View>
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
              แสดงรายการที่บันทึกล่าสุดไม่เกิน 10 รายการ
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
});
