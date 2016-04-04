import React from "react";
import ReactDOM from "react-dom";
import { connect, Provider } from "react-redux";
import { bindActionCreators, compose, createStore } from "redux";
import TimeMachineMonitor from "./TimeMachineMonitor";
import { createDevTools } from "redux-devtools";

// Action Types
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

// Action Creators
const increment = () => { return { type: INCREMENT }; };
const decrement = () => { return { type: DECREMENT }; };

const reducer = (state, action) => {
	if (!state && state !== 0) {
		return 0;
	}

	switch (action.type) {
	case INCREMENT:
		return state + 1;
	case DECREMENT:
		return state - 1;
	default:
		return state;
	}
};

const store = compose(
	window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(reducer);

const App = (props) => {
	const buttonStyle = {
		backgroundColor: "#FDF6E3",
		borderColor: "#043643",
		borderRadius: 4,
		color: "#043643",
		flex: 1,
		fontSize: 24,
		width: 34,
		height: 34
	};

	const countStyle = {
		flex: 1,
		fontSize: 24,
		fontWeight: 600,
		paddingLeft: 8,
		paddingRight: 8,
		textAlign: "center"
	};

	return (
		<div style={{
			backgroundColor: "#002B37",
			color: "#B1BDB3",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			height: "100%"
		}}>
			<div style={{ maxWidth: "50%" }}>
				<button onClick={props.decrement} style={buttonStyle}>-</button>
				<span style={countStyle}>{props.x}</span>
				<button onClick={props.increment} style={buttonStyle}>+</button>
			</div>
		</div>
	)
}

const AppContainer = connect(
	(state) => { return { x: state } },
	(dispatch) => { return bindActionCreators({ increment, decrement }, dispatch); }
)(App);

const DevTools = createDevTools(<TimeMachineMonitor component={AppContainer}/>);

ReactDOM.render((
	<Provider store={store}>
		<div style={{ height: "100%" }}>
			<DevTools/>
			<AppContainer/>
		</div>
	</Provider>
), document.getElementById("app"));

// Set up some stuff, so we don't have to click buttons
store.dispatch(increment());
store.dispatch(increment());
store.dispatch(decrement());
store.dispatch(decrement());
store.dispatch(decrement());
store.dispatch(decrement());
store.dispatch(decrement());
store.dispatch(decrement());
store.dispatch(decrement());
store.dispatch(increment());
store.dispatch(increment());
