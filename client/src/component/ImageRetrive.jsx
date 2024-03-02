import React from 'react'
import axios from 'axios'

const ImageRetrive = () => {
    const handelRetrive = async() => {
        const snd={
            name:'1708150516285-bezkoder-avatar2.jpg'
        }
        const y = await axios({
            method: 'post',
            url: 'http://localhost:3000/api/image/images',
            data:snd
            
        });
        console.log(y.data);
    }
    return (
        <div className="container my-5">
            <button type="submit" className="btn btn-primary" onClick={handelRetrive}>Retrive</button>
        </div>
    )
}

export default ImageRetrive