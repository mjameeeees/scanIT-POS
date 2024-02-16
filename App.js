import { useFonts } from "expo-font";
import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import * as Font from "expo-font";
import Dashboard from "./screens/dashboard/dashboard";
import Scanner from "./screens/dashboard/scanner";
import Map from "./screens/dashboard/security";
import Scanner_Payment from "./screens/dashboard/scanner_payment";
import Low_stocks from "./screens/dashboard/low_stocks";
import Expired_products from "./screens/dashboard/expired_products";
import VoidTransactionDetails from "./screens/dashboard/voids";
import Inventory from "./screens/inventory/inventory";
import InsertProducts from "./screens/components/insertProducts";
import NewProductSnacks from "./screens/inventory/newproduct_snacks";
import Salestracker from "./screens/salestracker/salestracker";
import Snacks from "./screens/inventory/snacks";
import Others from "./screens/inventory/others";
import Beverages from "./screens/inventory/beverages";
import Receipt from "./screens/components/ScannerComponents/receipt";
import DailyTracker from "./screens/salestracker/salestracker_daily";
import MultipleProducts from "./screens/inventory/multiple_products";
import MonthlyTracker from "./screens/salestracker/salestracker_monthly";
import Transaction from "./screens/salestracker/salestracker_transaction";
import AllRecords from "./screens/salestracker/salestracker_daily _allrecords";
import MonthlyProfit from "./screens/salestracker/salestracker_profit";
import TransactionDetails from "./screens/salestracker/salestracker_transaction_details";
import DailyGraph from "./screens/salestracker/salestracker_daily_graph";
import WeeklyGraph from "./screens/salestracker/salestracker_weekly_graph";
import MonthlyGraph from "./screens/salestracker/salestracker_monthly_graph";
import OverallGraph from "./screens/salestracker/salestracker_overall_graph";
import Help from "./screens/help";
import NewProductOthers from "./screens/inventory/newproduct_others";
import NewProductBeverages from "./screens/inventory/newproduct_beverages";
import BestSeller from "./screens/dashboard/best_seller";
import Archive from "./screens/dashboard/archive";

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

const App = ({ navigation }) => {

  useEffect(() => {
    // Change the StatusBar color when the component mounts
    StatusBar.setBackgroundColor('#011936'); // Set your desired color here
    StatusBar.setBarStyle('light-content'); // Set text color to light
  }, []);



  const [fontsLoaded, fontError] = useFonts({
    DMSansBold: require("./assets/fonts/DMSans-Bold.ttf"),
    DMSansRegular: require("./assets/fonts/DMSans-Regular.ttf"),
    DMSansMedium: require("./assets/fonts/DMSans-Medium.ttf"),
    DMSansLight: require("./assets/fonts/DMSansLight.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaView
    onLayout={onLayoutRootView}>
      <View
        style={{ height: "100%", width: "100%"}}
      >
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName="Dashboard"
          >
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Inventory" component={Inventory} />
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen name="Archive" component={Archive} />
            <Stack.Screen name="Salestracker" component={Salestracker} />
            <Stack.Screen name="Help" component={Help} />
            <Stack.Screen name="Low_stocks" component={Low_stocks} />
            <Stack.Screen name="BestSeller" component={BestSeller} />
            <Stack.Screen
              name="Expired_products"
              component={Expired_products}
            />
            <Stack.Screen
              name="VoidTransactionDetails"
              component={VoidTransactionDetails}
            />
            <Stack.Screen name="Scanner" component={Scanner} />
            <Stack.Screen name="Scanner_Payment" component={Scanner_Payment} />
            <Stack.Screen name="Receipt" component={Receipt} />
            <Stack.Screen name="Snacks" component={Snacks} />
            <Stack.Screen name="Beverages" component={Beverages} />
            <Stack.Screen
              name="InsertProducts"
              component={InsertProducts}/>
            <Stack.Screen
              name="NewProductSnacks"
              component={NewProductSnacks}/>
            <Stack.Screen
              name="NewProductBeverages"
              component={NewProductBeverages}/>
            <Stack.Screen
              name="NewProductOthers"
              component={NewProductOthers}/>
            <Stack.Screen
              name="MultipleProducts"
              component={MultipleProducts}/>
            <Stack.Screen name="MonthlyProfit" component={MonthlyProfit} />
            <Stack.Screen name="DailyTracker" component={DailyTracker} />
            <Stack.Screen name="MonthlyTracker" component={MonthlyTracker} />
            <Stack.Screen name="Transaction" component={Transaction} />
            <Stack.Screen
              name="TransactionDetails"
              component={TransactionDetails}/>
            <Stack.Screen name="DailyGraph" component={DailyGraph} />
            <Stack.Screen name="WeeklyGraph" component={WeeklyGraph} />
            <Stack.Screen name="MonthlyGraph" component={MonthlyGraph} />
            <Stack.Screen name="OverallGraph" component={OverallGraph} />
            <Stack.Screen name="Others" component={Others} />
            <Stack.Screen name="AllRecords" component={AllRecords} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
