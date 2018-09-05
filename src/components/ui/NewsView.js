/**
 * Recipe View Screen
 *  - The individual recipe screen
 *
 * React Native Starter App
 * https://github.com/deboAjagbe/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

// Consts and Libs
import { AppStyles } from '@theme/';

// Components
import { Card, Text, NewsComponent } from '@ui/';
const EcoTestLogo = 'http://i68.tinypic.com/2d99veu.jpg';//require('../../images/slideIcon.png')

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    favourite: {
        position: 'absolute',
        top: -45,
        right: 0,
    },
});

/* Component ==================================================================== */
class NewsView extends Component {
    static componentName = 'NewsView';

    static propTypes = {
        image: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        onPress: PropTypes.func,
        onPressFavourite: PropTypes.func,
        isFavourite: PropTypes.bool,
    }

    static defaultProps = {
        onPress: null,
        onPressFavourite: null,
        isFavourite: null,
    }

    render = () => {
        const { title, date, image, ximage, onPress, onPressFavourite, viewType, isFavourite } = this.props;
           return (
               <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
                   <NewsComponent imageURI={ximage ? ximage : EcoTestLogo} viewType={viewType} titleText={title} date={date}  /> 
               </TouchableOpacity>
        );
    }
}

/* Export Component ==================================================================== */
export default NewsView;
//imageURI={ximage ?ximage : EcoTestLogo} 


// <ListItem
//     roundAvatar
//     title={`${item.title.rendered}`}
//     subtitle={item.date}
//     avatar={{ uri: item.x_featured_media_original }}
//     containerStyle={{ borderBottomWidth: 0 }}
// />



// <Card image={ximage ? ximage && { uri: ximage } : EcoTestLogo}>
//     <View style={[AppStyles.paddingBottomSml]}>
//         <Text h3>{title}</Text>
//         <Text>{date}</Text>

//         {!!onPressFavourite &&
//             <TouchableOpacity
//                 activeOpacity={0.8}
//                 onPress={onPressFavourite}
//                 style={[styles.favourite]}
//             >
//                 <Icon
//                     raised
//                     name={'star-border'}
//                     color={isFavourite ? '#FFFFFF' : '#FDC12D'}
//                     containerStyle={{
//                         backgroundColor: isFavourite ? '#FDC12D' : '#FFFFFF',
//                     }}
//                 />
//             </TouchableOpacity>
//         }
//     </View>
// </Card>