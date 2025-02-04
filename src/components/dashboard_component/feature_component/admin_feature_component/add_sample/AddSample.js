import { useState } from "react";
import AdminService from "../../../../../Services/admin_service/AdminService";
import Constants from "../../../../Constants";
import LoadingBar from "../../../../loading_bar_component/LoadingBar";

function AddSample() {

    const [loadingBar, setLoadingBar] = useState(false);

    // add sample intro video code
    const [sampleIntroVideo, setSampleIntroVideo] = useState(null);
    const handleSampleIntroVideo = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setSampleIntroVideo(file);
        } else {
            alert('Please select a video file');
            event.target.value = ''; // Clear the file input
            setSampleIntroVideo(null);
        }
    };

    const handleAddSampleIntroVideo = async () => {
        if (!sampleIntroVideo) {
            addSampleIntroVideoFieldsDisplayErrMsg('Please upload sample introduction video');
        } else if (sampleIntroVideo.size > 5 * 1024 * 1024) { 
            addSampleIntroVideoFieldsDisplayErrMsg('Sample introduction video file size exceeds the maximum limit of 5MB');
        } else {
            setLoadingBar(true);
            const formData = new FormData();
            formData.append('sampleIntroVideo',sampleIntroVideo);

            try { 
                const responseData = await AdminService.addSampleIntroVideo(formData); 
                console.log(responseData);
                addSampleIntroVideoFieldsDisplaySucMsg('Sample introduction Video Added Successfully');
            } catch (error) {
                handleAddSampleIntroVideoErrors(error.message);
            } finally {
                setLoadingBar(false);
            }

        }
    }

    const handleAddSampleIntroVideoErrors = (errorStatus) => {
        if (Constants.FILES_NOT_UPLOADED === errorStatus)
            addSampleIntroVideoFieldsDisplayErrMsg("Files could not uploaded");
        else
            addSampleIntroVideoFieldsDisplayErrMsg("Could not process your request");
    }

    //Fields for to display err msg div and label
    const [messageColor, setMessageColor] = useState(Constants.MESSAGE_COLOR);
    const [errMsgDiv, setErrMsgDiv] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    //JS for to display err msg
    const addSampleIntroVideoFieldsDisplayErrMsg = (errorMessage) => {
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
        }, Constants.SET_TIME_OUT_FOR_ERROR_MSG);
    }
    //JS for to display success msg
    const addSampleIntroVideoFieldsDisplaySucMsg = (errorMessage) => {
        setMessageColor('green');
        setErrMsg(errorMessage);
        setErrMsgDiv(true);
        setTimeout(() => {
            setErrMsg("");
            setErrMsgDiv(false);
            setMessageColor('#be3144');
        }, Constants.SET_TIME_OUT_FOR_SUCCESS_MSG);
    }
    const customCssForMsg = {
        fontSize: 'medium',
        fontWeight: '700',
        color: messageColor,
    }

    return (
        <div>
            { loadingBar && <LoadingBar /> }
            <div className="add-sample-intro-video-file mt-4">
                <label>Upload Sample Intro Video</label>
                <input
                    type="file"
                    className="form-control"
                    id="AddSampleIntroVideoFile"
                    accept="video/*"
                    onChange={handleSampleIntroVideo}
                />
                <div className='mt-2'>
                    {errMsgDiv &&
                        <div style={customCssForMsg}>
                            <label>{errMsg}</label>
                        </div>}
                </div>
                <button
                    className="dashboard-button"
                    onClick={handleAddSampleIntroVideo}
                >
                    Upload
                </button>
            </div>
        </div>
    );

}

export default AddSample;