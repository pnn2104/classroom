import actionTypes from "../actions/types.js";
import classes from "../../data/teacherClassViewData";
import axios from "axios";

export function teacherClassViewReducer(
  state = {
    classes: [],
    showClassBuilderModal: false,
    newClassName: "",
    newClassSubject: "",
    newClassQuarter: "",
    newClassYear: "",
    subjects: [],
    allStudents: [],
    targetClass: {},
    selectedStudent: {},
		showQuizBuilderModal: false,
		quizzes: {},
		students: [],
		newQuiz: {questions: [], subject: {}}
  },
  action
) {
  switch (action.type) {
    case actionTypes.GET_TEACHERS_CLASSES:
      //console.log('action at reducer', action.classes);
      return { ...state, classes: action.classes };
    case actionTypes.TOGGLE_CLASS_BUILDER_MODAL:
      return { ...state, showClassBuilderModal: !state.showClassBuilderModal };
    case actionTypes.UPDATE_NEW_CLASS_NAME_ACTION:
      //console.log('changeName action', action.event.target.value)
      return { ...state, newClassName: action.event.target.value };
    case actionTypes.UPDATE_NEW_CLASS_SUBJECT_ACTION:
      return { ...state, newClassSubject: action.event.target.value };
    case actionTypes.SELECT_EXISTING_SUBJECT_ACTION:
			return { ...state, newClassSubject: action.subject.suggestion.value };
    case actionTypes.UPDATE_NEW_CLASS_QUARTER_ACTION:
      return { ...state, newClassQuarter: action.quarter.option };
    case actionTypes.UPDATE_NEW_CLASS_YEAR_ACTION:
      //console.log('reducer action.year', action.year.option)
			return { ...state, newClassYear: action.year.option };
		case actionTypes.ADD_NEW_CLASS_ACTION:
			console.log('reducer add class', action.classObj)
			return { ...state}
    case actionTypes.GET_ALL_SUBJECTS:
      const subjects = action.subjects.map(each => {
        return {
          value: each.name,
          sub: each
        };
      });
      //console.log('at reducees subjects', action.subjects);
      return { ...state, subjects: subjects };
    case actionTypes.GET_ALL_STUDENTS_ACTION:
      const studentNames = action.students.map(each => {
        return {
          value: each.first_name + " " + each.last_name,
          sub: each
        };
			});
      return {
				...state,
				targetClass: {
					...state.targetClass
				},
        students: action.students,
        studentNames: studentNames
      };
    case actionTypes.UPDATE_TARGET_CLASS_ACTION:
      //console.log('reducer', action.targetClass)
      const targetClass = action.targetClass;
      targetClass.quizzes = {};
      targetClass.isLive = false;
      targetClass.activeView = false;
      return { ...state, targetClass: targetClass };
    case actionTypes.GET_STUDENTS_BELONGS_TO_A_CLASS_ACTION:
      //console.log('action.students in a class at reducers', action.students)
      const studentsObj = {};
      for (var i = 0; i < action.students.length; i++) {
        let student_id = action.students[i].id;
        studentsObj[student_id] = {
          id: student_id,
          name:
            action.students[i].first_name + " " + action.students[i].last_name,
          isHere: false,
          email: action.students[i].email,
          quizzes: {}
        };
      }
			return {
				...state, 
				targetClass: {
					...state.targetClass,
					students: studentsObj
				} 
			};
		case actionTypes.CLASS_GO_LIVE_ACTION:
			const goLiveClass = Object.assign({}, state.targetClass);
			goLiveClass.isLive = !state.targetClass.isLive;
			return {...state, targetClass: goLiveClass}
    case actionTypes.FETCH_CLASS_DATA:
      return { ...state };
		case actionTypes.UPDATE_CLASS_DATA_TEACHER:
			// console.log()
      //console.log(action.classData)
      return { ...state, targetClass: action.classData };
    case actionTypes.SELECT_EXISTING_STUDENT_TO_ADD:
			//console.log('selected student', action.student.suggestion)
			const studentsInClass = state.students.slice()
			studentsInClass.push(action.student.suggestion)	
      return {...state, 
				selectedStudent: action.student.suggestion,
				students: studentsInClass,
			} 
/***************************************** FIXING THIS ***************************************/
		case actionTypes.ADD_A_STUDENT_TO_CLASS_ACTION:
			console.log('studentssss', action.students)
			const withNewAddedStudents = {};
      for (var i = 0; i < action.students.length; i++) {
        let student_id = action.students[i].id;
        withNewAddedStudents[student_id] = {
          id: student_id,
          name:
            action.students[i].first_name + " " + action.students[i].last_name,
          isHere: false,
          email: action.students[i].email,
          quizzes: {}
        };
      }
			return {
				...state, 
				targetClass: {
					...state.targetClass,
					students: withNewAddedStudents
				} 
			};
			
		/**************************** QUIZ **************************/
    case actionTypes.SHOW_QUIZ_MODAL_ACTION:
			return { ...state, showQuizBuilderModal: !state.showQuizBuilderModal };
		// case actionTypes.CLOSE_QUIZ_BUILDER_MODAL:
		// 	return { ...state, showClassBuilderModal: !state.show}
		case actionTypes.SET_NEW_QUIZ_NAME_ACTION:	
			return {
				...state,
				newQuiz: {
					...state.newQuiz,
					name: action.event.target.value
				}
			}
		case actionTypes.SET_NEW_QUIZ_SUBJECT_ACTION:
			return {
				...state,
				newQuiz: {
					...state.newQuiz,
					subject: action.event.target.value
				}
			}
		case actionTypes.SET_NEW_QUIZ_SUBJECT_BY_SELECTION_ACTION:
			return {
				...state,
				newQuiz: {
					...state.newQuiz,
					subject: action.event.suggestion
				}
			}
		case actionTypes.SET_QUESTION_NUMBER_ACTION:
			const questions = state.newQuiz.questions.slice()
			questions.push({question: "", answers: []})
			return {
				...state, 
				newQuiz: {
					...state.newQuiz,
					questions: questions
				}
			}
		case actionTypes.ADD_QUESTION_TEXT_ACTION:
			const questionsWithText = state.newQuiz.questions.slice()
			for (var j = 0; j < questionsWithText.length; j++) {
				//console.log('j === action.index', j === action.index)
				if (j === action.index) {
					questionsWithText[action.index].question = action.event.target.value
				}
			}
			return {
				...state,
				newQuiz: {
					...state.newQuiz,
					questions: questionsWithText
				}
			}
		case actionTypes.ADD_ANSWER_ACTION:
			const questionsAddAnswers = state.newQuiz.questions.slice();
			for (var k = 0; k < questionsAddAnswers.length; k++) {
				if (k === action.index) {
					questionsAddAnswers[action.index].answers.push({text: "", isCorrect: false})
				}
			}
			return {
				...state,
				newQuiz: {
					...state.newQuiz,
					questions: questionsAddAnswers
				}
			}

			case actionTypes.ADD_ANSWER_TEXT_ACTION:
				const questionsAddAnswerText = state.newQuiz.questions.slice();
				for (var l = 0; l < questionsAddAnswerText.length; l++) {
					if (l === action.questionIndex) {
						const question_answers = questionsAddAnswerText[action.questionIndex].answers;
						for (var m = 0; m < question_answers.length; m++) {
							if (m === action.answerIndex) {
								question_answers[action.answerIndex].text = action.event.target.value
							}
						}
					}
				}
				return {
					...state,
					newQuiz: {
						...state.newQuiz,
						questions: questionsAddAnswerText
					}
				}
			case actionTypes.CHOOSE_CORRECT_ANSWER_ACTION:
				//console.log(action.questionIndex, action.answerIndex)
				const questionsCheckCorrect = state.newQuiz.questions.slice();
				for (var n = 0; n < questionsCheckCorrect.length; n++) {
					if (n === action.questionIndex) {
						const question_answers = questionsCheckCorrect[action.questionIndex].answers;
						for (var p = 0; p < question_answers.length; p++) {
							if (p === action.answerIndex) {
								//console.log('isCorrect', state.newQuiz.questions[action.questionIndex].answers[action.answerIndex].isCorrect)
								question_answers[action.answerIndex].isCorrect = !state.newQuiz.questions[action.questionIndex].answers[action.answerIndex].isCorrect
							}
						}
					}
				}
				return {
					...state,
					newQuiz: {
						...state.newQuiz,
						questions: questionsCheckCorrect
					}
				}
		case actionTypes.ADD_NEW_QUIZZES:
			console.log('refetched quizzes at reducer', action.quizzes)
			const refetched = action.quizzes;
			refetched.map((eachQuiz) => {
				eachQuiz.questions = eachQuiz.questions.reduce((acc, eachQuestion) => {
					let qId = eachQuestion.id
					acc[qId] = eachQuestion
					return acc
				}, {})
				return eachQuiz
			})
			refetched.map((eachQuiz) => {
				for (var key in eachQuiz.questions) {
					console.log('eachQuiz.questions[key].answers', eachQuiz.questions[key].answers)
					eachQuiz.questions[key].answers = eachQuiz.questions[key].answers.reduce((accumulator, each) => {
						let eachAnswerId = each.id
						accumulator[eachAnswerId] = each
						return accumulator
					}, {})
					//console.log('answers arrat', eachQuiz.questions[key].answers)
				}
				return eachQuiz
			})
			refetched.reduce((acc, quiz) => {
				let quizsId = quiz.id;
				acc[quizsId] = quiz;
				return acc;
			}, {})
			return {
				...state,
				quizzes: refetched,
				showQuizBuilderModal: !state.showQuizBuilderModal
			}
		case actionTypes.FETCH_QUIZZES:
			const quizzes = action.quizzes;
			//console.log('reducer action.quizzes', action.quizzes)
			quizzes.map((eachQuiz) => {
				eachQuiz.questions = eachQuiz.questions.reduce((acc, eachQuestion) => {
					let questionId = eachQuestion.id
					acc[questionId] = eachQuestion
					return acc
				}, {})
				return eachQuiz
			})
			quizzes.map((eachQuiz) => {
				for (var key in eachQuiz.questions) {
					var answerArray = eachQuiz.questions[key].answers
					eachQuiz.questions[key].answers = eachQuiz.questions[key].answers.reduce((accumulator, each) => {
						let answerId = each.id
						accumulator[answerId] = each
						return accumulator
					}, {})
					//console.log('answers arrat', eachQuiz.questions[key].answers)
				}
				return eachQuiz
			})
			quizzes.reduce((acc, quiz) => {
				let quizId = quiz.id;
				acc[quizId] = quiz;
				return acc;
			}, {})
			console.log('modified quizzes', quizzes);
			return {
				...state, quizzes: quizzes
			}
    default:
      return state;
  }
}
