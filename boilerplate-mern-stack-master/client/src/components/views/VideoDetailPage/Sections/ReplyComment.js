import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)

    useEffect(() => { //답글이 몇 개인지

        let commentNumber = 0;
        
        props.commentLists.map((comment) => {
            if(comment.responseTo === props.parentCommentId) {
                commentNumber ++
            }
        })

        setChildCommentNumber(commentNumber)

    }, [props.commentLists])

    // 답글이 여러 개가 될 수 있으니까 변수로 만들기
    const renderReplyComment = (parentCommentId) =>
        props.commentLists.map((comment, index) => ( //댓글 정보 가져오기
            <React.Fragment> 
                {
                    comment.responseTo === parentCommentId &&
                        <div style={{ width: '80%', marginLeft:'40px'}}>
                            <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.videoId}/>
                            <ReplyComment refreshFunction={props.refreshFunction} commentLists={props.commentLists} parentCommentId={comment._id} postId={props.videoId}/>
                        </div>
                }
            </React.Fragment> //댓글 아이디와 아이디의 답글만 랜더링
    ))

    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }

    return (
        <div>

            {ChildCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick={onHandleChange}>
                View {ChildCommentNumber} more comment(s)
                </p>
            }

            {OpenReplyComments &&
                renderReplyComment(props.parentCommentId)
            }

        </div>
    )
}

export default ReplyComment