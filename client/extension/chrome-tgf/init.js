window.onload = () => {
    function onClick() {
        const url = window.location.href;

        console.log(document.cookie);
        alert(`video url : ${url}`);
    }

    function AddButtons(container) {
        const btn = document.createElement("input");
        btn.value = "TGF";
        btn.type = "button";
        btn.id = "tgf-button";

        container.appendChild(btn);
        btn.addEventListener("click", onClick);
    }

    function getContainer() {
        return document.querySelectorAll(
            "#info div.ytd-video-primary-info-renderer"
        )[0];
    }

    function checkContainer() {
        const container = getContainer();

        if (container === undefined) {
            setTimeout(() => {

                checkContainer();
            }, 1000);
        } else {
            AddButtons(container);
        }
    }

    checkContainer();

}

console.log("test");