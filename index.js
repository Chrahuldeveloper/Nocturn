const launchBtn = document.getElementById("launchBtn");

launchBtn.addEventListener("click", async () => {

    try {

        const tabs = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        const tab = tabs[0];


        if (!tab) {
            console.log("No active tab found.");
            return;
        }


        if (!tab.url) {
            console.log("No URL found for the current tab.");
            return;
        }


        const pdfUrl = tab.url;

        if (!pdfUrl.toLowerCase().includes(".pdf")) {
            console.log(
                "The current tab is not a PDF."
            );

            return;
        }

        const readerUrl =
            chrome.runtime.getURL(
                "reader/read.html"
            );


        const url =
            readerUrl +
            "?pdf=" +
            encodeURIComponent(pdfUrl);


  
        chrome.tabs.create({
            url: url
        });

    } catch (error) {

        console.error(
            error
        );

    }

});