import React from "react";
import PropTypes from "prop-types";
import {
  Dimensions,
  FlatList,
  TouchableHighlight,
  View,
  StyleSheet,
  ViewPropTypes,
  DeviceEventEmitter
} from "react-native";

import Constants from "./constants";
import { Photo } from "./media";

// 1 margin and 1 border width
const ITEM_MARGIN = 2;

export default class GridContainer extends React.Component {
  static propTypes = {
    style: ViewPropTypes.style,
    mediaList: PropTypes.array.isRequired,
    square: PropTypes.bool,
    displaySelectionButtons: PropTypes.bool,
    onPhotoTap: PropTypes.func,
    itemPerRow: PropTypes.number,

    /*
     * refresh the list to apply selection change
     */
    onMediaSelection: PropTypes.func,

    /**
     * offsets the width of the grid
     */
    offset: PropTypes.number
  };

  static defaultProps = {
    displaySelectionButtons: false,
    onPhotoTap: () => { },
    itemPerRow: 3
  };

  constructor(props) {
    super(props);
    this.state = {
      horizontal:
        Dimensions.get("window").width < Dimensions.get("window").height
    };
  }

  componentDidMount() {
    DeviceEventEmitter.addListener("didUpdateDimensions", () => {
      let horizontal =
        Dimensions.get("window").width < Dimensions.get("window").height;
      this.setState({
        horizontal
      });
    });
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener("didUpdateDimensions");
  }

  keyExtractor = item => item.id || item.thumb || item.photo;

  renderItem = ({ item, index }) => {
    const {
      displaySelectionButtons,
      onPhotoTap,
      onMediaSelection,
      itemPerRow,
      square,
      offset
    } = this.props;
    const screenWidth = Dimensions.get("window").width - offset;
    const photoWidth =
      screenWidth / (this.state.horizontal ? 3 : 6) -
      (this.state.horizontal ? 3 * 2 : 6 * 2);

    return (
      <TouchableHighlight onPress={() => onPhotoTap(index)}>
        <View style={styles.row}>
          <Photo
            width={photoWidth}
            height={square ? photoWidth : 100}
            resizeMode={"center"}
            thumbnail
            progressImage={require("../Assets/hourglass.png")}
            displaySelectionButtons={displaySelectionButtons}
            uri={item.thumb}
            selected={item.selected}
            onSelection={isSelected =>
              onMediaSelection(item, index, isSelected)
            }
          />
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const { mediaList } = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={mediaList}
          initialNumToRender={21}
          key={this.state.horizontal ? "h" : "v"}
          numColumns={this.state.horizontal ? 3 : 6}
          renderItem={this.renderItem}
          removeClippedSubviews={false}
          getItemLayout={this.getItemLayout}
          style={styles.flatList}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Constants.TOOLBAR_HEIGHT
  },
  row: {
    justifyContent: "center",
    margin: 1,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 1
  },
  flatList: { flexWrap: "wrap" }
});
