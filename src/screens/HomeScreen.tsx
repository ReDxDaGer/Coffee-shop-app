import React, { useRef, useState } from 'react'
import { Dimensions, FlatList, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useStore } from '../store/store'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import CoffeeCard from '../components/CoffeeCard';

const getCategoriesFromData = (data: any) => {
  let temp: any = {};
  for (let i = 0; i < data.length; i++) {
    if (temp[data[i].name] == undefined) {
      temp[data[i].name] = 1;
    } else {
      temp[data[i].name]++;
    }
  }
  let categories = Object.keys(temp);
  categories.unshift('All');
  return categories;
};
const getCoffeeList = (category: string, data: any) => {
  if (category == 'All') {
    return data;
  } else {
    let coffeelist = data.filter((item: any) => item.name == category);
    return coffeelist;
  }
};


const HomeScreen = ({navigation}:any) => {
  const CoffeeList = useStore((state:any) => state.CoffeeList)
  const BeanList = useStore((state:any)=> state.BeansList)

  const [categories, setCategories] = useState(
    getCategoriesFromData(CoffeeList),
  );
  const [searchText, setSearchText] = useState('');
  const [categoryIndex, setCategoryIndex] = useState({
    index: 0,
    category: categories[0],
  });
  const [sortedCoffee, setSortedCoffee] = useState(
    getCoffeeList(categoryIndex.category, CoffeeList),
  );
  const  tabBarHeight= useBottomTabBarHeight();
  const ListRef: any = useRef<FlatList>();

  const searchCoffee = (search:any) => {
    if(search != ''){
      ListRef?.current?.scrollToOffset({
        animate: true,
        offset: 0
      });
      setCategoryIndex({index: 0,category:categories[0]})
      setSortedCoffee([
        ...CoffeeList.filter((item:any) => 
          item.name.toLowerCase().includes(search.toLowerCase())
      ),]
      );
    }
  }

  const resetSearchCoffee = () => {
    ListRef?.current?.scrollToOffset({
      animate: true,
      offset: 0
    });
    setCategoryIndex({index: 0,category:categories[0]})
    setSortedCoffee([...CoffeeList]);
    setSearchText('');
  }

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.ScrollViewFlex}>
        
        <HeaderBar title={"Home Screen"}/>
        
        <Text style={styles.ScreenTitle}>Find the best{'\n'}coffee for you</Text>
        
        <View style={styles.InputContainerComponent}>
          <TouchableOpacity onPress={() => {
            searchCoffee(searchText)
          }}>
            <CustomIcon 
              style={styles.InputIcon}
              name='search' size={FONTSIZE.size_18} 
              color={searchText.length > 0 ? COLORS.primaryOrangeHex:COLORS.primaryLightGreyHex}/>
          </TouchableOpacity>
          <TextInput placeholder='Find your Coffee..' 
            value={searchText} 
            onChangeText={text => {
              searchCoffee(text);
              setSearchText(text);
            }}
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
            />
            {searchText.length > 0 ? 
            <TouchableOpacity onPress={()=>{resetSearchCoffee();}}>
              <CustomIcon 
              style = {styles.InputIcon}
                  name='close'
                  size={FONTSIZE.size_16}
                  color={COLORS.primaryLightGreyHex} 
              />
            </TouchableOpacity> 
            : <></>}
        </View>

          {/* Category List */}
        <ScrollView horizontal
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.CategoryScrollViewStyle}>
          {categories.map((data,index)=> (
            <View key={index.toString()} style={styles.CategoryScrollViewContainer}>
              <TouchableOpacity 
              style={styles.CategoryScrollViewItem}
              onPress={() => {
                setCategoryIndex({index:index,category:categories[index]})
                setSortedCoffee([...getCoffeeList(categories[index] , CoffeeList)]);
              }}>
                <Text style={[
                  styles.CategoryText,
                  categoryIndex.index==index ? {color:COLORS.primaryOrangeHex}:{color:COLORS.primaryLightGreyHex}
                  ]} >{data}</Text>
                {categoryIndex.index == index ? <View style={styles.ActiveCategory} />:<></>}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Coffee Flat List */}
        <FlatList horizontal
        ref={ListRef} 
        ListEmptyComponent={
          <View style = {styles.EmptListContainer}>
            <Text style={styles.CategoryText} >No Coffee Available</Text>
          </View>
        }
        showsHorizontalScrollIndicator={false}
        data={sortedCoffee}
        contentContainerStyle={styles.FlatListContainer}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (<TouchableOpacity onPress={()=> {
            navigation.push('Details')
          }}>
            <CoffeeCard name={item.name}
            index={item.index}
            type={item.type}
            rosted={item.rosted}
            imagelink_square={item.imagelink_square}
            id={item.id}
            special_ingredient={item.special_ingredient}
            average_rating={item.average_rating}
            price={item.prices[2]}
            ButtonPressHandler={()=>{}}
            />
          </TouchableOpacity>
          );
        }}
        />

        <Text style={styles.CoffeBeansTitle}> Coffee Beans</Text>
        {/* Beans Flat List */}
        
        <FlatList horizontal 
        showsHorizontalScrollIndicator={false}
        data={BeanList}
        contentContainerStyle={[styles.FlatListContainer , {marginBottom:tabBarHeight}]}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (<TouchableOpacity onPress={()=> {
            navigation.push('Details')
          }}>
            <CoffeeCard name={item.name}
            index={item.index}
            type={item.type}
            rosted={item.rosted}
            imagelink_square={item.imagelink_square}
            id={item.id}
            special_ingredient={item.special_ingredient}
            average_rating={item.average_rating}
            price={item.prices[2]}
            ButtonPressHandler={()=>{}}
            />
          </TouchableOpacity>
          );
        }}
        />
        

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  ScreenContainer:{
    flex:1,
    backgroundColor:COLORS.primaryBlackHex,
  },
  ScrollViewFlex:{
    flexGrow:1,
  },
  ScreenTitle:{
    fontSize:FONTSIZE.size_28,
    fontFamily:FONTFAMILY.poppins_semibold,
    color:COLORS.primaryWhiteHex,
    paddingLeft:SPACING.space_30
  },
  InputContainerComponent:{
    flexDirection:'row',
    margin:SPACING.space_30,
    borderRadius:BORDERRADIUS.radius_20,
    backgroundColor:COLORS.primaryDarkGreyHex,
    alignItems:'center',
  },
  InputIcon:{
    marginHorizontal:SPACING.space_20,
  },
  TextInputContainer:{
    flex:1,
    height:SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize:FONTSIZE.size_14,
    color:COLORS.primaryWhiteHex
  },
  CategoryScrollViewStyle:{
    paddingHorizontal:SPACING.space_20,
    marginBottom:SPACING.space_20,
  },
  CategoryScrollViewItem:{
    alignItems:'center',
  },
  ActiveCategory:{
    height:SPACING.space_10,
    width:SPACING.space_10,
    borderRadius:BORDERRADIUS.radius_10,
    backgroundColor:COLORS.primaryOrangeHex,
  },
  CategoryScrollViewContainer:{
    paddingHorizontal:SPACING.space_15,

  },
  CategoryText:{
    fontFamily:FONTFAMILY.poppins_medium,
    fontSize:FONTSIZE.size_16,
    color:COLORS.primaryLightGreyHex,
    marginBottom:SPACING.space_4
  },
  FlatListContainer:{
    gap:SPACING.space_20,
    paddingVertical:SPACING.space_20,
    paddingHorizontal:SPACING.space_30
  },
  CoffeBeansTitle:{
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
    color: COLORS.primaryWhiteHex,
  },
  EmptListContainer:{
    width:Dimensions.get('window').width - SPACING.space_30 *2 ,
    alignItems:'center',
    justifyContent:'center',
    paddingVertical: SPACING.space_36*3.6,
  },
})

export default HomeScreen