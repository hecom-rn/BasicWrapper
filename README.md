# BasicWrapper

[![npm version](https://img.shields.io/npm/v/@hecom/wrapper-basic.svg?style=flat)](https://www.npmjs.com/package/@hecom/wrapper-basic)
[![Build Status](https://travis-ci.org/hecom-rn/BasicWrapper.svg?branch=master)](https://travis-ci.org/hecom-rn/BasicWrapper)

这是用于加载状态封装的高阶组件，增加了`apiRefresh`接口给待封装的组件，参数也被取出后传入。

只导出高阶组件，`(WrappedComponent) => React.PureComponent`格式。