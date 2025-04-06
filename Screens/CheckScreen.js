import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
//נמצא בספר פרוייקט
const CheckScreen = () => {
  const [checkedItems, setCheckedItems] = useState({
    // Basic Items
    "קרש גב": false,
    "דפיברילטור": false,
    "חמצן קטן": false,
    "חמצן גדול": false,

    // תא גדול
    "מד לחץ דם": false,
    "פח מחטים": false,
    "סקשן": false,
    "אמבו גדול": false,
    "מסכה גודל 5": false,
    "מסכה גודל 2": false,
    "מסננים ויראלים": false,

    // תא אמצעי
    "אפיפן - תוקף": false,
    "גלוקומטר": false,
    "גלוקוג'ל": false,
    "סטיקים": false,
    "דוקרנים": false,
    "אספירין": false,
    "פדי גזה": false,
    "שקיות הקאה": false,
    "ערכת עירוי": false,
    "תחבושות אישיות": false,
    "תחבושות בינוניות": false,
    "משולשים": false,
    "חוסם עורקים": false,

    // תא קטן
    "אירווי כתום": false,
    "אירווי ירוק": false,
    "אירווי אדום": false,
    "אירווי לבן": false,
    "קטטר כחול": false,
    "קטטר אדום": false,

    // תיק אמבו ילדים
    "אפיפן ילדים": false,
    "מד לחץ דם ילדים": false,
    "אירווי תכלת": false,
    "אירווי שחור": false,
    "קטטר ירוק": false,
    "קטטר תכלת": false,
    "מפוח אמבו": false,
    "מסכת ילד": false,
    "מסכת תינוק": false,
    "שמיכת מילוט": false,

    // תיק חובש
    "תחבושות אישיות חובש": false,
    "משולשים חובש": false,
    "חוסם עורקים חובש": false,
    "תחבושות בינוניות חובש": false,
    "מיקרופור": false,
    "יוד": false,
    "פדי גזה חובש": false,
    "מלע״כ": false,
    "סד קיבוע": false,

    // תאים נוספים
    "ערכת לידה": false,
    "ערכת עירוי תאים": false,
    "שקיות הקאה תאים": false,
    "שקית קירור": false,
    "שקיות ניילון": false,
    "סדינים": false,
    "ווסטים זוהרים": false,
  });

  const [openCategories, setOpenCategories] = useState({});

  const categories = [
    {
      title: "בדיקות ראשוניות 🚑",
      items: [
        { label: "קרש גב (מתחת לספסל)", value: "קרש גב" },
        { label: "דפיברילטור - בדיקת תקינות, מגלח, מדבקות", value: "דפיברילטור - מדבקות" },
        { label: "חמצן קטן", value: "חמצן קטן" },
        { label: "חמצן גדול", value: "חמצן גדול" },
      ]
    },
    {
      title: "תיק אמבו- תא גדול 🎒",
      items: [
        { label: "מד לחץ דם - תקינות", value: "מד לחץ דם" },
        { label: "פח מחטים - לא נעול", value: "פח מחטים" },
        { label: "סקשן", value: "סקשן" },
        { label: "אמבו גדול", value: "אמבו גדול" },
        { label: "מסכה גודל 5", value: "מסכה גודל 5" },
        { label: "מסכה גודל 2", value: "מסכה גודל 2" },
        { label: "2 מסננים ויראלים", value: "מסננים ויראלים" },
      ]
    },
    {
      title: "תיק אמבו- תא אמצעי 💊",
      items: [
        { label: "אפיפן - בדיקת תוקף", value: "אפיפן - תוקף" },
        { label: "גלוקומטר", value: "גלוקומטר" },
        { label: "2 גלוקוג'ל בתוקף", value: "גלוקוג'ל" },
        { label: "6-10 סטיקים", value: "סטיקים" },
        { label: "6-10 דוקרנים", value: "דוקרנים" },
        { label: "מעל 5 אספירין", value: "אספירין" },
        { label: "מעל 5 פדי גזה", value: "פדי גזה" },
        { label: "2 שקיות הקאה", value: "שקיות הקאה" },
        { label: "ערכת עירוי בתוקף", value: "ערכת עירוי" },
        { label: "1-2 תחבושות אישיות", value: "תחבושות אישיות" },
        { label: "1-2 תחבושות בינוניות", value: "תחבושות בינוניות" },
        { label: "1-2 משולשים", value: "משולשים" },
        { label: "2-3 חוסם עורקים", value: "חוסם עורקים" }
      ]
    },
    {
      title: "תיק אמבו-תא קטן 🔧",
      items: [
        { label: "אירווי כתום", value: "אירווי כתום" },
        { label: "אירווי ירוק", value: "אירווי ירוק" },
        { label: "אירווי אדום", value: "אירווי אדום" },
        { label: "אירווי לבן", value: "אירווי לבן" },
        { label: "2 קטטר כחול", value: "קטטר כחול" },
        { label: "2 קטטר אדום", value: "קטטר אדום" }
      ]
    },
    {
      title: "תיק אמבו ילדים 👶",
      items: [
        { label: "אפיפן ילדים - בדיקת תוקף", value: "אפיפן ילדים" },
        { label: "מד לחץ דם ילדים - תקינות", value: "מד לחץ דם ילדים" },
        { label: "2 אירווי תכלת", value: "אירווי תכלת" },
        { label: "2 אירווי שחור", value: "אירווי שחור" },
        { label: "2 קטטר ירוק", value: "קטטר ירוק" },
        { label: "2 קטטר תכלת", value: "קטטר תכלת" },
        { label: "מפוח אמבו - תקינות", value: "מפוח אמבו" },
        { label: "2 מסכות - ילד ותינוק", value: "מסכת ילד" },
        { label: "שמיכת מילוט", value: "שמיכת מילוט" }
      ]
    },
    {
      title: "תיק חובש 🧳",
      items: [
        { label: "5 תחבושות אישיות", value: "תחבושות אישיות חובש" },
        { label: "5 משולשים", value: "משולשים חובש" },
        { label: "2 חוסם עורקים", value: "חוסם עורקים חובש" },
        { label: "2 תחבושות בינוניות", value: "תחבושות בינוניות חובש" },
        { label: "מיקרופור", value: "מיקרופור" },
        { label: "יוד", value: "יוד" },
        { label: "6-10 פדי גזה", value: "פדי גזה חובש" },
        { label: "מלע״כ", value: "מלע״כ" },
        { label: "סד קיבוע", value: "סד קיבוע" }
      ]
    },
    {
      title: "תאים נוספים 📦",
      items: [
        { label: "ערכת לידה בתוקף", value: "ערכת לידה" },
        { label: "ערכת עירוי בתוקף", value: "ערכת עירוי תאים" },
        { label: "שקיות הקאה", value: "שקיות הקאה תאים" },
        { label: "שקית קירור", value: "שקית קירור" },
        { label: "שקיות ניילון", value: "שקיות ניילון" },
        { label: "סדינים", value: "סדינים" },
        { label: "ווסטים זוהרים", value: "ווסטים זוהרים" }
      ]
    }
  ];

  const toggleCheck = (value) => {
    setCheckedItems(prev => ({
      ...prev,
      [value]: !prev[value]
    }));
  };

  const toggleCategory = (title) => {
    setOpenCategories(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>בדיקת אמבולנס</Text>
      <Text> </Text>
      {categories.map((category) => (
        <View key={category.title} style={styles.categoryContainer}>
          <TouchableOpacity onPress={() => toggleCategory(category.title)}>
            <Text style={styles.categoryTitle}>
              {category.title} {openCategories[category.title] ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>
          {openCategories[category.title] && category.items.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={styles.optionContainer}
              onPress={() => toggleCheck(item.value)}
            >
              <Text style={styles.optionLabel}>{item.label}</Text>
              <View style={[styles.checkbox, checkedItems[item.value] && styles.checked]} />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "right",
    marginVertical: 16,
    color: "#2c3e50",
    paddingHorizontal: 10,
    borderRightWidth: 4,
    borderRightColor: "#FFD700",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    ...Platform.select({
      ios: {
        fontFamily: "Avenir",
        shadowOpacity: 0.2,
      },
      android: {
        fontFamily: "Roboto",
        elevation: 4
      },
    }),
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    textAlign: "right",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  checked: {
    backgroundColor: "#FFD700",
    borderColor: "#FFD700",
  },
  optionLabel: {
    fontSize: 16,
    flex: 1,
    marginRight: 12,
    textAlign: 'center',
  },
});

export default CheckScreen;