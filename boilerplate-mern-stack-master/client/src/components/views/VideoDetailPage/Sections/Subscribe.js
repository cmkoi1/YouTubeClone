import Axios from 'axios'
import React, { useEffect, useState } from 'react'

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {

        let variable = { userTo: props.userTo } //몇 명의 구독자가 있는지
        
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if(response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('구독자 수 정보를 받아오지 못했습니다.')
                }
            })

        let subscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }

        Axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response => {
                if(response.data.success) {
                    setSubscribed(response.data.subscribed)
                } else {
                    alert('정보를 받아오지 못했습니다.')
                }
            })

    }, [])

    const onSubscribe = () => {

        let subscribedVariable = { //자신과 업로더의 id가 필요

            userTo: props.userTo,
            userFrom: props.userFrom

        }

        if(Subscribed) { //이미 구독중이면
            
            Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1) //현재 구독자 수 -1
                        setSubscribed(!Subscribed) //현 상태와 반대
                    } else {
                        alert('구독 취소하는데 실패했습니다.')
                    }
                })

        } else { //구독 중이 아니면

            Axios.post('/api/subscribe/subscribe', subscribedVariable)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독하는데 실패했습니다.')
                    }
                })

        }

    }

    return (
        <div>
            <button 
                style={{
                    backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000' }`,
                    borderRadius: '4px', color: 'white', padding: '10px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe