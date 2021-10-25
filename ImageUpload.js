import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { storage, db } from './firebase';
import firebase from 'firebase/compat/app';
import './imageUpload.css';

function ImageUpload({ username }) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //this is for the progress line , to see how much is left to uplaod
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                //whenever there is an error this part of code executes
                console.log(error);
                alert(error.message);
            },
            () => {
                //the actual uplaoding function
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });
                        // setting the progress bar back to its original mode 
                        //after the image gets uploaded 
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            }
        );
    };

    return (
        <div className="imageupload">
            <progress className="imageuplaod__progress" value={progress} max="100"/>
            <input
                type="text"
                placeholder='Enter a caption...'
                onChange={event => setCaption(event.target.value)}
                value={caption}
            />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
