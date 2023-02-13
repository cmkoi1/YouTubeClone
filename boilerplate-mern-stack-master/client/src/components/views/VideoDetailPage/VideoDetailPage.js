import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd';
import Axios from "axios";
import SideVideo from './Sections/SideVideo'; //SideVideo.js를 연결
import Subscribe from './Sections/Subscribe'; //Subscribe.js를 연결
import Comment from './Sections/Comment';
import LikeDislikes from './Sections/LikeDislikes';

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId //App.js 코드 때문에 가능
    const variable = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])

    useEffect(() => {
        
        Axios.post('/api/video/getVideoDetail', variable) //비디오 id를 같이 보내주기
            .then(response => {
                if(response.data.success) {
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert('비디오 정보를 가져오길 실패했습니다.')
                }
            })

        Axios.post('/api/comment/getComments', variable)
            .then(response => {
                if(response.data.success) {
                    setComments(response.data.comments)
                } else {
                    alert('코멘트 정보를 가져오는 것을 실패하였습니다.')
                }
            })
        
    }, [])

    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }

    if(VideoDetail.writer) { //이미지가 로딩 전에 렌더링되어 나는 오류를 방지
         // userFrom과 userTo이 다르면 버튼이 안 나오도록(작성자거나, 비회원)
        const subcribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />

        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
    
                    <div style={{ width: '100%', padding: '3rem 4rem'}}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
    
                        <List.Item
                            actions={[ <LikeDislikes video userId={localStorage.getItem('userId')} videoId={videoId} />, subcribeButton ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
    
                        </List.Item>
    
                        {/* Comments */}
                        <Comment refreshFunction={refreshFunction} commentLists={Comments} postId={videoId}/>
    
                    </div>
    
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
    
            </Row>
        )
    } else {
        return (
            <div>...loading</div>
        )
    }

    
}

export default VideoDetailPage