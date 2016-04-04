import React, { Component, PropTypes } from "react";
import { ActionCreators, createDevTools } from "redux-devtools";
import { Provider } from "react-redux";
import bgSrc from "./images/starfield.gif";

const { importState } = ActionCreators;

const modeSwitchButtonStyle = {
	cursor: "pointer",
	position: "fixed",
	top: 20,
	right: 20,
	zIndex: 1
};

const highlightButtonStyle = {
	animationName: "tardisActive",
	animationDirection: "linear",
	animationDuration: "1.2s",
	animationIterationCount: "infinite",
	animationTimingFunction: "ease"
};

const timeMachineOuterBaseStyle = {
	background: `#333 url(${bgSrc}) no-repeat`,
	backgroundSize: "cover",
	position: "fixed",
	top: 0, left: 0, right: 0, bottom: 0,
	transition: "all 0.3s"
};

const hiddenStyle = {
	...timeMachineOuterBaseStyle,
	top: window.innerHeight
};

const displayedStyle = {
	...timeMachineOuterBaseStyle,
	top: 0
};

const statesContainerStyle = {
	perspective: 700,
	margin: "0px auto",
	height: 1000,
	width: 800,
	position: "relative"
};

const timeMachineStateStyle = {
	top: 0, left: 0,
	width: 800,
	height: 500,
	transition: "all 0.3s",
	outline: "1px solid white",
	margin: "0px auto",
	position: "absolute"
};

const navButtonStyle = {
	position: "absolute",
	right: 20,
	fontSize: 48,
	color: "white",
	zIndex: 1,
	cursor: "pointer",
	textShadow: "0px 0px 12px #FFF"
};

const prevButtonStyle = {
	...navButtonStyle,
	top: "calc(50% - 48px - 20px - 20px)"
};

const nextButtonStyle = {
	...navButtonStyle,
	top: "calc(50% - 48px + 20px + 20px)"
};

const restoreButtonStyle = {
	position: "absolute",
	bottom: 80,
	zIndex: 1,
	width: 250,
	left: "calc(50% - 125px)"
};

const makeMockStore = (state) => {
	return {
		getState() { return state; },
		subscribe() {},
		dispatch() {}
	};
}

const KEYUP = 38;
const KEYDOWN = 40;
const T_KEY = 84;
const ENTER_KEY = 13;

class TimeMachineMonitor extends Component {
	static propTypes = {
		// Should be the app container, so we can render
		// more of these with different states / props
		component: PropTypes.any.isRequired,

		// Redux DevTools Props
		computedStates: PropTypes.array
	};
	static defaultProps = {
		computedStates: []
	};

	constructor(props) {
		super(props);

		this.state = {
			timeMachineEngaged: false,
			currentStateIndex: this.props.computedStates.length
		};

		this.toggleMode = this.toggleMode.bind(this);
		this.next = this.next.bind(this);
		this.previous = this.previous.bind(this);
		this.restore = this.restore.bind(this);
		this.keyDown = this.keyDown.bind(this);
	}

