import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Foundation from '@hecom/foundation'; // eslint-disable-line
import LottieView from 'lottie-react-native';

export default (WrappedComponent) => {
    return class extends React.PureComponent {
        static navigationOptions = WrappedComponent.navigationOptions || {headerShown: false};

        _apiRefresh = (_isApiLoading, _apiLoadingStyle) => {
            this.props.navigation.setParams({_isApiLoading, _apiLoadingStyle});
        };

        render() {
            const params = this.props.route.params || {};
            const {_isApiLoading, _apiLoadingStyle} = params;
            delete params._isApiLoading;
            delete params._apiLoadingStyle;
            return (
                <View style={[styles.view, Foundation.Style.ViewBackground]}>
                    <WrappedComponent
                        {...params}
                        navigation={this.props.navigation}
                        apiRefresh={this._apiRefresh}
                        route = {this.props.route}
                    />
                    {_isApiLoading && this._renderLoadingView(_apiLoadingStyle)}
                </View>
            );
        }

        _renderLoadingView = (style) => {
            return (
                <View style={[styles.loading, style]}>
                    {/* <ActivityIndicator size='small' color='#999999' /> */}
                    <LottieView
                                source={require('core/common/image/loading/butterfly_loader.json')}
                                loop={true}
                                autoPlay={true}
                                resizeMode={'contain'}
                                style={{height: 150, width: 150}}
                                imageAssetsFolder='lottieLoading'
                            />
                </View>
            );
        };
    };
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    loading: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'transparent',
    },
});
