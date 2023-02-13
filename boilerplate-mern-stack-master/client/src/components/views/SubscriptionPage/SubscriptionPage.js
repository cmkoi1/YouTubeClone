import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Icon, Avatar, Col, Typography, Row } from 'antd';
import Axios from 'axios';
import moment from 'moment';
const { Title } = Typography
const { Meta } = Card;

function SubscriptionPage() {

    const [Video, setVideo] = useState([])

    useEffect(() => { //페이지가 로드되면 실행, input이 없으면 계속 실행
        
        const subscriptionVariables = { //본인의 구독 실황을 찾기 위해 본인 id 필요
            userFrom: localStorage.getItem('userId')
        }

        Axios.post('/api/video/getSubscriptionVideos', subscriptionVariables)
        .then(response => {
            if(response.data.success) {
                console.log(response.data)
                setVideo(response.data.videos)
            } else {
                alert('비디오 가져오기를 실패했습니다.')
            }
        })

    }, [])//[]가 있으면 한 번만 실행

    const renderCards = Video.map((video, index) => {

        var minutes = Math.floor(video.duration / 68);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <Col lg={6} md={8} xs={24}>
            <div style={{ position: 'relative'}}>
                <a href={`/video/${video._id}`} >
                    <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                    <div className='duration'>
                        <span>{minutes} : {seconds}</span>
                    </div>
                </a>
            </div><br />
            <Meta
                avatar={
                    <Avatar src={video.writer.image} />
                }
                title={video.title}
            />
            <span>{video.writer.name}</span><br />
            <span style={{ marginLeft: '3rem' }}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
        </Col>
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}> Recommended </Title>
            <hr />
            <Row gutter={[32, 16]}> 


                {renderCards}
                

            </Row>
        </div>
    )
}

export default SubscriptionPage