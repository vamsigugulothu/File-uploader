import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';


const Dashboard = () => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("accessToken")
    console.log("token",token)
    const userData = jwtDecode(token);
    const navigate = useNavigate();
    const [files, setFiles] = useState([])
    const [file, setFile] = useState("");


    const handleLogout = () => {
        window.location.href = 'https://accounts.google.com/logout';
    };

    const listFiles = () => {
        axios.get("http://localhost:5000/files", { withCredentials: true }).then((res) => {
            console.log(res)
            setFiles(res.data)
        })
    }

    useEffect(() => {
        listFiles();
    }, [])

    const handleFileChange = e => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        axios.post('http://localhost:5000/upload', formData, { withCredentials: true }).then(res => {
            console.log(res);
        })
        .catch(err => console.error(err));
        listFiles();
        setFile("");
    };

    const handleDownload = async (file) => {
        const response = await fetch(`http://localhost:5000/download/${file.name}`, {
            credentials: 'include'
         });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
           <h1>File uploader</h1>
            <div>
                {userData?.name} <button onClick={handleLogout}>Logout</button>
            </div>
           <div>
                <form onSubmit={handleSubmit}>
                    <input type="file" name="file" onChange={handleFileChange} required/>
                    <button type="submit" disabled={!file}>Upload File</button>
                </form>
            </div>
           <div>
                <h1>File List</h1>
                <ul>
                    {files?.map(file => (
                        <li key={file.name} style={{listStyle: "none"}}>
                            <a href={file.url} download onclick={e=> e.stopPropagation()}>{file.name}</a>  
                            <button onClick={() => handleDownload(file)}>Click me</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>

    );
}

export default Dashboard;