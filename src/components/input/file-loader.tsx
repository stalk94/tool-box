import React from 'react';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { InputPaper, InputBaseCustom  } from './atomize';



function FileLoader({ ...props }) {
    return(
        <InputPaper {...props} >
            <FileUpload
                auto
                name="avatar"
                url="./uploadAvatar"
                accept=".gif .png, .jpg, .jpeg"
                mode="basic"
                customUpload
                uploadHandler={handleSubmit}
                chooseOptions={choseOptions}
            />
        </InputPaper>
    );
}