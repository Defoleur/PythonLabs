export default function ErrorMessageProvider(message : string){
    if (message === "Failed to fetch"){
        return "Server is not responding. Please try again later!";
    }
    return message;
}
