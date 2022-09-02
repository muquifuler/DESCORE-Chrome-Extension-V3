// background.js

const HACKEN = require('./hacken.json'); // Hacken
const CERTIK = require('./certik.json'); // Certik
const DIRECT = require('./direct.json'); // Direct

async function getTab() {
    let queryOptions = { active: true, currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);
    return tabs[0];
}

let tabActual = "";

function setActualTab(tab){
    tabActual = tab;
}

function getActualTab(){
    return tabActual;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.greeting === "hello")
        sendResponse({farewell: getActualTab()});
    }
  );

function cleanUrl(url){
    let bars = 0;
    let init = 0;

    for(let i=0; i<url.length; i++){
        if(bars == 2 && init == 0){
            init = i;
        }
        if(url.substring(i, (i+1)) == "/"){
            bars++;
        }
        if(bars == 3){
            return url.substring(init, i);
        }
    }
}

function fusionData(data){
    let data_ = [];
    for(let i=0; i<data.length; i++){
        for(let j=0; j<data[i].length; j++){
            data_.push(data[i][j]);
        }
    }
    return data_;
}

let boolean = false;
function updateTab(){
    getTab().then(tab => {
        //url != 'undefined' ? console.log(url) : console.log("indefinido")
        chrome.action.setBadgeText({text: "-"});
        chrome.action.setBadgeBackgroundColor({color: '#e1e1e1'});

                // Data fusion
            let allData = fusionData([HACKEN, CERTIK, DIRECT]);
            
                // Normalize numbers
            let ratingNormalize = [];
            for(let i=0; i<allData.length; i++){
                if(allData[i].rating == -1 || allData[i].rating == 0 || allData[i].rating == 1 || allData[i].rating == 2 || allData[i].rating == 3 || allData[i].rating == 4){
                    ratingNormalize.push((allData[i].rating*10)/4);
                }else{
                    ratingNormalize.push(allData[i].rating/10);
                }
            }

                // Set data
            for(let i=0; i<allData.length; i++){
                
                if(cleanUrl(allData[i].url) == cleanUrl(tab.url)){// HAY QUE COMPARAR A ESTOS DOS LIMPIOS
                    boolean = true; // Si es true significa que hubo match, por lo tanto se conoce, si es false no
                    setActualTab(allData[i]);
                    let color_ = '#e1e1e1';
                    console.log(ratingNormalize[i])
                    chrome.action.setBadgeText({text: allData[i].rating <= 10 || allData[i].rating >= 0 ? ratingNormalize[i].toString() : "?"});
                    if(ratingNormalize[i] == 0){
                        color_ = '#ff2442';
                    }else if(ratingNormalize[i] <= 2.5){
                        color_ = '#ff7927';
                    }else if(ratingNormalize[i] <= 5){
                        color_ = '#ffc300';
                    }else if(ratingNormalize[i] <= 7.5){
                        color_ = '#8ac73c';
                    }else if(ratingNormalize[i] <= 10){
                        color_ = '#0cb852';
                    }
                    chrome.action.setBadgeBackgroundColor({color: color_});
                }
            }
            if(boolean == false){
                setActualTab({                
                    url: "#",
                    name: "Unknow",
                    rating: -1,
                    type: "Unknow",
                    icon: 'https://e7.pngegg.com/pngimages/1010/1016/png-clipart-smart-meter-electricity-meter-computer-icons-energy-logo-grass.png',
                    //platform: platform[i].src,
                    auditedBy: "Unknow",
                    auditorLink: "#",
                    auditReport: "Unknow"});
            }
            boolean = false;
    })
}

chrome.tabs.onUpdated.addListener(() => {
    updateTab();
})

chrome.tabs.onActivated.addListener(() => {
    updateTab();
})



