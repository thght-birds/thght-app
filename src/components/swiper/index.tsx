import React, { Component } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Button from '../../components/button';
import { colors } from '../../styles/base';

export interface Props {}

interface State {}

// Detect screen width and height
const { width, height } = Dimensions.get('window');

export default class OnboardingScreens extends Component<Props, State> {
  static defaultProps = {
    horizontal: true,
    pagingEnabled: true,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    bounces: false,
    scrollsToTop: false,
    removeClippedSubviews: true,
    automaticallyAdjustContentInsets: false,
    index: 0,
  };

  state = this.initState(this.props);

  initState(props) {
    const total = props.children ? props.children.length || 1 : 0;
    const index = total > 1 ? Math.min(props.index, total - 1) : 0;
    const offset = width * index;

    const state = {
      total,
      index,
      offset,
      width,
      height,
    };

    this.internals = {
      isScrolling: false,
      offset,
    };

    return state;
  }

  onScrollBegin = e => {
    this.internals.isScrolling = true;
  };

  onScrollEnd = e => {
    this.internals.isScrolling = false;

    this.updateIndex(
      e.nativeEvent.contentOffset
        ? e.nativeEvent.contentOffset.x
        : e.nativeEvent.position * this.state.width,
    );
  };

  onScrollEndDrag = e => {
    const {
        contentOffset: { x: newOffset },
      } = e.nativeEvent,
      { children } = this.props,
      { index } = this.state,
      { offset } = this.internals;

    if (offset === newOffset && (index === 0 || index === children.length - 1)) {
      this.internals.isScrolling = false;
    }
  };

  updateIndex = offset => {
    const state = this.state;
    const diff = offset - this.internals.offset;
    const step = state.width;
    let index = state.index;

    if (!diff) {
      return;
    }

    index = parseInt(index + Math.round(diff / step), 10);

    this.internals.offset = offset;
    this.setState({
      index,
    });
  };

  swipe = () => {
    if (this.internals.isScrolling || this.state.total < 2) {
      return;
    }

    const state = this.state;
    const diff = this.state.index + 1;
    const x = diff * state.width;
    const y = 0;

    this.scrollView && this.scrollView.scrollTo({ x, y, animated: true });

    this.internals.isScrolling = true;
  };

  renderScrollView = pages => {
    return (
      <ScrollView
        ref={component => {
          this.scrollView = component;
        }}
        {...this.props}
        contentContainerStyle={[styles.wrapper, this.props.style]}
        onScrollBeginDrag={this.onScrollBegin}
        onMomentumScrollEnd={this.onScrollEnd}
        onScrollEndDrag={this.onScrollEndDrag}
      >
        {pages.map((page, i) => (
          <View style={[styles.fullScreen, styles.slide]} key={i}>
            {page}
          </View>
        ))}
      </ScrollView>
    );
  };

  renderPagination = () => {
    if (this.state.total <= 1) {
      return null;
    }

    const ActiveDot = <View style={[styles.dot, styles.activeDot]} />;
    const Dot = <View style={styles.dot} />;

    let dots = [];

    for (let key = 0; key < this.state.total; key++) {
      dots.push(
        key === this.state.index
          ? React.cloneElement(ActiveDot, { key })
          : React.cloneElement(Dot, { key }),
      );
    }

    return (
      <View pointerEvents="none" style={[styles.pagination, styles.fullScreen]}>
        {dots}
      </View>
    );
  };

  renderButton = () => {
    const lastScreen = this.state.index === this.state.total - 1;
    return (
      <View pointerEvents="box-none" style={[styles.buttonWrapper, styles.fullScreen]}>
        {lastScreen ? (
          // TODO: Add a handler that would send a user to your app after onboarding is complete
          <Button text="Create account" onPress={() => console.log('Send me to the app')} />
        ) : (
          <Button text="Continue" onPress={() => this.swipe()} />
        )}
      </View>
    );
  };

  render = ({ children } = this.props) => {
    return (
      <View style={[styles.container, styles.fullScreen]}>
        {/* Render screens */}
        {this.renderScrollView(children)}
        {/* Render pagination */}
        {this.renderPagination()}
        {/* Render Continue or Done button */}
        {this.renderButton()}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  // Set width and height to the screen size
  fullScreen: {
    width,
    height,
  },
  // Main container
  container: {
    backgroundColor: 'transparent',
    position: 'relative',
  },
  // Slide
  slide: {
    backgroundColor: 'transparent',
  },
  // Pagination indicators
  pagination: {
    position: 'absolute',
    bottom: 110,
    left: 0,
    right: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  // Pagination dot
  dot: {
    backgroundColor: colors.gray_lightest,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  // Active dot
  activeDot: {
    backgroundColor: '#FFFFFF',
  },
  // Button wrapper
  buttonWrapper: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0,
    left: 0,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 40,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
