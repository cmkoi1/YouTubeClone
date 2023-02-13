import Axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {

    const videoId = props.postId;
    const user = useSelector(state => state.user);
    const [commentValue, setcommentValue] = useState("")

    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();     //버튼을 눌렀을 때 페이지 리프레시가 되지 않도록

        const variables = {
            content: commentValue,
            writer: user.userData._id, //redux에서 가져오는 방법 
            postId: videoId
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.result)
                    setcommentValue("")
                    //debugger
                    props.refreshFunction(response.data.result)
                } else {
                    alert('커맨드를 저장하지 못했습니다.')
                }
            })
    }

    return (
        <div>
            <br />
            <p> Replies </p>
            <hr />

            {/* Comment Lists */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo && //답글이 없는 댓글만 출력
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId}/>
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={videoId} commentLists={props.commentLists}/>
                    </React.Fragment>
                )
            ))}


            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit} >
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성해 주세요"

                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>    
            </form>
        </div>
    )
}

export default Comment