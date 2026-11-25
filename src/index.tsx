import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import RootSiblings from 'react-native-root-siblings';
import Foundation from '@hecom/foundation'; // eslint-disable-line
import LottieView from 'lottie-react-native';

export default (WrappedComponent, style = undefined) => {
    return class extends React.PureComponent {
        static navigationOptions = WrappedComponent.navigationOptions || {headerShown: false};
        lottieView;
        loadingSibling;
        loadingElement;
        _apiRefresh = (_isApiLoading) => {
            this.props.navigation.setParams({_isApiLoading});
        };

        componentWillUnmount(): void {
            if (this.lottieView) {
                this.lottieView.pause();
                this.lottieView = null;
            }
            this._hideLoadingSibling();
        }

        render() {
            const params = this.props.route.params || {};
            const {_isApiLoading} = params;
            delete params._isApiLoading;
            if (_isApiLoading) {
                this._showLoadingSibling();
            } else {
                this._hideLoadingSibling();
            }
            return (
                <View style={[styles.view, Foundation.Style.ViewBackground, style]}>
                    <WrappedComponent
                        {...params}
                        navigation={this.props.navigation}
                        apiRefresh={this._apiRefresh}
                        route = {this.props.route}
                    />
                </View>
            );
        }

        // loading 用独立宿主层（RootSiblings）渲染，与页面渲染树隔离：
        // 页面在 loading 期间的大规模 re-render（如管理总表万格表格构造后的刷新）
        // 不会 diff 到该层，loading 动画不会被页面树的重渲染重置或饿死。
        _showLoadingSibling() {
            if (this.loadingSibling) {
                return;
            }
            if (!this.loadingElement) {
                this.loadingElement = this._renderLoadingView();
            }
            this.loadingSibling = new RootSiblings(this.loadingElement);
        }

        _hideLoadingSibling() {
            if (this.loadingSibling) {
                const sibling = this.loadingSibling;
                this.loadingSibling = null;
                if (this.lottieView) {
                    this.lottieView.pause();
                    this.lottieView = null;
                }
                sibling.destroy(() => {
                    // RootSiblings 异步销毁完成
                });
            }
        }

        _renderLoadingView = () => {
            return (
                <View style={styles.loading}>
                    {/* ActivityIndicator 的 Material 转圈是 AnimatedVectorDrawable，动画在
                        RenderThread 原生驱动，JS/UI 线程被大数据量构造占满时仍能正常播放。
                        原三点 lottie 方案（HARDWARE 渲染）在 JS 满负荷时仍会被页面树重渲染
                        打断，故切换为 AVD；lottie 依赖保留，如需恢复三点点动画可换回。 */}
                    <ActivityIndicator size="large" color="#fc3b39" animating={true} />
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
