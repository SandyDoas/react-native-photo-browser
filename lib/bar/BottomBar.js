import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';

import IonIcon from 'react-native-vector-icons/Ionicons';

import { BarContainer, BAR_POSITIONS } from './BarContainer';

const BUTTON_WIDTH = 40;

export default class BottomBar extends React.Component {

  static propTypes = {
    displayed: PropTypes.bool,
    height: PropTypes.number,
    caption: PropTypes.string,
    displayNavArrows: PropTypes.bool,
    displayGridButton: PropTypes.bool,
    displayActionButton: PropTypes.bool,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    onGrid: PropTypes.func,
    onAction: PropTypes.func,
    currentIndex: PropTypes.number,
    photoCount: PropTypes.number,
  };

  static defaultProps = {
    displayed: false,
    caption: '',
    displayNavArrows: false,
    displayGridButton: false,
    displayActionButton: false,
    onPrev: () => { },
    onNext: () => { },
    onGrid: () => { },
    onAction: () => { },
  };

  _renderNavArrows() {
    const {
      displayNavArrows,
      displayGridButton,
      displayActionButton,
      onPrev,
      onNext,
      currentIndex,
      photoCount
    } = this.props;
    const missingButtonMargin = BUTTON_WIDTH;
    const arrows = [];

    if (displayNavArrows) {
      // make sure arrows are always at the center of the bar
      // if grid or action buttons are missing
      // note: making grid and action button positions absolute is a nicer way
      // but it's breaking TouchableHiglight for some reason
      // FIX_ME: when you find out a nicer way

      const leftArrow = (
        <TouchableOpacity
          key="left_arrow"
          style={styles.button}
          onPress={onPrev}
          disabled={currentIndex == 0 ? true : false}
        >
          <IonIcon
            name="ios-play"
            size={30}
            color={currentIndex == 0 ? 'grey' : 'white'}
            style={styles.prevStyle}
          />
        </TouchableOpacity>
      );
      const rightArrow = (
        <TouchableOpacity
          key="right_arrow"
          style={styles.button}
          onPress={onNext}
          disabled={currentIndex == (photoCount - 1) ? true : false}
        >
          <IonIcon
            name="ios-play"
            size={30}
            color={currentIndex == (photoCount - 1) ? '#a5a5a5' : 'white'}
            style={styles.nextStyle}
          />
        </TouchableOpacity>
      );

      arrows.push(leftArrow, rightArrow);
    }
    return (
      <View style={[styles.arrowContainer, {
        marginRight: displayGridButton ? missingButtonMargin : 0,
        marginLeft: displayActionButton ? missingButtonMargin : 0,
      }]}>
        {arrows}
      </View>
    );
  }

  _renderGridButton() {
    const { displayGridButton, onGrid } = this.props;

    if (displayGridButton) {
      return (
        <TouchableOpacity style={[styles.button, { flex: 0 }]} onPress={onGrid}>
          <Image
            source={require('../../Assets/grid-button.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      );
    }
    return null;
  }

  _renderActionSheet() {
    const { displayActionButton, onAction } = this.props;

    if (displayActionButton) {
      return (
        <TouchableOpacity style={[styles.button, { flex: 0 }]} onPress={onAction}>
          <Image
            source={require('../../Assets/share-button.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      );
    }
    return null;
  }

  render() {
    const { displayed, caption, height } = this.props;

    return (
      <BarContainer
        position={BAR_POSITIONS.BOTTOM}
        displayed={displayed}
        height={height}
        style={styles.container}
      >
        {/*         <View style={styles.captionContainer}>
          <Text style={styles.caption} numberOfLines={1}>{caption}</Text>
        </View> */}

        <View style={styles.buttonContainer}>
          {this._renderGridButton()}
          {this._renderNavArrows()}
          {this._renderActionSheet()} 
        </View>
      </BarContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  captionContainer: {
    flex: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
  },
  caption: {
    color: 'white',
    alignSelf: 'center',
    paddingTop: 8,
  },
  arrowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',

  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  button: {
    alignItems: 'center',
    width: BUTTON_WIDTH,
  },
  buttonImage: {
    // marginTop: 8,
  },

  nextStyle: {
    marginTop: Platform.OS == 'ios' ? 3 : 0
  },

  prevStyle: {
    transform: [{ rotate: '-180deg' }],
  }
});
