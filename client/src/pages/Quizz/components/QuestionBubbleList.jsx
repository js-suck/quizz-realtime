import React from "react";

const QuestionStepBubble = ({ question, index, currentQuestion }) => {
    return (
        <div
            className={` flex w-10 h-10 items-center  m-10 justify-center rounded-full border-2 border-slate-500 ${
                question?.id === currentQuestion?.id ? 'bg-slate-800' : 'bg-slate-300'
            }`}
        >
            {index + 1}
        </div>
    );

}


export const QuestionStepBubbleList = ({ questions, currentQuestion }) => {
    return (
        <div className={'flex justify-center items-center'}>
            {questions.map((question, index) => (
                <QuestionStepBubble key={question?.id} question={question} index={index} currentQuestion={currentQuestion} />
            ))}
        </div>
    );

}
