import React, {useEffect, useState, useMemo} from 'react';
import {useDropzone} from 'react-dropzone';
import axios from 'axios';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };

  const focusedStyle = {
    borderColor: '#2196f3'
  };

  const acceptStyle = {
    borderColor: '#00e676'
  };

  const rejectStyle = {
    borderColor: '#ff1744'
  };


function DropzoneComponent(props) {

    const [files, setFiles] = useState([]);
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
        } = useDropzone({
       accept: {
        'image/*': []
      },
      onDrop: acceptedFiles => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));
      }
    });

    const upload = () => {
      const uploadURL = 'https://api.cloudinary.com/v1_1/djqlphaha/image/upload';
      const uploadPreset = 'dryqolej';

      files.forEach(file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        axios({
          url: uploadURL,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: formData
        })
        .then(res => console.log(res))
        .catch(err => console.log(err))
      })
    }
      const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }), [
        isFocused,
        isDragAccept,
        isDragReject
      ]);



  const thumbs = files.map(file => (
    <div key={file.name}>
      <div >
        <img
          src={file.preview}

          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }} alt=""
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
  
    <section className="container"> 
      <div {...getRootProps({style})}>
        <input {...getInputProps()}/>
        <p> Drag 'n' drop some files here, or click to select files</p> 
        </div>
          <button style={{background: '#555555', border: 'none', padding: '15px 32px', color: 'white', textAlign: 'center' }} onClick={() => upload()}>upload</button> 
      <aside>
        {thumbs}
      </aside>
    </section>
  );
}
export default DropzoneComponent;