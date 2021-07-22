import React from 'es-react'
import './like_button.css';


const e = React.createElement;

export default class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return e('h1',{},'You liked this!');
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like!'
    );
  }
}


