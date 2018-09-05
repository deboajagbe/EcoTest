/**
 * Individual news Card Container
 *
 * React Native Starter App
 * https://github.com/deboAjagbe/react-native-starter-app
 */
import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
// Consts and Libs
import AppUtil from '@lib/util';

// Components
import NewsView from './NewsView';
import moment from 'moment'


/* Component ==================================================================== */
class NewsContainer extends Component {
    static componentName = 'NewsContainer';

    static propTypes = {
        news: PropTypes.shape({
            id: PropTypes.number,   
        }).isRequired,
    }

    constructor(props) {
        super(props);
        const news = this.parsenewsData(props.news);
        this.state = {
            news,
        };
    }

    componentWillReceiveProps(props) {
        if (props.news) {
            const news = this.parsenewsData(props.news);
            this.setState({ news });
        }
    }


    /**
   * On Press of Card
   */
    onPressCard = () => {
        Actions.EcoTestView({
            title: 'EcoTest News',
            news: this.props.news,
            rawData: this.state.rawData
        });
    }

    /**
      * Data from API is a bit messy - clean it up here
      */
    parsenewsData = (data) => {
        const news = data;
        let { title, content, date, ximage, description } = data;
        const featuredImg = data.x_featured_media_original;
        if (title == undefined) {
            title = 'No title'
        }else{
            title.rendered = AppUtil.htmlEntitiesDecode(title.rendered);
        }

        if (content == undefined){
            content = 'Nothing to read'
        }else{
            // Produce a summary
            content.rendered = AppUtil.htmlEntitiesDecode(content.rendered);
            content.rendered = AppUtil.stripTags(content.rendered);
            const summary = AppUtil.limitChars(content.rendered, 60);        
        }
        // Is there a better way to test this?
        news.featured_image = (
            featuredImg &&
            featuredImg.media_details &&
            featuredImg.media_details.sizes &&
            featuredImg.media_details.sizes.medium &&
            featuredImg.media_details.sizes.medium.source_url
        ) ?
            featuredImg.media_details.sizes.medium.source_url : '';

        return {
            image: news.featured_image,
            title: title? title.rendered : 'No title',
            ximage: news.x_featured_media_original,
            date: moment(news.date).fromNow(),
            content: content? content.rendered : 'Nothing to read'
        };
    }

    render = () => {
        const { news } = this.state;
        const { user } = this.props;
        
        return (
            <NewsView
                image={news.image}
                title={news.title}
                date={news.date}
                ximage={news.ximage}
                viewType = {this.props.viewType}
                onPress={this.onPressCard}
                onPressFavourite={(user && user.id) ? this.onPressFavourite : null}
                isFavourite={(user && user.id && this.isFavourite()) && true}
            />
        );
    }
}

/* Export Component ==================================================================== */
export default NewsContainer;
