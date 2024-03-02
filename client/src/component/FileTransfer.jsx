import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './mycss.css'

function FileTransferComponent() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [filenames, setFilenames] = useState([]);
    const [users, setUsers] = useState([]);
    const [fileName, setFileName] = useState('');
    const [selected, setSelected] = useState('');
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        if (user.length === 0) {
            navigate("/");
        } else {
            getUser();
        }
    }, []);

   

    const handleUploadSubmit = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('to', selected);
            formData.append('from', user[0]._id);

            axios.post('http://192.168.6.65:3000/transfer/upload', formData)
                .then(() => {
                    setSelectedFile(null);
                    setFileName('');
                    getData()
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                });
        }
    };
    useEffect(() => {
        if (selected) {
            getData();
        }
    }, [handleUploadSubmit]);

    const handleDelete = (filename) => {
        axios.delete(`http://192.168.6.65:3000/transfer/delete/${filename}`)
            .then(() => {
                getData();
            })
            .catch((error) => {
                console.error('Error deleting file:', error);
            });
    };

    const getData = () => {
        const snd = {
            from: user[0]._id,
            to: selected
        };
        axios.post('http://192.168.6.65:3000/transfer/filenames', snd)
            .then(response => {
                setFilenames(response.data);
            })
            .catch(error => {
                console.error('Error fetching filenames:', error);
            });
    };

    const getUser = () => {
        axios.get('http://192.168.6.65:3000/api/user/getusers')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setFileName(file.name);
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleDownload = (filename) => {
        axios.get(`http://192.168.6.65:3000/transfer/download/${filename}`, { responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                link.click();
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    };

    const sortedFilenames = [...filenames].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Group filenames by date
    const groupedFilenames = {};
    sortedFilenames.forEach(filename => {
        const date = new Date(filename.date).toLocaleDateString();
        if (!groupedFilenames[date]) {
            groupedFilenames[date] = [];
        }
        groupedFilenames[date].push(filename);
    });

    return (
        <div className="container" style={{ height: '100vh' }}>
            <div className='row no-gutters my-5 px-5' style={{ height: '100vh' }}>
                <div className="col-6 col-md-4">
                    <table className="table table-striped">
                        <tbody>
                            {users.filter((u) => u._id !== user[0]._id).map((u) => (
                                <tr key={u._id}>
                                    {(selected === u._id) ? (
                                        <th scope="row">{u.name}</th>
                                    ) : (
                                        <td onClick={() => setSelected(u._id)}>{u.name}</td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="col-12 col-sm-6 col-md-8 px-5">
                    {selected && (
                        <>
                            {Object.keys(groupedFilenames).map(date => (
                                <div key={date}>
                                    <br /><div class="d-flex justify-content-center"><span class="badge badge-warning">{date}</span></div><br />
                                    {groupedFilenames[date].map(filename => (
                                        <><div key={filename.orgname} className={user[0]._id === filename.from ? "d-flex flex-row-reverse" : "d-flex flex-row"}>
                                            <button type="button" className={user[0]._id === filename.from ? "btn btn-info my-1" : "btn btn-primary my-1"} onClick={() => handleDownload(filename.orgname)}>
                                                <b>{filename.name}</b><sub>   Download</sub>
                                            </button>
                                            {/* <button type="button" className="btn btn-danger btn-sm mx-1" onClick={() => handleDelete(filename.orgname)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button> */}
                                        </div><br /></>
                                    ))}
                                </div>
                            ))}
                            <div className='mybottomstyle'>

                                <div className="custom-file mb-3">
                                    <input
                                        type="file"
                                        className="custom-file-input"
                                        id="customFile"
                                        name="filename"
                                        onChange={handleFileUpload}
                                    />
                                    <label className="custom-file-label" htmlFor="customFile">
                                        {fileName || 'Choose file'}
                                    </label>
                                </div>
                                <button type="button" className="btn btn-info mx-1 " onClick={handleUploadSubmit} disabled={!selectedFile}>
                                    Upload
                                </button>
                              

                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FileTransferComponent;
