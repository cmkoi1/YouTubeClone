import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DisLikeAction, setDisLikeAction] = useState(null)

    let variable = { } //비디오에 대한 거면 videoId, 댓글에 대한 거면 commentId

    if(props.video) {
        variable = { videoId: props.videoId, userId: props.userId  }
    } else {
        variable = { commentId: props.commentId, userId: props.userId }
    }

    useEffect(() => {
        Axios.post('/api/like/getLikes', variable )
            .then(response => {
                if(response.data.success) {

                    // 받은 좋아요 수
                    setLikes(response.data.likes.length)

                    // 내가 누른 좋아요 유무
                    response.data.likes.map(like => {
                        if(like.userId === props.userId) { //비디오나 코멘트의 모든 like와 내가 누른 like가 같으면
                            setLikeAction('liked')
                        }
                    })

                } else {
                    alert('Likes에 대한 정보를 가져오지 못했습니다.')
                }
            })

        Axios.post('/api/like/getDislikes', variable )
            .then(response => {
                if(response.data.success) {

                    // 받은 싫어요 수
                    setDislikes(response.data.dislikes.length)

                    // 내가 누른 싫어요 유무
                    response.data.dislikes.map(dislike => {
                        if(dislike.userId === props.userId) { //비디오나 코멘트의 모든 dislike와 내가 누른 dislike가 같으면
                            setDisLikeAction('disliked')
                        }
                    })

                } else {
                    alert('DisLikes에 대한 정보를 가져오지 못했습니다.')
                }
            })

    }, [])

    const onLike = () => {

        if(LikeAction === null) { //좋아요 클릭 안 되어있을 때

            Axios.post('/api/like/upLike', variable)
                .then(response => {
                    if(response.data.success) {

                        setLikes(Likes +1)
                        setLikeAction('liked')

                        if(DisLikeAction !== null ) { //싫어요가 클릭되어 있었을경우
                            setDisLikeAction(null)
                            setDislikes(Dislikes -1)
                        }

                    } else {
                        alert('Like를 올리지 못했습니다.')
                    }
                })
        } else { //좋아요가 클릭 되어 있을 때

            Axios.post('/api/like/unLike', variable)
                .then(response => {
                    if(response.data.success) {
                        setLikes(Likes -1)
                        setLikeAction(null)
                    } else {
                        alert('Like를 내리지 못했습니다.')
                    }
                })

        }

    }

    const onDisLike = () => {

        if(DisLikeAction !== null) {
            
            Axios.post('/api/like/unDislike', variable)
                .then(response => {
                    if(response.data.success) {
                        setDislikes(Dislikes -1)
                        setDisLikeAction(null)
                    } else {
                        alert('dislike를 지우지 못했습니다.')
                    }
                })

        } else {
            
            Axios.post('/api/like/upDislike', variable)
                .then(response => {
                    if(response.data.success) {
                        setDislikes(Dislikes +1)
                        setDisLikeAction('disliked')

                        if(LikeAction !== null) {
                            setLikeAction(null)
                            setLikes(Likes -1)
                        }
                    } else {
                        alert('dislike를 지우지 못했습니다.')
                    }
                })

        }

    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked'? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft:'8px', cursor:'auto' }}> {Likes} </span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                        theme={DisLikeAction === 'disliked'? 'filled' : 'outlined'}
                        onClick={onDisLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft:'8px', cursor:'auto' }}> {Dislikes} </span>
            </span>
        </div>
    )
}

export default LikeDislikes