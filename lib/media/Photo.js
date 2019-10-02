import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform
} from "react-native";

import * as Progress from "react-native-progress";
//import { ImageCacheManager } from "react-native-cached-image";
import PhotoView from "react-native-photo-view";

export default class Photo extends Component {
  static propTypes = {
    /*
     * image uri or opaque type that is passed as source object to image component
     */
    uri: PropTypes.oneOfType([
      // assets or http url
      PropTypes.string,
      // Opaque type returned by require('./image.jpg')
      PropTypes.number
    ]).isRequired,

    /*
     * displays a check button above the image
     */
    displaySelectionButtons: PropTypes.bool,

    /*
     * image resizeMode
     */
    resizeMode: PropTypes.string,

    /*
     * these values are set to image and it's container
     * screen width and height are used if those are not defined
     */
    width: PropTypes.number,
    height: PropTypes.number,

    /*
     * when lazyLoad is true,
     * image is not loaded until 'load' method is manually executed
     */
    lazyLoad: PropTypes.bool,

    /*
     * displays selected or unselected icon based on this prop
     */
    selected: PropTypes.bool,

    /*
     * size of selection images are decided based on this
     */
    thumbnail: PropTypes.bool,

    /*
     * executed when user selects/unselects the photo
     */
    onSelection: PropTypes.func,

    /*
     * image tag generated using require(asset_path)
     */
    progressImage: PropTypes.number,

    /*
     * displays Progress.Circle instead of default Progress.Bar
     * it's ignored when progressImage is also passed.
     * iOS only
     */
    useCircleProgress: PropTypes.bool
  };

  static defaultProps = {
    resizeMode: "contain",
    thumbnail: false,
    lazyLoad: false,
    selected: false
  };

  constructor(props) {
    super(props);

    this._onProgress = this._onProgress.bind(this);
    this._onError = this._onError.bind(this);
    this._onLoad = this._onLoad.bind(this);
    this._toggleSelection = this._toggleSelection.bind(this);

    const { lazyLoad, uri, selected } = props;

    this.state = {
      uri: lazyLoad ? null : uri,
      progress: 0,
      error: false,
      selected,
      deviceWidth: Dimensions.get("window").width,
      cachedUrl: this.props.uri
    };
    self = this;
  }

  componentWillMount() {
    /*   const { uri } = this.props;
      ImageCacheManager()
        .downloadAndCacheUrl(uri)
        .then(cachedFilePath => {
          this.setState({
            cachedUrl: "file://" + cachedFilePath,
            progress: 1
          });
        }); */
  }

  updateDeviceWidth(e) {
    const layoutWidth = Dimensions.get("window").width;

    this.setState({ deviceWidth: layoutWidth });
    this.forceUpdate();
  }

  load() {
    if (!this.state.uri) {
      this.setState({
        uri: this.props.uri
      });
    }
  }

  _onProgress(event) {
    const progress = event.nativeEvent.loaded / event.nativeEvent.total;
    if (!this.props.thumbnail && progress !== this.state.progress) {
      this.setState({
        progress
      });
    }
  }

  _onError() {
    this.setState({
      error: true,
      progress: 1
    });
  }

  _onLoad() {
    this.setState({
      progress: 1
    });
  }

  _toggleSelection() {
    this.props.onSelection(!this.state.selected);
    this.setState(prevState => ({ selected: !prevState.selected }));
  }

  _renderProgressIndicator() {
    const { progressImage, useCircleProgress } = this.props;
    const { progress } = this.state;

    if (progress < 1) {
      if (progressImage) {
        return <Image source={progressImage} />;
      }

      return (
        <ActivityIndicator color="#616161" animating={true} size={"large"} />
      );

      const ProgressElement = useCircleProgress
        ? Progress.Circle
        : Progress.Bar;
      return (
        <ProgressElement progress={progress} thickness={20} color={"white"} />
      );
    }
    return null;
  }

  _renderErrorIcon() {
    return <Image source={require("../../Assets/image-error.png")} />;
  }

  _renderSelectionButton() {
    const { selected, progress } = this.state;
    const { displaySelectionButtons, thumbnail } = this.props;

    // do not display selection before image is loaded
    if (!displaySelectionButtons || progress < 1) {
      return null;
    }

    let buttonImage;
    if (thumbnail) {
      let icon = require("../../Assets/small-selected-off.png");
      if (selected) {
        icon = require("../../Assets/small-selected-on.png");
      }

      buttonImage = (
        <Image source={icon} style={styles.thumbnailSelectionIcon} />
      );
    } else {
      let icon = require("../../Assets/selected-off.png");
      if (selected) {
        icon = require("../../Assets/selected-on.png");
      }

      buttonImage = (
        <Image style={styles.fullScreenSelectionIcon} source={icon} />
      );
    }

    return (
      <TouchableWithoutFeedback onPress={this._toggleSelection}>
        {buttonImage}
      </TouchableWithoutFeedback>
    );
  }

  render() {
    const { resizeMode, width, height, id, setChildRef, onTap } = this.props;
    const screen = Dimensions.get("window");
    const { uri, error, progress, cachedUrl } = this.state;

    let source;
    if (uri) {
      // create source objects for http/asset strings
      // or directly pass uri number for local files
      source = typeof uri === "string" ? { uri } : uri;
    }

    // i had to get window size and set photo size here
    // to be able to respond device orientation changes in full screen mode
    // FIX_ME: when you have a better option
    const sizeStyle = {
      width: width || screen.width,
      height: height || screen.height
    };
    console.log('source', source);
    return (

      <View style={[styles.container, sizeStyle]}>
        {error ? (
          this._renderErrorIcon()
        ) : progress !== 1 ? (
          <View
            style={{
              position: "absolute",
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {this._renderProgressIndicator()}
          </View>
        ) : null}
        {cachedUrl !== "" ? (
          <PhotoView
            onLayout={e => this.updateDeviceWidth(e)}
            source={source}
            ref={setChildRef}
            id={id}
            onTap={onTap}
            onViewTap={onTap}
            minimumZoomScale={1}
            maximumZoomScale={4}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            androidScaleType="fitCenter"
            style={{
              width: "100%",
              height: "100%",
              alignSelf: "center",
              backgroundColor: '#000'
            }}
            onProgress={this._onProgress}
            onError={this._onError}
            onLoad={this._onLoad}
          />
        ) : null}
        {this._renderSelectionButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  thumbnailSelectionIcon: {
    position: "absolute",
    top: 8,
    right: 8
  },
  fullScreenSelectionIcon: {
    position: "absolute",
    top: 60,
    right: 16
  }
});
