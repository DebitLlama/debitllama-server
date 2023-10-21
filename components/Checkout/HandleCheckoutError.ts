export function handleError(msg: string) {
    // error function to display a snackbar is side effecty, vanilla magic
    const errorDisplay = document.getElementById("error-display") as HTMLDivElement;
    const errorText = document.getElementById("error-text") as HTMLParagraphElement;
    errorText.textContent = msg;

    if (errorDisplay.classList.contains("hide")) {
        errorDisplay.classList.remove("hide");
    }
    if (errorDisplay.classList.contains("fade-out-element")) {
        errorDisplay.classList.remove("fade-out-element")
    }
    errorDisplay.classList.add("fade-in-element");
    errorDisplay.classList.add("show");
    setTimeout(() => {
        // Time out biach!
        errorDisplay.classList.add("fade-out-element");
        errorDisplay.classList.remove("show");
        errorDisplay.classList.remove("fade-in-element");
        errorDisplay.classList.add("hide");
    }, 5000);
}


