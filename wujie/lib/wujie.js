const strTempWithCss = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width= , initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id='inner'>hello wujie</div>
    
    <style>
        div{background-color: red}
    </style>
</body>
</html>
`;

const strScript = `
window.testA = 1000;    // 此属性不会影响父应用
console.log(window.testA)
const ele = document.querySelector('#inner');
console.log(ele)
`;

function createIframe() {
    const iframe = document.createElement('iframe');
    iframe.src = 'about:blank';
    document.body.appendChild(iframe);
    return iframe;
}

function createSandbox() {
    const sandbox = {
        iframe: createIframe(),
        shadowRoot: null
    };
    return sandbox;
}

function injectTemplate(sandbox, template) {
    const warpper = document.createElement('div');
    warpper.innerHTML = template;
    sandbox.shadowRoot.appendChild(warpper);
}

function runScriptsInSandbox(sandbox, scriptStr) {
    const iframeWindow = sandbox.iframe.contentWindow;
    const scriptElement = iframeWindow.document.createElement('script');
    const headElement = iframeWindow.document.querySelector('head');

    // 我们希望在脚本执行之前,有的方法用的是父应用的
    // document.querySelector 应该用的不是iframe中的   要用shadowRoot去处理
    // 添加弹框的时候, document.createElement().appendChild() -> 代理到全局的window

    // iframe里面的路由管理  history.pushState ->将一些常用的方法进行同步到主应用
    Object.defineProperty(iframeWindow.Document.prototype, 'querySelector', {
        get() {
            // 加载的脚本内部调用了querySelector

            // document.querySelector()  =>  sanbox.shadowRoot['querySelector']
            return new Proxy(sandbox.shadowRoot['querySelector'], {
                apply(target, thisArgs, args) {
                    // console.log(target, thisArgs, args);
                    return thisArgs.querySelector.apply(sandbox.shadowRoot, args);
                }
            });
        }
    });

    scriptElement.textContent = scriptStr;
    headElement.appendChild(scriptElement);
}

function createCustomElement() {
    class WujieApp extends HTMLElement {

        connectedCallback() {
            // 1.创建iframe沙箱
            const sandbox = createSandbox();
            // 2.创建shadowDOM
            sandbox.shadowRoot = this.attachShadow({ mode: "open" });
            // 3.将html css放入shadowDOM
            injectTemplate(sandbox, strTempWithCss);
            // 4.在沙箱内执行js
            runScriptsInSandbox(sandbox, strScript);
        }
    }

    window.customElements.define('wujie-app', WujieApp);
    document.getElementById('container').appendChild(document.createElement('wujie-app'));
}

createCustomElement();

console.log(document.querySelector('#inner'));