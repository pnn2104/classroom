import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../../actions/index.js";
import Default from './classViewDefault.jsx'
import Quiz from './StudentViewQuiz.jsx';
import Timer from './Timer.jsx';
import QuizContainer from './quizContainer.jsx';
import Box from 'grommet/components/Box';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import DeployIcon from 'grommet/components/icons/base/Deploy';
import fb from '../../../db/liveClassroom.js';
import UserNew from "grommet/components/icons/base/UserNew.js";
import UserExpert from "grommet/components/icons/base/UserExpert.js";
import WorkshopIcon from 'grommet/components/icons/base/Workshop';
import Toast from 'grommet/components/Toast';
import ThumbVote from './thumbVote.jsx'
import StudentQuizGradesView from './StudentQuizGradesView.jsx';



class StudentLiveClassView extends React.Component {
  constructor() {
		super();
		this.handleRaiseHand = this.handleRaiseHand.bind(this);
		this.handleToastClose = this.handleToastClose.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.studentState.targetClass && nextProps.studentState.targetClass.isLive && this.props.studentState.targetClass.activeView === undefined) {
			console.log('Triggered')
			this.props.fetchClassData(this.props.activeView.id, 'student')
			fb.toggleStudentLiveClassStatus(this.props.activeView.id, this.props.auth.user.id, true)
		}

		if (!nextProps.studentState.targetClass) { //Handles updating target class when class ends
			let thisClass = this.props.classes.find(each => each.class_id === this.props.studentState.targetClass.id)
			thisClass.isLive = false
			console.log('thisClass ------> ', thisClass)
			this.props.updateStudentTargetClass(this.props.classes.find(each => each.class_id === this.props.studentState.targetClass.id))
			fb.stopFetchClassData(this.props.activeView.id)
		} 
	}

	componentWillUnmount() {
		if (this.props.studentState.targetClass.isLive) { // Handles when student leaves class after class has ended
			fb.toggleStudentLiveClassStatus(this.props.activeView.id, this.props.auth.user.id, false)
		}
		fb.stopFetchClassData(this.props.activeView.id)
	}

	componentWillMount() {
		if (this.props.studentState.targetClass.isLive) {
			this.props.fetchClassData(this.props.activeView.id, 'student')
		}
	}

	handleRaiseHand(e, incrementParticipation) {
		let studentId = this.props.auth.user.id;
		let classId = this.props.activeView.id;
		if (incrementParticipation) {
			fb.incrementParticipation(classId, studentId);
		}
		fb.toggleStudentHandRaiseStatus(classId, studentId);
		fb.updateHandRaiseQueue(classId, studentId);
	}

	handleToastClose () {
		let studentId = this.props.auth.user.id;
		if (this.props.activeView) {
			var classId = this.props.activeView.id;
		}
		fb.updateHandRaiseAcknowledgement(classId, studentId, 'acknowledge')
	}
	
  render() {
		var studentId = this.props.auth.user.id
		var liveView;
			if (!this.props.studentState.targetClass) {
				liveView = <div>loading</div>
			}
					else if (this.props.studentState.showGrades || !this.props.studentState.targetClass.isLive) {
						// liveView = <Default live={false}/>
						liveView = <StudentQuizGradesView
										targetClass={this.props.activeView}
										studentId={this.props.auth.user.id}
										quizGrades={this.props.quizGrades}
										getQuizDataForStudentInClass={this.props.getQuizDataForStudentInClass}
										toggleGrades={this.props.toggleGrades}
										participationData={this.props.participationData}
										getParticipationData={this.props.getParticipationData}
									/>
					} 
			else if(this.props.studentState.targetClass && this.props.studentState.targetClass.activeView){
				liveView = <QuizContainer/>
			} else if (this.props.studentState.targetClass && this.props.studentState.targetClass.thumbPoll) {
				liveView = <ThumbVote/>
			} 
			else if (this.props.studentState.targetClass && !this.props.studentState.targetClass.activeView) {
					liveView = <Default live={true} toggleGrades={this.props.toggleGrades}/>
			} else {
					liveView = <div></div>
			}
			if (this.props.studentState.targetClass.handRaisedQueue
				&& this.props.studentState.targetClass.students[studentId].handRaised) {
				let handRaisedQueue = this.props.activeView.handRaisedQueue;
				let lowestQueueTimeId = Object.values(handRaisedQueue).sort((a, b) => a.time - b.time)[0].studentId;
				if (studentId === lowestQueueTimeId) {
					var handRaiseLabel = "You are next in line!"
 				} else {
					var handRaiseLabel = 'Click to exit the queue';
				 }
				var queueIcon =  <UserExpert />
				var critical = true;
				var incrementParticipation = false;

			} else if (this.props.studentState.targetClass.communication && 
				this.props.studentState.targetClass.communication.hasOwnProperty(this.props.auth.user.id)) {
					var toast = 
				<Toast 
					style={{zIndex: 15}}
					status='ok'
					size="large"
					onClose={this.handleToastClose}>
					{this.props.activeView.teacher + ' is comming to help!'}
				</Toast>
					var handRaiseLabel = 'Raise your hand';
					var queueIcon =  <WorkshopIcon />
					var critical = false;

			} else {
				var handRaiseLabel = 'Raise your hand';
				var queueIcon =  <WorkshopIcon />
				var critical = false;
				var toast = <div></div>;
				var incrementParticipation = true;
			}

				return (
					<div>
							{liveView}
							{toast}

							{this.props.studentState.targetClass.isLive &&
							<Button 
								icon={queueIcon} 
								style={{position: "fixed", bottom: 30, right: 30}}
								label={handRaiseLabel}
								type={'submit'}
								primary={false}
								secondary={false}
								accent={false}
								critical={critical}
								plain={false} 
								onClick={(e) => {this.handleRaiseHand(e, incrementParticipation)}} 
							/>}

						</div>
				)
			
		}
}

function mapStateToProps(state) {
	return {
		activeView: state.studentClassView.targetClass,
		studentState: state.studentClassView,
		classes: state.studentClassView.classes,
		auth: state.auth,
		quizGrades: state.studentClassView.quizGrades,
		participationData: state.studentClassView.participationData
		// targetClass: state.studen
	}
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(StudentLiveClassView)