import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Foundation from '@hecom/foundation'; // eslint-disable-line
import Navigation from '@hecom/navigation';

export default (WrappedComponent) => {
    return class extends React.PureComponent {
        static navigationOptions = WrappedComponent.navigationOptions || {header: null};

        _apiRefresh = (_isApiLoading, _apiLoadingStyle) => {
            this.props.navigation.setParams({_isApiLoading, _apiLoadingStyle});
        };

        constructor(props) {
            super(props);
            Navigation.setRefreshNav(props.navigation);
        }

        componentDidMount() {
            this.viewDidAppear = this.props.navigation.addListener(
                'didFocus',
                () => {
                    Navigation.setRefreshNav(this.props.navigation);
                }
            )
            this.viewWillDisappear = this.props.navigation.addListener(
                'willBlur',
                () => {
                    Navigation.setRefreshNav(null);
                }
            )
        }

        componentWillUnmount() {
            this.viewDidAppear.remove();
            this.viewWillDisappear.remove();
        }

        render() {
            const params = this.props.navigation.state.params || {};
            const {_isApiLoading, _apiLoadingStyle} = params;
            delete params._isApiLoading;
            delete params._apiLoadingStyle;
            return (
                <View style={[styles.view, Foundation.Style.ViewBackground]}>
                    <WrappedComponent
                        {...params}
                        navigation={this.props.navigation}
                        apiRefresh={this._apiRefresh}
                    />
                    {_isApiLoading && this._renderLoadingView(_apiLoadingStyle)}
                </View>
            );
        }

        _renderLoadingView = (style) => {
            return (
                <View style={[styles.loading, style]}>
                    <ActivityIndicator size='small' color='#999999' />
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