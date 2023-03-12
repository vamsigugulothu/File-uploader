import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([])
    const [file, setFile] = useState(null);
    const handleLogout = () => {
        axios.post('http://localhost:8000/logout', { withCredentials: false })
          .then(res => {
            if(res.status === 200){
                navigate('/');
            }
            console.log("looged out",res)
          })
          .catch(error => {
            console.log(error)
          });
    };

    useEffect(() => {
        axios.get("http://localhost:8000/files").then((res) => {
            setFiles(res.data)
        })
    }, [file])

    const handleFileChange = e => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        axios.post('http://localhost:8000/upload', formData).then(res => {
            if(res.status === 400) {
                navigate("/")
            }
        })
        .catch(err => console.error(err));
    };

    return (
        <>
           <h1>File uploader</h1>
           <div>
                <form onSubmit={handleSubmit}>
                    <input type="file" name="file" onChange={handleFileChange}/>
                    <button type="submit">Upload File</button>
                </form>
            </div>
           <button onClick={handleLogout}>Logout</button>
           <div>
                <h1>File List</h1>
                <ul>
                    {files?.map(file => (
                        <li key={file.name} style={{listStyle: "none"}}>
                            <a href={file.url} download>{file.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </>

    );
}

export default Dashboard;