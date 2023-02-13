import React, { useState } from "react"; //익스텐션 다운 시 rfce 단축키로 바로 생성 가능
import { Typography, Button, Form, message, Input, Icon } from 'antd'; //ANT DESIGN
import Dropzone from 'react-dropzone';
import Axios from "axios";
import { useSelector } from "react-redux";


const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" }
]

const CategoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" }
]

function VidoeoUploadPage(props) { //펑셔널 컴포넌트 생성
    
    const user = useSelector(state => state.user); //Redux의 state에 가서 user를 가져와 저장
    const [VideoTitle, setVideoTitle] = useState("") //처음 state은 빈 스트림으로, 이름은 겹치지 않게 VideoTitle
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0) //Private=0, Public=1
    const [Category, setCategory] = useState("Film & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onTitleChange = (e) => {
        console.log(e.currentTarget) //e가 뭔지 콘솔 창에서 확인
        setVideoTitle(e.currentTarget.value) //e는 이벤트를 뜻함
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const onDrop = (files) => {
        //files 파라미터에 파일의 정보가 담겨 있음, 파라미터로 파일을 받음
        let formData = new FormData
        const config = {
            header: {'content-type': 'multpart/form-data'}
        }
        formData.append("file", files[0]) //파일을 보내줌
        //위의 코드가 없으면 서버에 파일을 보낼 때 오류가 생김
        Axios.post('/api/video/uploadfiles', formData, config) //Axios: 리퀘스트를 서버에 보내고 받을 때 쓰는 라이브러리
            .then(response => { //서버 처리에 대한 response를 가져옴
                if(response.data.success) {//성공
                    console.log(response.data) //서버에서 파일 경로 url, 이름을 받음

                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }
                    //썸네일 및 비디오 파일 주소, 비디오 러닝타임과 같은 정보를 state에 저장해 준다.
                    setFilePath(response.data.url)

                    Axios.post('/api/video/thumbnail', variable) //위의 variavble 값 넣어서 서버에 보내 줌
                    .then(response => {
                        if(response.data.success) {
                            console.log(response.data)
                            setDuration(response.data.fileDuration)
                            setThumbnailPath(response.data.url)
                            
                        } else {
                            alert('썸네일 생성에 실패했습니다.')
                        }
                    })
            
                } else{ //실패
                    alert('비디오 업로드를 실패했습니다.')
                }
            })


    }

    const onSubmit = (e) => {
        e.preventDefault(); //원래 기능을 방지
        
        const variables = { //Redux를 통해 값을 가져옴
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath,
        }

        Axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data)
                    message.success('성공적으로 업로드를 했습니다.')

                    setTimeout(() => {
                        props.history.push('/')
                    }, 3000); //3초 뒤 랜딩 페이지로 이동

                } else {
                    alert('비디오 업로드에 실패 했습니다.')
                }
            })
    }



    return (
        <div style={{maxWidth:'700px', margin:'2rem auto' }}>
            <div style={{textAlign:'center', marginBottom:'2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                    {/* Drop zone */}

                    <Dropzone
                    onDrop={onDrop}
                    multiple={false} //파일 여러 개를 올리면 true
                    maxSize={1000000000} //사이즈 조정
                    >
                    {({ getRootProps, getInputProps }) => (
                        <div style={{width: '300px', height: '240px', border: '1px solid lightgray', display:'flex',
                        alignItems:'center', justifyContent:'center'}} {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{fontSize:'3rem'}} />
                        </div>
                    )}

                    </Dropzone>
                    {/* Thumbnail 썸네일 부분 */}

                    {ThumbnailPath && //ThumbnailPath가 있을 때만 렌더링되도록
                    <div>
                        <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                    </div>
                    }
                </div>

                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    Value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br />
                <br />
                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option> //key 값이 있어야 에러나지 않음
                    ))}                
                </select>
                <br />
                <br />
                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option> //key 값이 있어야 에러나지 않음
                    ))}
                </select>
                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>

            </Form>

        </div>
    )
}

export default VidoeoUploadPage //다른 파일에서 컴포넌트를 이용할 수 있게 export