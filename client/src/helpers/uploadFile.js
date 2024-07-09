const url=`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/auto/upload`

console.log(url);
const uploadFile=async(file)=>{
    try{
    const formData=new FormData();
    formData.append('file',file);
    formData.append("upload_preset","Chatify-file");
    const response=await fetch(url,{
        method:'post',
        body:formData
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData=await response.json();
    return responseData;
    }catch(err){
        console.error('Error uploading file:', err);
    }

}
export default  uploadFile