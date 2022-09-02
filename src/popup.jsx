import React, { useState } from 'react';
import { render } from 'react-dom';
import './index.css'

function Popup(){

    const [data, setData] = useState("hello");
    
    chrome.runtime.sendMessage({greeting: data}, function(response) {
        if(response.farewell.rating == -1){

        }else if(response.farewell.rating == 0 ||response.farewell.rating == 1 ||response.farewell.rating == 2 ||response.farewell.rating == 3 || response.farewell.rating == 4){
            response.farewell.rating = (response.farewell.rating*10)/4;
        }else{
            response.farewell.rating = response.farewell.rating/10;
        }
        setData(response.farewell);
    });
    console.log(data.auditedBy)
    console.log(data)
    return (
        <div id='App'>
            <div className='App-box'>
                <p className='App-title'>DESCORE</p>
                <p className='App-subtitle'>Stay safe on the web 3.0</p>
            </div>
            <hr></hr>
            <div className='App-body'>
            <section className='App-section'>
                {
                    data.icon != undefined &&
                    <img src={data.icon} className='section-img' alt='img'></img>
                }
                <span className='section-name'>{data.name == undefined || data.name == "Unknow" ? "Waiting for web 3.0..." : data.name}</span>
            </section>
            <hr></hr>
            <div className='App-content'>
                <div className='App-content-div'>
                    <p className='content-title center'>Security and decentralization</p>

                    <div className={ 
                            data.rating > 7.5 ? "content-security verysafe" : 
                            data.rating > 5 ? "content-security safe" : 
                            data.rating > 2.5 ? "content-security notrec" : 
                            data.rating >= 0 ? "content-security unsafe" : 
                            data.rating == 666 ? "content-security scam" : "content-security unknow"
                            }>
                        <p>
                            {
                            data.rating <= 10 && data.rating >= 0 ? data.rating : "N/A"
                            }</p>
                        <p>
                            {
                            data.rating > 7.5 ? "Very safe site" : 
                            data.rating > 5 ? "Safe zone" : 
                            data.rating > 2.5 ? "Not recommendable" : 
                            data.rating >= 0 ? "Unsafe" : 
                            data.rating == 666 ? "Scam" : "Unknow"
                            }
                        </p>
                    </div>

                </div>
            </div>
            <hr></hr>
            <div className='App-content'>
                <div className='App-content-div'>
                    <p className='content-title'>Audited</p>
                    <div className='audit-content'>
                        <p className='audited-p'>{data.auditState === undefined ? "State: Unknow" : "State: "+data.auditState}</p>
                        <a className='audited-a' target={data.auditedBy == undefined ? '' : '_blank'} href={data.auditorLink}>{data.auditedBy == "Unknow" ? "" : data.auditedBy}</a>
                        <a className='audited-a' target='_blank' href={data.auditReport}>{data.auditReport == undefined || data.auditReport == "Unknow" ? "" : "Read the audit report"}</a>
                        <p className='audited-p'>{data.auditDate == "Unknow" ? "" : data.auditDate}</p>
                    </div>
                </div>
                <hr></hr>
                <div className='App-content-div'>
                    <p className='content-title'>Type</p>
                    <p className='section-type'>{data.type === undefined ? "Web 3.0" : data.type}</p>
                </div>
            </div>
            </div>
            <hr></hr>
            <div>
                <div className='content-block'>
                    <div className='icon-explication minus'>10</div>
                    <span className='span-explication'>Score</span>
                </div>
                <hr></hr>
                <div className='content-block'>
                    <div className='icon-explication minus'>-</div>
                    <span className='span-explication'>The web is not 3.0 or is not in our database</span>
                </div>
                <hr></hr>
                <div className='content-block'>
                    <div className='icon-explication noscore'>?</div>
                    <span className='span-explication'>There is no score</span>
                </div>
            </div>
            <hr></hr>
            <div className='footer'>
                <a className='content-a' href='https://hacken.io/audits/'>Github</a>
                <a className='content-a' href='https://hacken.io/audits/'>Website</a>
                <a className='content-a' href='https://hacken.io/audits/'>Privacy Policy</a>
                <a className='content-a' href='https://hacken.io/audits/'>Terms of use</a>
            </div>
        </div>
    );
}

render(<Popup/>, document.getElementById("react-target"));                
