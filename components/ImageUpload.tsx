import Dropzone from 'react-dropzone';

const ImageUpload = () => {
  return (
    <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Add Image Here</p>
        </div>
      )}
    </Dropzone>
  );
};

export default ImageUpload;
