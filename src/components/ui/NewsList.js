/**
 * Recipe Listing Screen
 *  - Shows a list of receipes
 *
 * React Native Starter App
 * https://github.com/deboAjagbe/react-native-starter-app
 */
import React, { Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    FlatList,
    Platform,
    TouchableOpacity,
} from 'react-native';
import AppUtil from '@lib/util';
import moment from 'moment'
const EcoTestLogo = 'http://i68.tinypic.com/2d99veu.jpg';
import Icon from 'react-native-vector-icons/Ionicons';

import { Actions } from 'react-native-router-flux';

import {
    NewsComponent
} from '@components/ui/';
// Consts and Libs
import { AppColors, AppStyles } from '@theme/';
import Error from '@components/general/Error';
import Loading from '../general/Loading';

// Containers
import NewsContainer from './NewsContainer';
import userStore from '../../stores/userStore';


/* Component ==================================================================== */
class NewsList extends Component {
    static componentName = 'NewsList';

    static propTypes = {
        news: PropTypes.arrayOf(PropTypes.object).isRequired,
        reFetch: PropTypes.func,
    }

    static defaultProps = {
        reFetch: null,
    }
//Platform.isPad ? true :

    constructor() {
        super();

        this.state = {
            isRefreshing: true,
            gridView: false,
            dataSource: []
        };
    }

    switchButtons = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Icon name="md-more" size={25} style={{ color: 'white', fontSize: 23, paddingRight: 20 }} onPress={() => this.handleShare()} />
            </View>
        );
    };

    componentWillReceiveProps(props) {
        this.setState({
            dataSource: props.news,
            isRefreshing: false,
        });
    }

    changeView = () => {
        this.setState({ gridView: !this.state.gridView }, () => {
            if (this.state.gridView) {
                this.setState({ btnText: 'Show List' });
            }
            else {
                this.setState({ btnText: 'Show Grid' });
            }
        });
    }

    /**
      * Refetch Data (Pull to Refresh)
      */
    reFetch = () => {
        if (this.props.reFetch) {
            this.setState({ isRefreshing: true });

            this.props.reFetch()
                .then(() => {
                    this.setState({ isRefreshing: false });
                });
        }
    }

    handleLoadMore = () => {
        this.setState(
            {
                page: this.state.page + 1
            },
            () => {
                //this.makeRemoteRequest();
            }
        );
    };

    renderFooter = () => {
        if (!this.state.loading) return null;
        return (
            <Loading/>
        );
    };


    render = () => {
        const { news } = this.props;
        const { isRefreshing, dataSource } = this.state;

        if (!isRefreshing && (news == null || news.length < 1)) {
            return(
                <Error text={'oops... having connection issues while fetching related news'} tryAgain={() => this.reFetch()} />
            )
        }

        return (
            <View style={[AppStyles.container]}>
                <FlatList
                    keyExtractor={(item) => item.id ? item.id.toString() : null}
                    key={(this.state.gridView) ? 1 : 0}
                    numColumns={this.state.gridView ? 2 : 1}
                    data={dataSource}
                    ListFooterComponent={this.renderFooter}
                    onRefresh={this.reFetch}
                    refreshing={isRefreshing}
                    removeClippedSubviews={true}
                    disableVirtualization={false}
                    legacyImplementation={true}
                    tintColor={AppColors.brand.primary}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={1200}
                    renderItem={({ item }) => (
                        <TouchableOpacity activeOpacity={0.8} onPress={() =>
                            Actions.EcoTestView({
                                title: 'EcoTest News',
                                news: item
                            })}>
                            <NewsComponent imageURI={item.x_featured_media_original ? item.x_featured_media_original : EcoTestLogo} viewType={'list'} titleText={item.title ? AppUtil.htmlEntitiesDecode(item.title.rendered) : null} date={moment(item.date).fromNow()}/>
                        </TouchableOpacity>

                    )}
                />           

            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default NewsList;





    // <FlatList
    //     data={dataSource}
    //     renderItem={({ item }) => (
    //         <NewsContainer viewType={userStore.viewType} news={item} />
    //     )}
    //     keyExtractor={item => item.id.toString()}
    //     key={(this.state.gridView) ? 1 : 0}
    //     numColumns={this.state.gridView ? 2 : 1}
    //     ListHeaderComponent={this.renderHeader}
    //     ListFooterComponent={this.renderFooter}
    //     onRefresh={this.reFetch}
    //     refreshing={isRefreshing}
    //     tintColor={AppColors.brand.primary}
    //     onEndReached={this.handleLoadMore}
    //     onEndReachedThreshold={50}
    // />

       