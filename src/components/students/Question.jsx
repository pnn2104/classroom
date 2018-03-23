import React from 'react';
import Answers from './Answers.jsx'
import Card from 'grommet/components/Card';
import Tile from 'grommet/components/Tile';
// import Tile from 'grommet/components/Tile';
import Section from 'grommet/components/Section';
import Label from 'grommet/components/Label';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Animate from 'grommet/components/Animate';


class Question extends React.Component {
  constructor(props) {
    super(props);
  }
 
  
render() {
  // let studentId = this.props.auth.userId
   let studentId = '37'
   let classId = '25'
   //let currentQuestion = this.props.passedProps.class[classId].students[studentId].currentQuestion
   console.log('this.props.passedProps', this.props.question)
   let answerArray = Object.keys(this.props.currentQuestionsAnswers)
   //let currentQuestion = this.props.class.students[this.props.auth.user.userId].currentQuestion
   
   //let questionText = this.props.passedProps.class[classId].quizzes[this.props.class[classId].activeView].questions[currentQuestion].text
  return (
    <Section >
        <Animate enter={{"animation": "fade", "duration": 1000, "delay": 0}}keep={true}>
          <Label>

              {this.props.question.text}                
            
          </Label>
        
          <List>
              <ol>
                {answerArray.map((answerNum, i) => (
                <Answers key={i} 
                  answersText={this.props.question.answers}
                  answerNum={answerNum} 
          
                />
                ))}
              </ol>
        </List>
      </Animate>
        {/* <button>Submit Answer</button> */}
     </Section>
  )
}
}

const questionCSS = {border: 'solid'}

export default Question;
