/**
 * Recipe Listing Screen
 *  - Shows a list of receipes
 *
 * React Native Starter App
 * https://github.com/deboAjagbe/react-native-starter-app
 */
import React, { Component } from 'react';
import {
  View,
  ListView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppColors, AppStyles } from '@theme/';
import { ErrorMessages } from '@constants/';

// Containers
import RecipeCard from './CardView';

// Components
import Error from '@components/general/Error';
import recipesStore from '../stores/recipesStore';
const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

/* Component ==================================================================== */
class RecipeListing extends Component {
  render = () => {
    const dataSource = ds.cloneWithRows(recipesStore.recipes);
    return (
      <View style={[AppStyles.container]}>
        <ListView
          initialListSize={5}
          renderRow={recipe => <RecipeCard {...recipe} onPress={() => Actions.recipeView({ title: recipe.title, recipe })} />}
          dataSource={dataSource}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default RecipeListing;
