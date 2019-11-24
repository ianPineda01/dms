import {app, BrowserWindow, Menu, ipcMain, IpcMessageEvent, Accelerator} from "electron";
import * as fs from "fs";

let window:BrowserWindow = null;
let file = null;
let state:string = null;

const mainMenu = Menu.buildFromTemplate(
[ //process.platform === "darwin" ? {label: app.getName()} ,
{
    label:"Archivo",
    submenu:[
        {
            label: "Añadir",
            accelerator: process.platform === "darwin" ? "Command+N" : "Ctrl+N",
            click(){
                if(file){
                    window.webContents.send("add");
                    state = "add";
                }else{
                    window.webContents.send("noFile");
                }
            }
        },
        {
            label: "Guardar",
            accelerator: process.platform === "darwin" ? "Command+S" : "Ctrl+S",
            click(){
                switch(state){
                    case "main":
                        break;
                    case "add":
                        window.webContents.send("saveAdd");
                        break;
                }
            }
        },
        {
            label: "Editar"
        },
        {
            label: "Eliminar"
        },
        {
            label: "Salir",
            accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
            click(){
                app.quit();
            }
        },
        {
            label: "Cerrar pestaña",
            accelerator: process.platform === "darwin" ? "Command+W" : "Ctrl+W",
            click(){
                if(state !== "main"){
                    window.webContents.send("main", file);
                    state = "main";
                }
            }
        }
    ]
},
{
    label: "Ventas",
    submenu:[]
},
{
    label: "Base de datos",
    submenu:[]
},
{
    label: "Cotizaciones",
    submenu:[]
},
{
    label: "Compras",
    submenu:[]
},
{
    label: "Clientes",
    submenu:[]
},
{
    label: "Facturas",
    submenu:[]
}
]);

const createWindow = () =>{
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true
        }
    });
    window.loadFile("renderer.html");
    window.webContents.openDevTools();
    window.on("closed", () =>{
        app.quit();
    });
    Menu.setApplicationMenu(mainMenu);

    setTimeout(() =>{//Delete when on production
        const data = fs.readFileSync("./dms.json","utf-8");
        window.webContents.send("main",data);
        file = data;
        state = "main"
    },1000);
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

ipcMain.on("fileDropped", (e, path:string)=>{
    const extension = path.split(".")[1];
    if(extension === "json"){
        const data = fs.readFileSync(path,"utf-8");
        window.webContents.send("main", data);
        state = "main";
        file = data;
    }else{
        window.webContents.send("fileNotSupported");
    }
});