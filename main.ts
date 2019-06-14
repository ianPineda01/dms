import {app, BrowserWindow} from "electron";

const createWindow = () =>{
    let window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true
        }
    });
    window.loadFile("main.html");
    window.webContents.openDevTools();
    window.on("closed", () =>{
        window = null;
    });
}
app.on("ready", createWindow);
app.on("window-all-closed", () =>{
   if(process.platform !== "darwin"){
       app.quit();
   } 
});
app.on("activate", () =>{
    if(window === null){
        createWindow();
    }
});