	componentDidMount() {
		document.addEventListener('keydown', this.keyDown);
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			currentStateIndex: newProps.computedStates.length - 1
		});
	}

	keyDown(event) {
		if (event.ctrlKey && event.keyCode === T_KEY) {
			this.toggleMode();
			return;
		}

		if (this.state.timeMachineEngaged) {
			switch (event.keyCode) {
			case KEYUP:
				event.shiftKey
					? this.setState({ currentStateIndex: 0 })
					: this.previous();
				return;
			case KEYDOWN:
				event.shiftKey
					? this.setState({ currentStateIndex: this.props.computedStates.length - 1 })
					: this.next();
				return;
			case ENTER_KEY:
				if (event.metaKey) {
					this.restore();
				}
				return;
			default:
				return;
			}
		}
	}

	toggleMode() {
		this.setState({
			timeMachineEngaged: !this.state.timeMachineEngaged,
		});
	}

	next() {
		const states = this.props.computedStates;
		const i = this.state.currentStateIndex === states.length - 1
			? this.state.currentStateIndex
			: this.state.currentStateIndex + 1;

		this.setState({ currentStateIndex: i })
	}

	previous() {
		const i = this.state.currentStateIndex === 0
			? this.state.currentStateIndex
			: this.state.currentStateIndex - 1;

		this.setState({ currentStateIndex: i })
	}

	restore() {
		const stagedActionIds = this.props.stagedActionIds.slice(0, this.state.currentStateIndex + 1);
		const liftedState = {
			monitorState: this.props.monitorState,
	    nextActionId: stagedActionIds.length,
	    actionsById: stagedActionIds.reduce((actionsById, actionId) => {
				actionsById[actionId] = this.props.actionsById[actionId];
				return actionsById;
			}, {}),
	    stagedActionIds,
	    skippedActionIds: [],
	    committedState: this.props.committedState,
	    currentStateIndex: this.state.currentStateIndex,
	    computedStates: this.props.computedStates.slice(0, this.state.currentStateIndex + 1)
		};
		this.props.dispatch(importState(liftedState))
		this.setState({ timeMachineEngaged: false });
	}

	render() {
		const AppComponent = this.props.component;
		const states = this.props.computedStates;
		const display = this.state.timeMachineEngaged ? "block" : "none";

		return (
			<div>
				<img
					onClick={this.toggleMode}
					style={{
						...modeSwitchButtonStyle,
						...(this.state.timeMachineEngaged ? highlightButtonStyle : {}),
						zIndex: states.length + 1
					}}
					src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB2klEQVRoQ+1ZPUsDQRDdsTCBGEhjJUQsLOziP7jGry4iSLpLCv+C2Imd+Bcs7q4LghgrDTb3D0xnYSEGrNIEYiCxcOROApcQw9vjdsnFTRWSl5n3Zt7OLDkSKX+RKv4r+44lmM7D+MQXn481X0UuZQLyex5HCfeatpJcSoIGxIf1TV4+OAw1fD3ciUzlVUkuJUHTK8ByCrnMkk3MVSIqRS3EzC0mcvvDb0/4tW5S5yGRDuR3nTILsomojBBj5gYRub2mfY/gZ2FiC8jtOCUiCk5mVRAVYhFh7rIQLjN7/adaK04MaQGrJ/7YdImTdNZvOteWFCcpcJA41QKKlx9Kqz/qTPtsDS4sDAyCTwrI3hwl4qDB8e1YHCPgr7IuXAcS8c+UIMoslPoptHACXq62QwNsVBrirf57i4i+3zp9Dj9DcQFW6yJDiaE4IwCZKtGrBFpZFKe9A4P2+0zN2eJ6+D2K0y4ArSyKMwL+3RlArYHitFsI6ZgsRusikyWH4LUKQMcjitNuIZQYijMCEI9GrxJoZVGc6YDpwEQF5v4yh3RMFqN1D8iSQ/BaBaDTBcWZKYS02OyBKVUaTStjIWOheV5kup7OjGqA/kMNP6ExApADFsEk3gHJ/NrgPw7BzkAs6WVqAAAAAElFTkSuQmCC"
					width="48"
					height="48"/>
				<div style={this.state.timeMachineEngaged ? displayedStyle : hiddenStyle}>
					<i className="fa fa-chevron-up"   style={{
						...prevButtonStyle,
						display
					}} onClick={this.previous}/>
					<i className="fa fa-chevron-down" style={{
						...nextButtonStyle,
						display
					}} onClick={this.next}/>
					<button className="restore-button" style={{
						...restoreButtonStyle,
						display
					}} onClick={this.restore}>Restore</button>
					<div style={statesContainerStyle}>
						<div style={{ position: "relative", width: "100%", height: "100%", marginTop: "25%" }}>
							{states.map((state, index) => {
								const offset = index - this.state.currentStateIndex;
								const style = {
									...timeMachineStateStyle,
									transform: `translate3d(0px, ${200 * offset}px, ${200 * offset}px)`,
									opacity: this.state.currentStateIndex < index ? 0 : 1
								};
								return (
									<div key={index} style={style}>
										<Provider store={makeMockStore(state.state)}>
											<AppComponent/>
										</Provider>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default TimeMachineMonitor;
