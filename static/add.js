// import ReactDOM from 'react-dom';
import  React,{ReactDOM } from 'es-react'
import LikeButton from './like_button.js';

const e = React.createElement;
const domContainer=document.getElementById("like_button_container");

ReactDOM.render(e(LikeButton), domContainer);

export default function add(a, b) {
    return a + b;
}