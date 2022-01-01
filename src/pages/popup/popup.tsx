import * as React from "react";
import * as ReactDOM from "react-dom";
import { WcSessionPostCmd } from '../../core/cmd/index';
import { ScUserModel } from '../../core/models';
import { Scheduler } from '../../core/services/index';
import './popup.scss';


class LoginComponent extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    componentDidMount() {
        let sessionToken = localStorage.getItem("sessionToken");
        if (sessionToken) {
            window.location.href = "../main/main.html";
        }
    }

    login() {
        //处理已经爬到的工单
        // let user: ScUserModel = new ScUserModel();
        // user.mobile = this.state.username;
        // user.password = this.state.password;
        // let cmd: WcSessionPostCmd = new WcSessionPostCmd(user);
        // cmd.setAfterRespDo(() => {
        chrome.browserAction.setPopup({ popup: "./pages/main/main.html" });
        window.location.href = "../main/main.html";
        // })
        // Scheduler.exe(cmd);
    }

    updateInputValue(property: string, evt: any) {
        let data = {};
        data[property] = evt.target.value;
        this.setState(data)
    }

    onKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            this.login()
        }
    }
    render() {
        return <div>
            <div className="logo">
                <img src="/assets/images/logo.png" alt="" />
            </div>
            <div className="login-form">
                <div className="form-item">
                    <input type="text" value={this.state.username}
                        onKeyDown={(evt) => { this.onKeyDown(evt) }}
                        onChange={(event) => { this.updateInputValue("username", event) }} />
                </div>
                <div className="form-item">
                    <input type="password" value={this.state.password}
                        onKeyDown={(evt) => { this.onKeyDown(evt) }}
                        onChange={(event) => { this.updateInputValue("password", event) }} />
                </div>
                <div className="form-item">
                    <button id="login" onClick={() => { this.login() }}>登录</button>
                </div>
            </div>
        </div>
    }
}


ReactDOM.render(
    <LoginComponent>
    </LoginComponent>,
    document.getElementById("app")
);




